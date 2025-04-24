from flask import Flask, request, jsonify
from flask_cors import CORS
import databaseLogic as dbLogic
import jwt
import os
import datetime


app = Flask(__name__)
CORS(app)  

secret_key = "1234567890" #temp secret key

# token verification 
def verify_token():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None, jsonify({"message": "Missing token"}), 401

    token = auth_header.split(" ")[1] if " " in auth_header else auth_header

    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload, None, None  
    except jwt.ExpiredSignatureError:
        return None, jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({"message": "Invalid token"}), 401

    
#register route 
@app.route("/api/register", methods=["POST"])
def register_user():
    print("Received registration request")
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    contact = data.get("contact")

    print(f"Registering user: {username}, {email}")

    result = dbLogic.register_customer(username,contact, email, password)
    print(result)
    return jsonify({"message": result}), 200

#login route
@app.route("/api/login", methods=["POST"])
def login_user():
    data = request.get_json()
    email = data.get("email") 
    password = data.get("password")

    user = dbLogic.login_user(email, password)  
    if user:
        payload = {
            "email": user["email"],
            "role": user["role"],
            "exp": datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1)
        }
        token = jwt.encode(payload, secret_key, algorithm="HS256")
        return jsonify({
            "message": "Login successful", 
            "token": token,
            "role": user["role"]  
        }), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401
    
@app.route("/api/getTableAvailability", methods=["POST"])
def get_table_availability():
    data = request.get_json()
    date = data.get("date")
    time = data.get("time")

    table_status = dbLogic.get_all_tables_with_status(date, time)

    return jsonify({"tables": table_status}), 200

@app.route("/api/makeReservation", methods=["POST"])
def make_res():
    print("Received reservation request")
    data = request.get_json()

    customer_email = request.headers.get('email')
    reservation_date = data.get("ReservationDate")
    reservation_time = data.get("ReservationTime")
    table_id = data.get("TableID")

    
    tables = dbLogic.get_all_tables_with_status(reservation_date, reservation_time)
    selected_table = next((t for t in tables if str(t['table_id']) == str(table_id)), None)
    print(f"Selected table: {selected_table}")

    if not selected_table:
        return jsonify({"message": "Table not found"}), 404

    if selected_table['available'] != True:
        return jsonify({"message": f"Table {table_id} is not available at that time"}), 409

    result = dbLogic.create_reservation(customer_email, reservation_date, reservation_time, table_id, "confirmed")
    return jsonify({"message": result}), 200


@app.route("/api/getReservations", methods=["POST"])
def get_reservations():
    print("Received get reservations request")

    data = request.get_json()
    email = data.get("email")
    print(f"Email received: {email}")

    result = dbLogic.get_reservations(email)
    print(f"Raw result: {result}")

    #convert tuples into list of dictionaries
    reservations = [
        {
            "reservation_date": row[0],
            "reservation_time": row[1],
            "table_number": row[2]
        }
        for row in result
    ]

    return jsonify({"reservations": reservations})

    
@app.route("/api/getMenuItems", methods=["POST"])
def get_menu_items():
    items = dbLogic.get_menu_items()
    return jsonify({"items": items})

@app.route("/api/getCustomerEmails", methods=["GET"])
def get_customer_emails():
    emails = dbLogic.get_customer_emails()
    return jsonify({"emails": emails})

@app.route("/api/getTableNumbers", methods=["GET"])
def get_table_numbers():
    tables = dbLogic.get_table_numbers()
    return jsonify({"tables": tables})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
