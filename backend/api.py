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

        #TODO Check if user exists
        collection = db["clients"]
        result = collection.find_one({"phone": phone})

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

        #TODO: Implement logic to create a reservation in the database
        appointment = {
            "phone" : phone,
            "service_id" : service_id,
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