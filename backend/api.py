from flask import Flask, request, jsonify
from datetime import datetime, timezone
from flask_cors import CORS
from pymongo import MongoClient
import time

from aux import get_available_slots


app = Flask(__name__)
CORS(app)

mongo_uri = "mongodb://root:example@mongodb:27017/"
client = MongoClient(mongo_uri)

db = client["estetica"]
collection = db["appointements"]  # You can name this whatever you want

SLOT_DURATION = 15  # Duration of each slot in minutes

# Endpoint to get available slots
@app.route("/availability", methods=["GET"])
def get_availability():
    try:
        service_id_str = request.args.get("service_id")
        worker_id_str = request.args.get("worker_id")
        date_str = request.args.get("date")
        
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
            return jsonify({"error": "Invalid request parameters"}), 400
            
        # Convert and validate date
        try:
            date = datetime.fromisoformat(str(date_str))
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid request parameters"}), 400
        
        # Basic validation
        if service_id <= 0 or worker_id <= 0:
            return jsonify({"error": "Invalid request parameters"}), 400
            
        if date < datetime.now(timezone.utc):
            return jsonify({"error": "Invalid request parameters"}), 400
        
        print(f"Checking availability for service {service_id}, worker {worker_id}")
        
        #TODO: Validate service_id against a list of available services (query from database) and get service duration
        service_duration = 30  # Placeholder for service duration, should be fetched from database based on service_id
        
        #TODO: Validate worker_id against a list of available workers (query from database)
        
        slots_availability = get_available_slots(service_duration, worker_id, date)

        print(f"Available slots: {slots_availability}")
        return jsonify({"available_slots": slots_availability})
        
    except Exception as e:
        print(f"Error checking availability: {str(e)}")  # Log for debugging
        return jsonify({"error": "Unable to process request"}), 500

# Endpoint to create a reservation
@app.route("/reservation", methods=["POST"])
def create_reservation():
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
        if date < datetime.now(timezone.utc):
            return jsonify({"error": "Invalid request data"}), 400
        
        print(f"Creating reservation for: {name[:3]}*** at {date}")
        
        #TODO: Validate service_id, worker_id, and location_id against the database

        #Check if user exists
        collection = db["clients"]
        result = collection.find_one({"phone": phone})

        # If user does not exist, create a new client record
        if result is None:
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
        service = collection.find_one({"_id": service_id}) 
        if service is None:
            return jsonify({"error": "Invalid service ID"}), 400
        
        service_duration = service["duration"]
        slots_number = service_duration // SLOT_DURATION

        #logic to create a reservation in the database
        appointment = {
            "phone" : phone,
            "service_id" : service_id,
            "worker_id" : worker_id,
            "slots_number" : slots_number,
            "datetime_service_start" : date
        }

        collection = db["appointements"]
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

        
        
        #return jsonify({"reservations": reservations})


# [ADMIN]
# Endpoint to delete a reservation
@app.route("/reservation", methods=["DELETE"])
def delete_reservations():
    try:
        #reservation_id = request.args.get("reservation-id")
        worker_id_str = request.args.get("worker_id")
        date_str = request.args.get("date")
        
        if (worker_id_str is not None )and (date_str is not None):
            return jsonify({"error": "Invalid request parameters"}), 400
        
        # Convert and validate reservation_id
        try:
            worker_id = int(worker_id_str)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid request parameters"}), 400
        
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



#######Clients endpoints#######
# [ADMIN]
# Endpoint to get all clients 
@app.route("/clients", methods=["GET"])
def get_clients():
    try:
        collection = db["clients"]
        clients = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB's default _id field
        return jsonify({"clients": clients}), 200
    except Exception as e:
        print(f"Error fetching clients: {str(e)}")
        return jsonify({"error": "Unable to fetch clients"}), 500


# [ADMIN]
# Endpoint to change a specific client by ID
@app.route("/client/<client_id>", methods=["POST"])
def update_client(client_id):
    try:
        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid request format"}), 400
        
        collection = db["clients"]
        result = collection.update_one({"_id": client_id}, {"$set": data})
        
        if result.modified_count > 0:
            return jsonify({"message": "Client updated successfully"}), 200
        else:
            return jsonify({"error": "Client not found or no changes made"}), 404
            
    except Exception as e:
        print(f"Error updating client: {str(e)}")
        return jsonify({"error": "Unable to update client"}), 500



        




# Endpoint to get available services
@app.route("/services", methods=["GET"])
def get_services():
    return jsonify({
        "services": [
            {"id": 1, "name": "Haircut"},
            {"id": 2, "name": "Manicure"},
            {"id": 3, "name": "Pedicure"}
        ]
    }, 200)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5001)