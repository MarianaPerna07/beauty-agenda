from flask import Flask, request, jsonify, g
from datetime import datetime, timezone
from flask_cors import CORS
from pymongo import MongoClient
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
import time, jwt, os, hashlib, uuid
from functools import wraps
import pytz

from aux import get_available_slots, get_slot_from_datetime

# === Application Setup ===
app = Flask(__name__)
CORS(
    app,
    origins=["*"],
    supports_credentials=False,
    allow_headers="*",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
LOCAL_TZ = pytz.timezone('Europe/Lisbon')  

# === MongoDB Connection ===
mongo_uri = "mongodb://root:example@127.0.0.1:27017/"
client = MongoClient(mongo_uri)
db = client["estetica"]
collection = db["appointements"] 

# === Constants ===
SLOT_DURATION = 15  # Duration of each slot in minutes

# === Authentication Setup ===
GOOGLE_CLIENT_ID = os.environ.get(
    "GOOGLE_CLIENT_ID",
    "<your-google-client-id>.apps.googleusercontent.com",
)
JWT_SECRET = os.environ.get("JWT_SECRET", "change_this_to_a_strong_random_value")
ALLOWED_EMAILS = {os.environ.get("ALLOWED_EMAIL", "<mail>@gmail.com")}

# === Token Lifetime ===
ACCESS_TTL = 24 * 60 * 60  # seconds

# === Authentication Helpers ===
def _compute_fingerprint():
    """Create a fingerprint based on client IP + User-Agent."""
    ua = request.headers.get("User-Agent", "")
    ip = request.remote_addr or ""
    digest = hashlib.sha256(f"{ip}|{ua}".encode()).hexdigest()
    return digest

def create_jwt(email: str):
    """Mint a JWT bound to the client fingerprint."""
    now = int(time.time())
    jti = str(uuid.uuid4())
    fp = _compute_fingerprint()
    payload = {
        "sub": email,
        "iat": now,
        "exp": now + ACCESS_TTL,
        "jti": jti,
        "fp": fp,
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def verify_jwt(token: str):
    """Validate JWT signature, expiry, allowlist, and fingerprint match."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

    if payload.get("sub") not in ALLOWED_EMAILS:
        return None
    # Recompute fingerprint and compare
    expected_fp = payload.get("fp")
    if expected_fp != _compute_fingerprint():
        return None

    return payload

def require_jwt(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "missing token"}), 401
        token = auth.split(None, 1)[1]
        payload = verify_jwt(token)
        if not payload:
            return jsonify({"error": "invalid or expired token"}), 401
        g.user_email = payload["sub"]
        return f(*args, **kwargs)
    return wrapper

# === Authentication Endpoint ===
@app.route("/auth/google", methods=["POST"])
def auth_google():
    """Authenticate user with Google ID token."""
    data = request.get_json(silent=True) or {}
    idt = data.get("id_token")
    if not idt:
        return jsonify({"error": "missing data"}), 400

    # Verify Google ID token
    try:
        info = id_token.verify_oauth2_token(
            idt, 
            grequests.Request(), 
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=60
        )
    except Exception as e:
        return jsonify({"error": "invalid google token", "details": str(e)}), 401

    email = info.get("email")
    if not info.get("email_verified") or email not in ALLOWED_EMAILS:
        return jsonify({"error": "forbidden"}), 403

    # Mint our JWT
    access_token = create_jwt(email)
    return jsonify({
        "access_token": access_token,
        "token_type": "Bearer",
        "expires_in": ACCESS_TTL,
        "email": email,
    })

# === Clientside Endpoints ===

# Endpoint to get available slots
@app.route("/availability", methods=["GET"])
def get_availability():
    """Check availability for a service and worker on a specific date."""
    try:
        service_id_str = str(request.args.get("service_id"))
        worker_id_str = str(request.args.get("worker_id"))
        date_str = str(request.args.get("date"))
        
        # Validate required parameters
        if not all([service_id_str, worker_id_str, date_str]):
            return jsonify({"error": "Invalid request parameters"}), 400
        
        # Convert and validate integers
        try:
            if service_id_str is None or worker_id_str is None:
                return jsonify({"error": "Invalid request parameters"}), 400
            service_id = int(service_id_str)
            worker_id = int(worker_id_str)
        except (ValueError, TypeError):
            print(f"Invalid service_id: {service_id_str} or worker_id: {worker_id_str}")
            return jsonify({"error": "Invalid request parameters"}), 400
            
        # Convert and validate date
        try:
            date = datetime.fromisoformat(date_str)
            if date.tzinfo is None:
                date = date.replace(tzinfo=timezone.utc)
        except (ValueError, TypeError):
            print(f"Invalid date format: {date_str}")
            return jsonify({"error": "Invalid request parameters"}), 400
        
        # Basic validation
        if service_id < 0 or worker_id < 0:
            print(f"Invalid service_id: {service_id} or worker_id: {worker_id}")
            return jsonify({"error": "Invalid request parameters"}), 400
            
        #if date < datetime.now(timezone.utc):
        #    print(f"Invalid date: {date} is in the past.")
        #    return jsonify({"error": "Invalid request parameters"}), 400
        
        print(f"Checking availability for service {service_id}, worker {worker_id}")
        
        #Validate service_id against a list of available services (query from database) and get service duration
        collection = db["services"]
        service = collection.find_one({"service_id": service_id}) 
        if service is None:
            return jsonify({"error": "Invalid request parameters"}), 400
        
        service_duration = service["duration"]
        slots_number = service_duration // SLOT_DURATION

        collection = db["workers"]
        worker = collection.find_one({"worker_id": worker_id}) 
        if worker is None:
            return jsonify({"error": "Invalid worker ID"}), 400
        
        #print(date.replace(hour=9, minute=0, second=0, microsecond=0))
        #print(date.replace(hour=18, minute=45, second=0, microsecond=0))
        # Use UTC-aware datetime objects
        # start_time = datetime(2025, 8, 6, 9, 0, 0, tzinfo=timezone.utc)
        # end_time = datetime(2025, 8, 6, 19, 0, 0, tzinfo=timezone.utc)
        # print(f"Start time: {start_time}, End time: {end_time}")

        # # Query to match datetime_service_start in interval
        # query = {
        #     "worker_id": worker_id,
        #     "datetime_service_start": {
        #         "$gte": start_time,
        #         "$lte": end_time
        #     }
        # }

        #Query database appointments collection for the slots with the worker_id and date
        collection = db["appointements"]
        appointments = list(collection.find({"worker_id": worker_id, "datetime_service_start": {"$gte": date.replace(hour=9, minute=0, second=0, microsecond=0), "$lt": date.replace(hour=18, minute=45, second=0, microsecond=0)}}, {"_id": 0}))
        # appointments = list(collection.find(query))

        slots_availability = get_available_slots(slots_number, worker_id, date, appointments)

        #print(f"Available slots: {slots_availability}")
        return jsonify({"available_slots": slots_availability}), 200
        
    except Exception as e:
        print(f"Error checking availability: {str(e)}")  # Log for debugging
        return jsonify({"error": "Unable to process request"}), 500

# Endpoint to create a reservation
@app.route("/reservation", methods=["POST"])
def create_reservation():
    """Create a reservation for a service with a worker."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid request format"}), 400
        
        # Define required fields (email is optional)
        required_fields = ["name", "phone", "service_id", "worker_id", "reservation_time"]
        
        # Check all required fields are present
        for field in required_fields:
            if field not in data or data[field] is None:
                return jsonify({"error": "Invalid request data"}), 400
        
        # Parse and validate each field
        name = str(data.get("name")).strip()
        if not name or len(name) < 2:
            return jsonify({"error": "Invalid request data"}), 400
            
        # Email is optional - validate only if provided
        email = None
        if "email" in data and data.get("email") is not None:
            email = str(data.get("email")).strip()
            if email and ("@" not in email or len(email) < 5):
                return jsonify({"error": "Invalid request data"}), 400
            
        phone = str(data.get("phone")).strip()
        if not phone or len(phone) < 9:
            return jsonify({"error": "Invalid request data"}), 400
            
        service_id = int(data.get("service_id"))
        if service_id <= 0:
            return jsonify({"error": "Invalid request data"}), 400
            
        worker_id = int(data.get("worker_id"))
        if worker_id <= 0:
            return jsonify({"error": "Invalid request data"}), 400
        
        date = datetime.fromisoformat(data.get("reservation_time"))
        local_date = date.astimezone(LOCAL_TZ).replace(tzinfo=None)  
        if local_date < datetime.now(LOCAL_TZ).replace(tzinfo=None):
            return jsonify({"error": "Invalid request data"}), 400
        
        print(f"Creating reservation for: {name[:3]}*** at {date}")
        
        #TODO: Validate service_id, worker_id, and location_id against the database

        #Check if user exists
        collection = db["clients"]
        result = collection.find_one({"phone": phone})
        #print("passou request")

        # If user does not exist, create a new client record
        if result is None:
            # print(f"Creating new client record for phone: {phone}")
            client = {
                "name" : name,
                "email" : email,
                "phone" : phone,
                "birthday" : None,
                "registration_day" : datetime.fromisoformat(datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%dT%H:%M:%S')),
                "total_reservations" : 0
            }

            collection = db["clients"]
            collection.insert_one(client)


        #get service duration from the database
        collection = db["services"]
        service = collection.find_one({"service_id": service_id}) 
        if service is None:
            return jsonify({"error": "Invalid request data"}), 400
        
        #print("Service found:", service)
        service_duration = service["duration"]
        slots_number = service_duration // SLOT_DURATION

        #logic to create a reservation in the database
        appointment = {
            "phone" : phone,
            "service_id" : service_id,
            "worker_id" : worker_id,
            "slots_number" : slots_number,
            "datetime_service_start" : local_date
        }

        collection = db["appointements"]

        # Check if any existing appointment conflicts with the new on
        # Use the get_available_slots function to check for conflicts
        appointments = list(collection.find({"worker_id": worker_id, "datetime_service_start": {"$gte": local_date.replace(hour=9, minute=0, second=0, microsecond=0), "$lt": local_date.replace(hour=18, minute=45, second=0, microsecond=0)}}, {"_id": 0}))
        slots_availability = get_available_slots(slots_number, worker_id, local_date, appointments)

        # Check if the requested slot is available
        start_slot = get_slot_from_datetime(local_date)
        if slots_availability.get(start_slot) != 0:
            return jsonify({"error": "Requested time slot is not available"}), 400

        result = collection.insert_one(appointment)
        
        if result.inserted_id:
            return jsonify({"message": "Reservation created successfully"}), 201
        else:
            return jsonify({"error": "Unable to process request"}), 500
            
    except Exception as e:
        print(f"Error processing reservation: {str(e)}")  # Log for debugging
        return jsonify({"error": "Unable to process request"}), 500


# Endpoint to get a all reservations from a worker
@app.route("/reservations", methods=["GET"])
def get_reservations():
    """Get all reservations for a specific worker."""
    try:
        worker_id_str = request.args.get("worker_id")

        # Validate required parameters
        if not all([worker_id_str]):
            return jsonify({"error": "Invalid request parameters"}), 400


        # Convert and validate integers
        try:
            if worker_id_str is None:
                return jsonify({"error": "Invalid request parameters"}), 400
            worker_id = int(worker_id_str)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid request parameters"}), 400
        
        #Query DB for the reservations documents
        collection = db["appointements"]
        reservations = list(collection.find({"worker_id": worker_id}, {"_id": 0})) 
        return jsonify({"reservations": reservations}), 200
    
    except Exception as e:
        print(f"Error deleting reservation: {str(e)}")
        return jsonify({"error": "Unable to fetch reservations"}), 500

# Endpoint to get available services
@app.route("/services", methods=["GET"])
def get_services():
    """Get all available services."""
    try:
        collection = db["services"]
        services = list(collection.find({}, {"_id": 0}))
        return jsonify({"services": services}), 200
    except Exception as e:
        print(f"Error getting services: {str(e)}")
        return jsonify({"error": "Unable to get services"}), 500
    

# Endpoint to get workers
@app.route("/workers", methods=["GET"])
def get_workers():
    """Get all workers."""
    try:
        collection = db["workers"]
        workers = list(collection.find({}, {"_id": 0}))
        return jsonify({"workers": workers}), 200
    except Exception as e:
        print(f"Error getting workers: {str(e)}")
        return jsonify({"error": "Unable to get workers"}), 500
    

# === Admin Endpoints ===
# [ADMIN]
# Endpoint to delete a reservation
@app.route("/reservation", methods=["DELETE"])
@require_jwt
def delete_reservations():
    try:
        #reservation_id = request.args.get("reservation-id")
        worker_id_str = str(request.args.get("worker_id"))
        date_str = str(request.args.get("date"))
        print(f"worker_id: {worker_id_str}, date: {date_str}")
        
        if (worker_id_str is None ) or (date_str is None):
            return jsonify({"error": "Invalid request parameters"}), 400
        
        # Convert and validate reservation_id
        try:
            worker_id = int(worker_id_str)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid worker id parameters"}), 400
        
        # Query the database to delete the reservation
        collection = db["appointements"]
        
        #Delete the reservation based on worker_id and date
        result = collection.delete_one({"worker_id": worker_id, "datetime_service_start": datetime.fromisoformat(date_str)})
        
        if result.deleted_count > 0:
            return jsonify({"message": "Reservation deleted successfully"}), 200
        else:
            return jsonify({"error": "Reservation not found"}), 404
            
    except Exception as e:
        print(f"Error deleting reservation: {str(e)}")
        return jsonify({"error": "Unable to delete reservation"}), 500


# [ADMIN]
# Endpoint to get all clients 
@app.route("/detailedReservations", methods=["POST"])
@require_jwt
def get_detailed_reservations():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid request format"}), 400
        
        # Define required fields (email is optional)
        required_fields = ["scope", "worker_id", "datetime_check"]
        
        # Check all required fields are present
        for field in required_fields:
            if field not in data or data[field] is None:
                return jsonify({"error": "Invalid request data"}), 400
        
        
        scope = data.get("scope")
        if scope not in ["daily", "monthly"]:
            return jsonify({"error": "Invalid request data"}), 400
            
        worker_id = int(data.get("worker_id"))
        if worker_id <= 0:
            return jsonify({"error": "Invalid request data"}), 400

        date = datetime.fromisoformat(data.get("datetime_check"))
        local_date = date.astimezone(LOCAL_TZ).replace(tzinfo=None)  
        #if local_date < datetime.now(LOCAL_TZ).replace(tzinfo=None):
            #return jsonify({"error": "Invalid request data"}), 400
        
                
        print(f"Getting detailed reservations for worker {worker_id} on {date} with scope {scope}")

        # Query the database for detailed reservations
        collection = db["appointements"]
        if scope == "daily":
            start_time = local_date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_time = local_date.replace(hour=23, minute=59, second=59, microsecond=999999)
            appointments = list(collection.find({"worker_id": worker_id, "datetime_service_start": {"$gte": start_time, "$lt": end_time}}, {"_id": 0}))
        elif scope == "monthly":
            start_time = local_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            #end_time = (start_time + pd.DateOffset(months=1)).replace(hour=23, minute=59, second=59, microsecond=999999)
            end_time = start_time.replace(month=start_time.month % 12 + 1, day=1, hour=0, minute=0, second=0, microsecond=0)
            appointments = list(collection.find({"worker_id": worker_id, "datetime_service_start": {"$gte": start_time, "$lt": end_time}}, {"_id": 0}))
            
        else:
            return jsonify({"error": "Invalid request data"}), 400  
        
        #expand each appointment with client details
        clients_list = list(collection.find({}, {"_id": 0}))
        for appointment in appointments:
            client = next((client for client in clients_list if client["phone"] == appointment["phone"]), None)
            if client:
                appointment["client"] = client
                del appointment["phone"]

        #expand each appointment with service details
        services_list = list(db["services"].find({}, {"_id": 0}))
        for appointment in appointments:
            service = next((service for service in services_list if service["service_id"] == appointment["service_id"]), None)
            if service:
                appointment["service"] = service
                del appointment["service_id"]

        #expand each appointment with worker details
        workers_list = list(db["workers"].find({}, {"_id": 0}))
        for appointment in appointments:
            worker = next((worker for worker in workers_list if worker["worker_id"] == appointment["worker_id"]), None)
            if worker:
                appointment["worker"] = worker
                del appointment["worker_id"] 
        
        return jsonify({"appointments": appointments}), 200
    
    except Exception as e:
        print(f"Error accessing reservation: {str(e)}")
        return jsonify({"error": "Unable to access reservations"}), 500
        


# [ADMIN]
# Endpoint to get all clients 
@app.route("/clients", methods=["GET"])
@require_jwt
def get_clients():
    try:
        collection = db["clients"]
        clients = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB's default _id field
        return jsonify({"clients": clients}), 200
    except Exception as e:
        print(f"Error fetching clients: {str(e)}")
        return jsonify({"error": "Unable to fetch clients"}), 500


# [ADMIN]
# Endpoint to change a specific client by phone number
@app.route("/client/<client_phone>", methods=["POST"])
@require_jwt
def update_client(client_phone):
    try:
        data = request.get_json()
        print("data:", data)
        print("client_phone:", client_phone)
        print(type(client_phone))
        
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid request format"}), 400
        
        collection = db["clients"]
        result = collection.update_one({"phone": client_phone}, {"$set": data})
        print("result:", result)
        
        if result.modified_count > 0:
            return jsonify({"message": "Client updated successfully"}), 200
        else:
            return jsonify({"error": "Client not found or no changes made"}), 404
            
    except Exception as e:
        print(f"Error updating client: {str(e)}")
        return jsonify({"error": "Unable to update client"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5001)
