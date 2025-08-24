# Enhanced Flask API with Rate Limiting and Input Validation
from flask import Flask, request, jsonify, g
from datetime import datetime, timezone
from flask_cors import CORS
from pymongo import MongoClient
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
import time, jwt, os, hashlib, uuid, re
from functools import wraps
import pytz

# NEW IMPORTS FOR SECURITY
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from marshmallow import Schema, fields, validate, ValidationError
import logging

from aux import get_available_slots, get_slot_from_datetime

# === Application Setup ===
app = Flask(__name__)
CORS(
    app,
    origins=["*"],  # TODO: Change this to specific domains in production
    supports_credentials=False,
    allow_headers="*",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
LOCAL_TZ = pytz.timezone('Europe/Lisbon')

# === Constants ===
SLOT_DURATION = 15
NUM_WOKRERS = 2
NUM_SERVICES = 51

# === SECURITY: Rate Limiting Setup ===
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

# === SECURITY: Input Validation Schemas ===
class AvailabilitySchema(Schema):
    service_id = fields.Int(required=True, validate=validate.Range(min=1, max=NUM_SERVICES))
    worker_id = fields.Int(required=True, validate=validate.Range(min=1, max=NUM_WOKRERS))
    date = fields.DateTime(required=True)

class ReservationSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(allow_none=True, load_default=None)
    phone = fields.Str(validate=[
        validate.Length(min=9, max=16),
        validate.Regexp(r'^[\+]?[\d\s\-\(\)]+$')
    ])
    service_id = fields.Int(required=True, validate=validate.Range(min=1, max=NUM_SERVICES))
    worker_id = fields.Int(required=True, validate=validate.Range(min=1, max=NUM_WOKRERS))
    reservation_time = fields.DateTime(required=True)

class DetailedReservationsSchema(Schema):
    scope = fields.Str(required=True, validate=validate.OneOf(["daily", "monthly"]))
    worker_id = fields.Int(required=True, validate=validate.Range(min=1, max=NUM_WOKRERS))
    datetime_check = fields.DateTime(required=True)
    _ts = fields.Int(required=False)  # Optional timestamp for caching

class ClientUpdateSchema(Schema):
    name = fields.Str(validate=[
        validate.Length(min=2, max=100),
        validate.Regexp(r'^[a-zA-Z\s\-]+$', error="Name can only contain letters, spaces, and hyphens")

    ], load_default=None)
    email = fields.Email(allow_none=True, load_default=None)
    phone = fields.Str(validate=[
        validate.Length(min=9, max=16),
        validate.Regexp(r'^[\+]?[\d\s\-\(\)]+$')
    ], load_default=None)
    birthday = fields.DateTime(allow_none=True, load_default=None)

    

# === SECURITY: Input Sanitization Functions ===
def sanitize_string(value, max_length=None):
    """Sanitize string input to prevent injection attacks"""
    if not isinstance(value, str):
        value = str(value)
    
    # Remove potentially dangerous characters
    value = re.sub(r'[<>"\';\\]', '', value)
    
    # Limit length
    if max_length:
        value = value[:max_length]
    
    return value.strip()

def sanitize_mongo_query(query_dict):
    """Remove MongoDB operators from user input to prevent injection"""
    if not isinstance(query_dict, dict):
        return query_dict
    
    sanitized = {}
    for key, value in query_dict.items():
        # Remove keys starting with $ (MongoDB operators)
        if not key.startswith('$'):
            if isinstance(value, dict):
                sanitized[key] = sanitize_mongo_query(value)
            elif isinstance(value, str):
                sanitized[key] = sanitize_string(value)
            else:
                sanitized[key] = value
    
    return sanitized

def validate_phone_format(phone):
    """Validate phone number format"""
    # Remove spaces, dashes, parentheses
    clean_phone = re.sub(r'[\s\-\(\)]', '', phone)
    
    # Check if it's a valid format (9-15 digits, optional + at start)
    if not re.match(r'^\+?[\d]{9,15}$', clean_phone):
        return False
    
    return clean_phone

# === SECURITY: Enhanced Error Handling ===
def create_error_response(message, status_code=400, log_details=None):
    """Create standardized error response and log security events"""
    if log_details:
        app.logger.warning(f"Security Event - IP: {request.remote_addr} - {log_details}")
    
    # Don't expose internal details in production
    if app.debug:
        return jsonify({"error": message}), status_code
    else:
        generic_messages = {
            400: "Invalid request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not found",
            500: "Internal server error"
        }
        return jsonify({"error": generic_messages.get(status_code, "Error")}), status_code

# === MongoDB Connection ===
mongo_uri = "mongodb://root:example@127.0.0.1:27017/"
client = MongoClient(mongo_uri)
db = client["estetica"]
collection = db["appointements"]

# === Authentication Setup ===
GOOGLE_CLIENT_ID = os.environ.get(
    "GOOGLE_CLIENT_ID",
    "<your-google-client-id>.apps.googleusercontent.com",
)
JWT_SECRET = os.environ.get("JWT_SECRET", "change_this_to_a_strong_random_value")
ALLOWED_EMAILS = {os.environ.get("ALLOWED_EMAIL", "<mail>@gmail.com")}

# === Token Lifetime ===
ACCESS_TTL = 24 * 60 * 60

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
    
    expected_fp = payload.get("fp")
    if expected_fp != _compute_fingerprint():
        return None

    return payload

def require_jwt(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return create_error_response("Missing or invalid token", 401, "Missing Bearer token")
        
        token = auth.split(None, 1)[1]
        payload = verify_jwt(token)
        if not payload:
            return create_error_response("Invalid or expired token", 401, f"Invalid JWT attempt")
        
        g.user_email = payload["sub"]
        return f(*args, **kwargs)
    return wrapper

# === Authentication Endpoint ===
@app.route("/auth/google", methods=["POST"])
@limiter.limit("5 per minute")  # SECURITY: Rate limit authentication attempts
def auth_google():
    """Authenticate user with Google ID token."""
    try:
        data = request.get_json(silent=True) or {}
        idt = data.get("id_token")
        if not idt:
            return create_error_response("Missing ID token", 400, "Missing ID token in auth request")

        # Verify Google ID token
        info = id_token.verify_oauth2_token(
            idt, 
            grequests.Request(), 
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=60
        )
        
        email = info.get("email")
        if not info.get("email_verified") or email not in ALLOWED_EMAILS:
            return create_error_response("Forbidden", 403, f"Unauthorized email attempt: {email}")

        # Mint our JWT
        access_token = create_jwt(email)
        app.logger.info(f"Successful authentication for {email} from IP {request.remote_addr}")
        
        return jsonify({
            "access_token": access_token,
            "token_type": "Bearer",
            "expires_in": ACCESS_TTL,
            "email": email,
        })
        
    except Exception as e:
        app.logger.error(f"Authentication error: {str(e)}")
        return create_error_response("Authentication failed", 401, f"Auth exception: {str(e)}")

# === Clientside Endpoints ===

@app.route("/availability", methods=["GET"])
@limiter.limit("30 per minute")
def get_availability():
    """Check availability for a service and worker on a specific date."""
    try:
        # SECURITY: Validate input using schema
        raw_data = {
            'service_id': request.args.get("service_id"),
            'worker_id': request.args.get("worker_id"),
            'date': request.args.get("date")
        }
        
        schema = AvailabilitySchema()
        try:
            validated_data = schema.load(raw_data)
        except ValidationError as err:
            return create_error_response("Invalid parameters", 400, f"Validation error: {err.messages}")
        
        if not validated_data or not isinstance(validated_data, dict):
            return create_error_response("Invalid parameters", 400)
        
        service_id = validated_data['service_id']
        worker_id = validated_data['worker_id']
        date = validated_data['date']
        
        if date.tzinfo is None:
            date = date.replace(tzinfo=timezone.utc)
        
        print(f"Checking availability for service {service_id}, worker {worker_id} on {date}")
        
        # SECURITY: Sanitize database queries
        service_query = sanitize_mongo_query({"service_id": service_id})
        worker_query = sanitize_mongo_query({"worker_id": worker_id})
        
        # Validate service_id
        collection = db["services"]
        service = collection.find_one(service_query) 
        if service is None:
            return create_error_response("Invalid service", 400)
        
        service_duration = service["duration"]
        slots_number = service_duration // SLOT_DURATION

        # Validate worker_id
        collection = db["workers"]
        worker = collection.find_one(worker_query) 
        if worker is None:
            return create_error_response("Invalid worker", 400)
        
        # Query database appointments
        collection = db["appointements"]
        appointment_query = {
            "worker_id": worker_id,
            "datetime_service_start": {
                "$gte": date.replace(hour=9, minute=0, second=0, microsecond=0),
                "$lt": date.replace(hour=20, minute=0, second=0, microsecond=0)
            }
        }
        
        appointments = list(collection.find(appointment_query, {"_id": 0}))
        slots_availability = get_available_slots(slots_number, worker_id, date, appointments)

        return jsonify({"available_slots": slots_availability}), 200
        
    except Exception as e:
        app.logger.error(f"Error checking availability: {str(e)}")
        return create_error_response("Unable to process request", 500)

@app.route("/reservation", methods=["POST"])
@limiter.limit("10 per minute")
def create_reservation():
    """Create a reservation for a service with a worker."""
    try:
        data = request.get_json()
        if not data:
            return create_error_response("Invalid request format", 400)
        
        if 'email' in data and data['email'] == '':
            data['email'] = None
        
        # SECURITY: Validate input using schema
        schema = ReservationSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            return create_error_response("Invalid request data", 400, f"Validation error: {err.messages}")
        
        if not validated_data or not isinstance(validated_data, dict):
            return create_error_response("Invalid request data", 400)
        
        # Extract and sanitize validated data
        name = sanitize_string(validated_data['name'], 100)
        email = sanitize_string(validated_data['email'], 100) if validated_data.get('email') else None
        phone_raw = validated_data['phone']
        service_id = validated_data['service_id']
        worker_id = validated_data['worker_id']
        date = validated_data['reservation_time']
        
        # SECURITY: Additional phone validation
        phone = validate_phone_format(phone_raw)
        if not phone:
            return create_error_response("Invalid phone format", 400)
        
        # Convert timezone
        local_date = date.astimezone(LOCAL_TZ).replace(tzinfo=None)
        if local_date < datetime.now(LOCAL_TZ).replace(tzinfo=None):
            return create_error_response("Cannot book appointments in the past", 400)
        
        print(f"Creating reservation for: {name[:3]}*** at {date}")
        
        # SECURITY: Check daily reservation limit per phone number
        today = datetime.now(LOCAL_TZ).replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow = today.replace(day=today.day + 1)
        
        collection = db["appointements"]
        daily_count = collection.count_documents(sanitize_mongo_query({
            "phone": phone,
            "datetime_service_start": {"$gte": today, "$lt": tomorrow}
        }))
        
        if daily_count >= 3:  # Max 3 reservations per day
            return create_error_response("Daily reservation limit exceeded", 429)
        
        # Check if client exists
        collection = db["clients"]
        client_query = sanitize_mongo_query({"phone": phone})
        result = collection.find_one(client_query)

        # Create client if doesn't exist
        if result is None:
            client = {
                "name": name,
                "email": email,
                "phone": phone,
                "birthday": None,
                "registration_day": datetime.fromisoformat(datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%dT%H:%M:%S')),
                "total_reservations": 0
            }
            # SECURITY: Sanitize client data before insertion
            client = sanitize_mongo_query(client)
            collection.insert_one(client)

        # Validate service exists
        collection = db["services"]
        service_query = sanitize_mongo_query({"service_id": service_id})
        service = collection.find_one(service_query) 
        if service is None:
            return create_error_response("Invalid service", 400)
        
        service_duration = service["duration"]
        slots_number = service_duration // SLOT_DURATION

        # Create appointment
        appointment = {
            "phone": phone,
            "service_id": service_id,
            "worker_id": worker_id,
            "slots_number": slots_number,
            "datetime_service_start": local_date
        }

        collection = db["appointements"]

        # Check availability
        appointment_query = {
            "worker_id": worker_id,
            "datetime_service_start": {
                "$gte": local_date.replace(hour=9, minute=0, second=0, microsecond=0),
                "$lt": date.replace(hour=20, minute=0, second=0, microsecond=0)
            }
        }
        
        appointments = list(collection.find(appointment_query, {"_id": 0}))
        slots_availability = get_available_slots(slots_number, worker_id, local_date, appointments)

        start_slot = get_slot_from_datetime(local_date)
        if slots_availability.get(start_slot) != 0:
            return create_error_response("Unavailable", 400)

        # SECURITY: Sanitize appointment data before insertion
        appointment = sanitize_mongo_query(appointment)
        result = collection.insert_one(appointment)
        
        if result.inserted_id:
            app.logger.info(f"Reservation created for phone {phone[:3]}*** at {date}")
            return jsonify({"message": "Reservation created successfully"}), 201
        else:
            return create_error_response("Unable to create reservation", 500)
            
    except Exception as e:
        app.logger.error(f"Error processing reservation: {str(e)}")
        return create_error_response("Unable to process request", 500)

@app.route("/reservations", methods=["GET"])
@limiter.limit("20 per minute")  # SECURITY: Rate limit reservations lookup
def get_reservations():
    """Get all reservations for a specific worker."""
    try:
        worker_id_str = request.args.get("worker_id")

        if not worker_id_str:
            return create_error_response("Missing worker_id", 400)

        try:
            worker_id = int(worker_id_str)
            if worker_id <= 0:
                raise ValueError("Invalid worker_id")
        except (ValueError, TypeError):
            return create_error_response("Invalid worker_id", 400)
        
        # SECURITY: Sanitize query
        collection = db["appointements"]
        query = sanitize_mongo_query({"worker_id": worker_id})
        reservations = list(collection.find(query, {"_id": 0})) 
        
        return jsonify({"reservations": reservations}), 200
    
    except Exception as e:
        app.logger.error(f"Error fetching reservations: {str(e)}")
        return create_error_response("Unable to fetch reservations", 500)

@app.route("/services", methods=["GET"])
@limiter.limit("50 per minute")  # SECURITY: Rate limit services lookup
def get_services():
    """Get all available services."""
    try:
        collection = db["services"]
        services = list(collection.find({}, {"_id": 0}))
        return jsonify({"services": services}), 200
    except Exception as e:
        app.logger.error(f"Error getting services: {str(e)}")
        return create_error_response("Unable to get services", 500)

@app.route("/workers", methods=["GET"])
@limiter.limit("50 per minute")  # SECURITY: Rate limit workers lookup
def get_workers():
    """Get all workers."""
    try:
        collection = db["workers"]
        workers = list(collection.find({}, {"_id": 0}))
        return jsonify({"workers": workers}), 200
    except Exception as e:
        app.logger.error(f"Error getting workers: {str(e)}")
        return create_error_response("Unable to get workers", 500)

# === Admin Endpoints ===

@app.route("/reservation", methods=["DELETE"])
@require_jwt
@limiter.limit("20 per minute")  # SECURITY: Rate limit admin operations
def delete_reservations():
    try:
        worker_id_str = request.args.get("worker_id")
        date_str = request.args.get("date")
        
        if not worker_id_str or not date_str:
            return create_error_response("Missing parameters", 400)
        
        try:
            worker_id = int(worker_id_str)
            date = datetime.fromisoformat(date_str)
        except (ValueError, TypeError):
            return create_error_response("Invalid parameters", 400)
        
        collection = db["appointements"]
        
        # SECURITY: Sanitize delete query
        delete_query = sanitize_mongo_query({
            "worker_id": worker_id,
            "datetime_service_start": date
        })
        
        result = collection.delete_one(delete_query)
        
        if result.deleted_count > 0:
            app.logger.info(f"Admin {g.user_email} deleted reservation for worker {worker_id} at {date}")
            return jsonify({"message": "Reservation deleted successfully"}), 200
        else:
            return create_error_response("Reservation not found", 404)
            
    except Exception as e:
        app.logger.error(f"Error deleting reservation: {str(e)}")
        return create_error_response("Unable to delete reservation", 500)

@app.route("/detailedReservations", methods=["GET"])
@require_jwt
@limiter.limit("100 per minute")  # SECURITY: Rate limit detailed queries
def get_detailed_reservations():
    try:
        data = request.args
        data = data.to_dict()
        print(data)
        if not data:
            return create_error_response("Invalid request format", 400)
        
        # SECURITY: Validate input using schema
        schema = DetailedReservationsSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            return create_error_response("Invalid request data", 400, f"Validation error: {err.messages}")
        
        if not validated_data or not isinstance(validated_data, dict):
            return create_error_response("Invalid request data", 400)
        
        scope = validated_data['scope']
        worker_id = validated_data['worker_id']
        date = validated_data['datetime_check']
        local_date = date.astimezone(LOCAL_TZ).replace(tzinfo=None)
                
        print(f"Admin {g.user_email} getting detailed reservations for worker {worker_id} on {date} with scope {scope}")

        # Build time range query
        collection = db["appointements"]
        if scope == "daily":
            start_time = local_date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_time = local_date.replace(hour=23, minute=59, second=59, microsecond=999999)
        elif scope == "monthly":
            start_time = local_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end_time = start_time.replace(month=start_time.month % 12 + 1, day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # SECURITY: Sanitize query
        appointment_query = {
            "worker_id": worker_id,
            "datetime_service_start": {"$gte": start_time, "$lt": end_time}
        }
        
        appointments = list(collection.find(appointment_query, {"_id": 0}))
        
        # Expand appointments with related data (keeping existing logic)
        clients_list = list(db["clients"].find({}, {"_id": 0}))
        for appointment in appointments:
            client = next((client for client in clients_list if client["phone"] == appointment["phone"]), None)
            if client:
                appointment["client"] = client
                del appointment["phone"]

        services_list = list(db["services"].find({}, {"_id": 0}))
        for appointment in appointments:
            service = next((service for service in services_list if service["service_id"] == appointment["service_id"]), None)
            if service:
                appointment["service"] = service
                del appointment["service_id"]

        workers_list = list(db["workers"].find({}, {"_id": 0}))
        for appointment in appointments:
            worker = next((worker for worker in workers_list if worker["worker_id"] == appointment["worker_id"]), None)
            if worker:
                appointment["worker"] = worker
                del appointment["worker_id"] 
        
        return jsonify({"appointments": appointments}), 200
    
    except Exception as e:
        app.logger.error(f"Error accessing reservations: {str(e)}")
        return create_error_response("Unable to access reservations", 500)

@app.route("/clients", methods=["GET"])
@require_jwt
@limiter.limit("10 per minute")  # SECURITY: Rate limit sensitive data access
def get_clients():
    try:
        collection = db["clients"]
        clients = list(collection.find({}, {"_id": 0}))
        app.logger.info(f"Admin {g.user_email} accessed client list")
        return jsonify({"clients": clients}), 200
    except Exception as e:
        app.logger.error(f"Error fetching clients: {str(e)}")
        return create_error_response("Unable to fetch clients", 500)
    

@app.route("/clients/worker/<int:worker_id>", methods=["GET"])
@require_jwt
def get_clients_by_worker_via_appointments(worker_id):
    try:
        if worker_id <= 0:
            return create_error_response("Invalid worker_id", 400)

        # 1) Agrupar appointments por phone para este worker (e contar)
        pipeline = [
            {"$match": {"worker_id": worker_id}},
            {"$group": {"_id": "$phone", "count": {"$sum": 1}}},
        ]
        grouped = list(db["appointements"].aggregate(pipeline))
        phones = [g["_id"] for g in grouped if g.get("_id")]
        counts_by_phone = {g["_id"]: g["count"] for g in grouped}

        if not phones:
            return jsonify({"clients": []}), 200

        # 2) Buscar documentos dos clients por phones
        clients = list(db["clients"].find({"phone": {"$in": phones}}, {"_id": 0}))

        # 3) (opcional) sobrepor/atribuir total_reservations para este worker
        for c in clients:
            c["total_reservations"] = counts_by_phone.get(c.get("phone"), 0)

        # 4) Ordenar por nome para UI mais agradável
        clients.sort(key=lambda c: (c.get("name") or "").lower())

        return jsonify({"clients": clients}), 200

    except Exception as e:
        return create_error_response("Unable to fetch clients", 500, f"Error: {str(e)}")

@app.route("/client/<client_phone>", methods=["POST"])
@require_jwt
@limiter.limit("20 per minute")  # SECURITY: Rate limit client updates
def update_client(client_phone):
    try:
        data = request.get_json()
        if not data or not isinstance(data, dict):
            return create_error_response("Invalid request format", 400)
        
        # SECURITY: Validate input using schema
        schema = ClientUpdateSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            return create_error_response("Invalid client data", 400, f"Validation error: {err.messages}")
        
        # Ensure validated_data is a dictionary
        if not isinstance(validated_data, dict):
            return create_error_response("Invalid data format", 400)
        
        # SECURITY: Sanitize phone parameter and update data
        clean_phone = sanitize_string(client_phone, 15)
        update_data = sanitize_mongo_query(validated_data)

        if not update_data:
            return create_error_response("No valid fields to update", 400)
        
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        collection = db["clients"]
        query = sanitize_mongo_query({"phone": clean_phone})
        result = collection.update_one(query, {"$set": update_data})
        
        if result.modified_count > 0:
            app.logger.info(f"Admin {g.user_email} updated client {clean_phone}")
            return jsonify({"message": "Client updated successfully"}), 200
        else:
            return create_error_response("Client not found or no changes made", 404)
            
    except Exception as e:
        app.logger.error(f"Error updating client: {str(e)}")
        return create_error_response("Unable to update client", 500)

# === SECURITY: Error Handlers ===
@app.errorhandler(429)  # Rate limit exceeded
def ratelimit_handler(e):
    app.logger.warning(f"Rate limit exceeded from IP {request.remote_addr} for {request.endpoint}")
    return create_error_response("Rate limit exceeded. Please try again later.", 429)

@app.errorhandler(500)  # Internal server error
def internal_error_handler(e):
    app.logger.error(f"Internal server error: {str(e)}")
    return create_error_response("Internal server error", 500)

if __name__ == "__main__":
    # SECURITY: Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('app.log'),
            logging.StreamHandler()
        ]
    )
    
    app.run(host="0.0.0.0", debug=True, port=5001)