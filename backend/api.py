from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS

from aux import get_available_slots

app = Flask(__name__)
CORS(app)

# Endpoint to get available slots
@app.route("/availability", methods=["GET"])
def get_availability():
    service_id_str = request.args.get("service_id")
    try:
        service_id = int(service_id_str) if service_id_str else None
        print(f"Parsed service_id: {service_id}")
    except ValueError:
        return jsonify({"error": "Invalid service_id format"}), 400
    if service_id is None:
        return jsonify({"error": "Missing service_id parameter"}), 400
    
    #TODO: Validate service_id against a list of available services (query from database) and get service duration
    service_duration = 30  # Placeholder for service duration, should be fetched from database based on service_id

    worker_id_str = request.args.get("worker_id")
    try:
        worker_id = int(worker_id_str) if worker_id_str else None
        print(f"Parsed worker_id: {worker_id}")
    except ValueError:
        return jsonify({"error": "Invalid worker_id format"}), 400
    if worker_id is None:
        return jsonify({"error": "Missing worker_id parameter"}), 400
    
    #TODO: Validate worker_id against a list of available workers (query from database)
    
    location_id_str = request.args.get("location_id")
    try:
        location_id = int(location_id_str) if location_id_str else None
        print(f"Parsed location_id: {location_id}")
    except ValueError:
        return jsonify({"error": "Invalid location_id format"}), 400
    if location_id is None:
        return jsonify({"error": "Missing location_id parameter"}), 400
    
    #TODO: Validate location_id against a list of available locations (query from database)
    
    date_str = request.args.get("date")
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else None
        print(f"Parsed date: {date}")
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400
    if date is None:
        return jsonify({"error": "Missing date parameter"}), 400
    if date < datetime.now().date():
        return jsonify({"error": "Date cannot be in the past"}), 400
    
    
    slots_availability = get_available_slots(service_duration, worker_id, location_id, date)

    print(f"Available slots: {slots_availability}")
    return jsonify({"available_slots": slots_availability})

# Endpoint to create a reservation
@app.route("/reservation", methods=["POST"])
def create_reservation():
    data = request.get_json()

    name_str = data.get("name")
    try:
        name = str(name_str) if name_str else None
        print(f"Parsed name: {name}")
    except ValueError:
        return jsonify({"error": "Invalid name format"}), 400
    if name is None:
        return jsonify({"error": "Missing name parameter"}), 400
    
    email_str = data.get("email")
    try:
        email = str(email_str) if email_str else None
        print(f"Parsed email: {email}")
    except ValueError:
        return jsonify({"error": "Invalid email format"}), 400
    if email is None:
        return jsonify({"error": "Missing email parameter"}), 400
    
    phone_str = data.get("phone")
    try:
        phone = str(phone_str) if phone_str else None
        print(f"Parsed phone: {phone}")
    except ValueError:
        return jsonify({"error": "Invalid phone format"}), 400
    if phone is None:
        return jsonify({"error": "Missing phone parameter"}), 400   
    
    service_id_str = data.get("service_id")
    try:
        service_id = int(service_id_str) if service_id_str else None
        print(f"Parsed service_id: {service_id}")
    except ValueError:
        return jsonify({"error": "Invalid service_id format"}), 400
    if service_id is None:
        return jsonify({"error": "Missing service_id parameter"}), 400
    
    worker_id_str = data.get("worker_id")
    try:
        worker_id = int(worker_id_str) if worker_id_str else None
        print(f"Parsed worker_id: {worker_id}")
    except ValueError:
        return jsonify({"error": "Invalid worker_id format"}), 400
    if worker_id is None:
        return jsonify({"error": "Missing worker_id parameter"}), 400
    
    location_id_str = data.get("location_id")
    try:
        location_id = int(location_id_str) if location_id_str else None
        print(f"Parsed location_id: {location_id}")
    except ValueError:
        return jsonify({"error": "Invalid location_id format"}), 400
    if location_id is None:
        return jsonify({"error": "Missing location_id parameter"}), 400
    
    date_str = data.get("reservation_time")
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else None
        print(f"Parsed date: {date}")
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400
    if date is None:
        return jsonify({"error": "Missing date parameter"}), 400
    if date < datetime.now().date():
        return jsonify({"error": "Date cannot be in the past"}), 400
    
    #TODO: Validate service_id, worker_id, and location_id against the database

    #TODO: Implement logic to create a reservation in the database
    # For now, we will just return the data as a confirmation
    print(f"Creating reservation with data: {data}")
    return jsonify({"message": "Reservation created successfully", "data": data}), 201


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