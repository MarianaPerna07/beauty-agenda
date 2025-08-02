import json
import os
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, ServerSelectionTimeoutError
import argparse

def test_mongodb_connection(mongo_uri):
    """Test MongoDB connection before attempting operations"""
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        client.close()
        return True
    except Exception as e:
        print(f"MongoDB connection failed: {str(e)}")
        return False

def insert_services(json_file, mongo_uri="mongodb://127.0.0.1:27017/", db_name="estetica"):
    # Connect to MongoDB
    print(f"Attempting to connect to MongoDB at: {mongo_uri}")
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)  # 5 second timeout
        # Test the connection
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {str(e)}")
        print("Please make sure MongoDB is running and the URI is correct.")
        return
    
    db = client[db_name]
    services_collection = db["services"]

    # Read and parse the JSON file
    with open(json_file, 'r', encoding='utf-8') as f:
        services_data = json.load(f)

    print("Data loaded successfully from JSON file.")

    # Clear existing data to avoid duplicates
    try:
        result = services_collection.delete_many({})
        print(f"Cleared {result.deleted_count} existing documents from 'services' collection.")
    except Exception as e:
        print(f"Error clearing services collection: {str(e)}")
        return
    
    # Insert into MongoDB
    try:
        result = services_collection.insert_many(services_data)
        print(f"Inserted {len(result.inserted_ids)} services into the 'services' collection.")
    except Exception as e:
        print(f"Error inserting services: {str(e)}")
    finally:
        client.close()

def insert_workers(json_file, mongo_uri="mongodb://localhost:27017/", db_name="estetica"):
    # Connect to MongoDB
    print(f"Attempting to connect to MongoDB at: {mongo_uri}")
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)  # 5 second timeout
        # Test the connection
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {str(e)}")
        print("Please make sure MongoDB is running and the URI is correct.")
        return
    
    db = client[db_name]
    workers_collection = db["workers"]

    # Read and parse the JSON file
    with open(json_file, 'r', encoding='utf-8') as f:
        workers_data = json.load(f)

    # Optional: Validate that each entry has the required fields
    for worker in workers_data:
        required_fields = {"worker_id", "name", "description"}
        if not required_fields.issubset(worker.keys()):
            raise ValueError(f"Missing fields in worker entry: {worker}")

    # Clear existing data to avoid duplicates
    try:
        result = workers_collection.delete_many({})
        print(f"Cleared {result.deleted_count} existing documents from 'workers' collection.")
    except Exception as e:
        print(f"Error clearing workers collection: {str(e)}")
        return
    
    # Insert into MongoDB
    try:
        result = workers_collection.insert_many(workers_data)
        print(f"Inserted {len(result.inserted_ids)} workers into the 'workers' collection.")
    except Exception as e:
        print(f"Error inserting workers: {str(e)}")
    finally:
        client.close()

def inject_all_data(services_file="services.json", workers_file="workers.json", mongo_uri="mongodb://root:example@localhost:27017/", db_name="estetica"):
    """
    Inject both services and workers data into MongoDB
    """
    print("Starting data injection into MongoDB...")
    print(f"Database: {db_name}")
    print(f"MongoDB URI: {mongo_uri}")
    
    try:
        # Check if files exist
        if not os.path.exists(services_file):
            print(f"Warning: Services file '{services_file}' not found. Skipping services injection.")
        else:
            print(f"Injecting services from: {services_file}")
            insert_services(services_file, mongo_uri, db_name)
        
        if not os.path.exists(workers_file):
            print(f"Warning: Workers file '{workers_file}' not found. Skipping workers injection.")
        else:
            print(f"Injecting workers from: {workers_file}")
            insert_workers(workers_file, mongo_uri, db_name)
            
        print("Data injection completed successfully!")
        
    except Exception as e:
        print(f"Error during data injection: {str(e)}")
        raise

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Insert services and workers data into MongoDB.")
    parser.add_argument("--services_file", default="services.json", help="Path to the JSON file with services data (default: services.json)")
    parser.add_argument("--workers_file", default="workers.json", help="Path to the JSON file with workers data (default: workers.json)")
    parser.add_argument("--mongo_uri", default="mongodb://root:example@localhost:27017/", help="MongoDB URI (default: mongodb://root:example@localhost:27017/)")
    parser.add_argument("--db_name", default="estetica", help="Database name (default: estetica)")
    parser.add_argument("--services_only", action="store_true", help="Insert only services data")
    parser.add_argument("--workers_only", action="store_true", help="Insert only workers data")

    args = parser.parse_args()
    
    if args.services_only:
        if os.path.exists(args.services_file):
            insert_services(args.services_file, args.mongo_uri, args.db_name)
        else:
            print(f"Error: Services file '{args.services_file}' not found.")
    elif args.workers_only:
        if os.path.exists(args.workers_file):
            insert_workers(args.workers_file, args.mongo_uri, args.db_name)
        else:
            print(f"Error: Workers file '{args.workers_file}' not found.")
    else:
        # Inject both by default
        inject_all_data(args.services_file, args.workers_file, args.mongo_uri, args.db_name)