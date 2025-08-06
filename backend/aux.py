from datetime import datetime

SLOTS_INDEX = {
    0: "09:00",
    1: "09:15",
    2: "09:30",
    3: "09:45",
    4: "10:00",
    5: "10:15",
    6: "10:30",
    7: "10:45",
    8: "11:00",
    9: "11:15",
    10: "11:30",
    11: "11:45",
    12: "12:00",
    13: "12:15",
    14: "12:30",
    15: "12:45",
    16: "13:00",
    17: "13:15",
    18: "13:30",
    19: "13:45",
    20: "14:00",
    21: "14:15",
    22: "14:30",
    23: "14:45",
    24: "15:00",
    25: "15:15",
    26: "15:30",
    27: "15:45",
    28: "16:00",
    29: "16:15",
    30: "16:30",
    31: "16:45",
    32: "17:00",
    33: "17:15",
    34: "17:30",
    35: "17:45",
    36: "18:00",
    37: "18:15",
    38: "18:30",
    39: "18:45"
}

def print_slot_availability(slot_availability: dict) -> None:
    """
    Print the slot availability in a readable format.
    """
    print("Slot Availability:")
    for slot, status in slot_availability.items():
        status_str = "Available" if status == 0 else "Reserved" if status == 1 else "Unavailable" 
        print(f"Slot {SLOTS_INDEX[slot]}: {status_str}")

def get_slot_from_datetime(date: datetime) -> int:
    """
    Convert a datetime object to a slot index.
    """
    if date.hour < 9 or date.hour > 18 or (date.hour == 18 and date.minute > 45):
        raise ValueError("Date is out of range for available slots.")
    
    slot_index = (date.hour - 9) * 4 + (date.minute // 15)
    return slot_index

def get_available_slots(service_duration: int, worker_id: int, date: datetime, appointments: dict) -> dict:
    # This function should implement the logic to fetch available slots
    # based on the service_duration, worker_id, and date_str
    # service duration is in number of 15 minute slots
    print(f"Fetching available slots for worker {worker_id} on {date} with service duration {service_duration} slots.")

    # Query the database to find existing reservations for the worker on the given date
    # The result will be a list of appointments:
    #appointments = []  # Placeholder for actual database query results

    # Insert dummy data into appointments for demonstration purposes, assuming the query returns these
    #appointments.append({
    #    "phone": 123456789,
    #    "service_id": 1,
    #    "worker_id": worker_id,
    #    "slots_number": 2,
    #    "datetime_service_start": date.replace(hour=10, minute=15, second=0, microsecond=0)
    #})
    #appointments.append({
    #    "phone": 111111111,
    #    "service_id": 2,
    #    "worker_id": worker_id,
    #    "slots_number": 3,
    #    "datetime_service_start": date.replace(hour=11, minute=45, second=0, microsecond=0)
    #})
    #appointments.append({
    #    "phone": 222222222,
    #    "service_id": 3,
    #    "worker_id": worker_id,
    #    "slots_number": 8,
    #    "datetime_service_start": date.replace(hour=14, minute=45, second=0, microsecond=0)
    #})

    print(appointments)

    # Calculate available slots based on the appointments
    # slot_availability will be a dictionary with the slots as indexes from 0 39, with the value being 0: available, 1: reserved, 2: unavailable
    slot_availability = {i: 0 for i in range(40)}  # Assuming 40 slots in a day
    for appointment in appointments:
        start_slot = get_slot_from_datetime(appointment["datetime_service_start"])
        print("Start slot:", start_slot)
        slots_number = appointment["slots_number"]
        for i in range(start_slot, start_slot + slots_number):
            if i in slot_availability:
                slot_availability[i] = 1 # Mark as reserved

    # Mark slots as unavailable based on service duration
    for i in range(0, 40):
        if slot_availability[i] == 0:  # Only check available slots
            if i + service_duration <= 40:  # Ensure we don't go out of bounds
                for j in range(i, i + service_duration):
                    if slot_availability[j] == 1:  # If any slot in the range is reserved, mark as unavailable
                        slot_availability[i] = 2
                        break

            else:
                slot_availability[i] = 2  # If the service duration exceeds available slots, mark as unavailable

    # Print the slot availability for debugging
    print("Slot availability after processing appointments:")
    print_slot_availability(slot_availability)
    return slot_availability