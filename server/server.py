from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import os
import datetime

from databaseLogic import Database

app = Flask(__name__)
CORS(app)

DB = Database(db_path='database.db')
secret_key = os.environ.get('SECRET_KEY', '1234567890')

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

@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.get_json()
    username = data.get("username")
    email    = data.get("email")
    password = data.get("password")
    contact  = data.get("contact")
    result = DB.register_customer(username, contact, email, password)
    return jsonify({"message": result}), 200

@app.route("/api/login", methods=["POST"])
def login_user():
    data = request.get_json()
    email    = data.get("email")
    password = data.get("password")
    user = DB.login_user(email, password)
    if not user:
        return jsonify({"message": "Invalid email or password"}), 401
    payload = {
        "email": user['email'],
        "role":  user['role'],
        "exp":   datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return jsonify({"message": "Login successful", "token": token, "role": user['role']}), 200

@app.route("/api/getTableAvailability", methods=["POST"])
def get_table_availability():
    data = request.get_json()
    date = data.get("date")
    time = data.get("time")
    if not date or not time:
        return jsonify({"message":"Missing date or time"}), 400
    tables = DB.get_all_tables_with_status(date, time)
    return jsonify({"tables": tables}), 200


@app.route("/api/makeReservation", methods=["POST"])
def make_reservation():
    data = request.get_json()
    email = request.headers.get('email')
    date  = data.get("ReservationDate")
    time  = data.get("ReservationTime")
    table = data.get("TableID")
    availability = DB.get_all_tables_with_status(date, time)
    selected = next((t for t in availability if t['table_id'] == int(table)), None)
    if not selected:
        return jsonify({"message": "Table not found"}), 404
    if not selected['available']:
        return jsonify({"message": f"Table {table} not available"}), 409
    DB.create_reservation(email, date, time, table, 'confirmed')
    return jsonify({"message": "Reservation created"}), 200

@app.route("/api/getReservations", methods=["Post"])
def get_reservations():
    data = request.get_json()
    email = data.get("email")
    print(f"Email: {email}")
    rows  = DB.get_reservations(email)
    reservations = [{"reservation_date": r[0], "reservation_time": r[1], "table_number": r[2]} for r in rows]
    return jsonify({"reservations": reservations}), 200

@app.route("/api/getAllReservations", methods=["GET"])
def get_all_reservations():
    rows = DB.get_all_reservations()
    reservations = [{"reservation_id": r[0], "customer_email": r[1], "reservation_date": r[2],
                     "reservation_time": r[3], "table_id": r[4], "status": r[5]} for r in rows]
    return jsonify({"reservations": reservations}), 200

@app.route("/api/getMenuItems", methods=["GET"])
def get_menu_items():
    items = DB.get_menu_items()
    return jsonify({"items": items}), 200

@app.route("/api/getCustomerEmails", methods=["GET"])
def get_customer_emails():
    emails = DB.get_customer_emails()
    return jsonify({"emails": emails}), 200

@app.route("/api/getTableNumbers", methods=["GET"])
def get_table_numbers():
    tables = DB.get_table_numbers()
    return jsonify({"tables": tables}), 200

@app.route("/api/makeOrder", methods=["POST"])
def make_order():
    data = request.get_json()
    result = DB.make_order(data.get('email'), data.get('table_id'), data.get('items'),
                           data.get('amount'), data.get('order_date'), data.get('order_time'))
    status = 200 if not result.startswith('Error') else 500
    return jsonify({"message": result}), status

@app.route("/api/getAllOrders", methods=["GET"])
def get_all_orders():
    rows = DB.get_all_orders()
    orders = [{"order_id": r[0], "email": r[1], "table_number": r[2], "items": r[3],
               "total_amount": r[4], "status": r[5], "order_date": r[6], "order_time": r[7]}
              for r in rows]
    return jsonify({"orders": orders}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
