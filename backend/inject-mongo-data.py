import json
from pymongo import MongoClient
import argparse

def insert_services(json_file, mongo_uri="mongodb://localhost:27017/", db_name="your_database_name"):
    # Connect to MongoDB
    client = MongoClient(mongo_uri)
    db = client[db_name]
    services_collection = db["Services"]

    # Read and parse the JSON file
    with open(json_file, 'r', encoding='utf-8') as f:
        services_data = json.load(f)

    # Optional: Validate that each entry has the required fields
    for service in services_data:
        required_fields = {"service_id", "name", "workers", "price", "description", "duration", "category", "featured"}
        if not required_fields.issubset(service):
            raise ValueError(f"Missing fields in service entry: {service}")

    # Insert into MongoDB
    result = services_collection.insert_many(services_data)
    print(f"Inserted {len(result.inserted_ids)} documents into the 'Services' collection.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Insert services data into MongoDB.")
    parser.add_argument("json_file", help="Path to the JSON file with service data.")
    parser.add_argument("--mongo_uri", default="mongodb://localhost:27017/", help="MongoDB URI (default: localhost)")
    parser.add_argument("--db_name", default="your_database_name", help="Database name (default: your_database_name)")

    args = parser.parse_args()
    insert_services(args.json_file, args.mongo_uri, args.db_name)