# import necessary modules
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import os
import datetime

from databaseLogic import Database

# initialize flask app and enable CORS
app = Flask(__name__)
CORS(app)

# initialize database and secret key
DB = Database(db_path="database.db")
secret_key = os.environ.get("SECRET_KEY", "1234567890")


# helper function to verify JWT token
def verify_token():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None, jsonify({"message": "missing token"}), 401

    token = auth_header.split(" ")[1] if " " in auth_header else auth_header
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify({"message": "token expired"}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({"message": "invalid token"}), 401


# ------------------------
# authentication routes
# ------------------------


@app.route("/api/register", methods=["POST"])
def register_user():
    try:
        data = request.get_json() or {}
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        contact = data.get("contact")

        # basic validation
        if not all([username, email, password, contact]):
            return (
                jsonify(
                    {"message": "username, email, password and contact are required"}
                ),
                400,
            )

        result = DB.register_customer(username, contact, email, password)
        return jsonify({"message": result}), 200

    except Exception as e:
        return jsonify({"message": f"error during registration: {e}"}), 500


@app.route("/api/login", methods=["POST"])
def login_user():
    try:
        data = request.get_json() or {}
        email = data.get("email")
        password = data.get("password")

        # basic validation
        if not email or not password:
            return jsonify({"message": "email and password are required"}), 400

        user = DB.login_user(email, password)
        if not user:
            return jsonify({"message": "invalid email or password"}), 401

        # create token payload with expiration
        payload = {
            "email": user["email"],
            "role": user["role"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        }
        token = jwt.encode(payload, secret_key, algorithm="HS256")

        return (
            jsonify(
                {"message": "login successful", "token": token, "role": user["role"]}
            ),
            200,
        )

    except Exception as e:
        return jsonify({"message": f"error during login: {e}"}), 500


# ------------------------
# reservation routes
# ------------------------


@app.route("/api/getTableAvailability", methods=["POST"])
def get_table_availability():
    try:
        data = request.get_json() or {}
        date = data.get("date")
        time = data.get("time")

        if not date or not time:
            return jsonify({"message": "date and time are required"}), 400

        tables = DB.get_all_tables_with_status(date, time)
        return jsonify({"tables": tables}), 200

    except Exception as e:
        return jsonify({"message": f"error fetching availability: {e}"}), 500


@app.route("/api/makeReservation", methods=["POST"])
def make_reservation():
    # require authentication
    payload, error_resp, status = verify_token()
    if error_resp:
        return error_resp, status

    try:
        data = request.get_json() or {}
        email = payload.get("email")
        date = data.get("ReservationDate")
        time = data.get("ReservationTime")
        table_id = data.get("TableID")

        # basic validation
        if not all([email, date, time, table_id]):
            return (
                jsonify(
                    {
                        "message": "reservationDate, reservationTime and TableID are required"
                    }
                ),
                400,
            )

        try:
            table_int = int(table_id)
        except ValueError:
            return jsonify({"message": "TableID must be an integer"}), 400

        availability = DB.get_all_tables_with_status(date, time)
        selected = next((t for t in availability if t["table_id"] == table_int), None)
        if not selected:
            return jsonify({"message": "table not found"}), 404
        if not selected["available"]:
            return jsonify({"message": f"table {table_id} not available"}), 409

        DB.create_reservation(email, date, time, table_int, "confirmed")
        return jsonify({"message": "reservation created"}), 200

    except Exception as e:
        return jsonify({"message": f"error making reservation: {e}"}), 500


@app.route("/api/getReservations", methods=["POST"])
def get_reservations():
    # require authentication
    payload, error_resp, status = verify_token()
    if error_resp:
        return error_resp, status

    try:
        data = request.get_json() or {}
        email = data.get("email")
        if not email:
            return jsonify({"message": "email is required"}), 400

        rows = DB.get_reservations(email)
        reservations = [
            {"reservation_date": r[0], "reservation_time": r[1], "table_number": r[2]}
            for r in rows
        ]
        return jsonify({"reservations": reservations}), 200

    except Exception as e:
        return jsonify({"message": f"error fetching reservations: {e}"}), 500


@app.route("/api/getAllReservations", methods=["GET"])
def get_all_reservations():
    try:
        rows = DB.get_all_reservations()
        reservations = [
            {
                "reservation_id": r[0],
                "customer_email": r[1],
                "reservation_date": r[2],
                "reservation_time": r[3],
                "table_id": r[4],
                "status": r[5],
            }
            for r in rows
        ]
        return jsonify({"reservations": reservations}), 200

    except Exception as e:
        return jsonify({"message": f"error fetching all reservations: {e}"}), 500


# ------------------------
# menu and customer info
# ------------------------


@app.route("/api/getMenuItems", methods=["GET"])
def get_menu_items():
    try:
        items = DB.get_menu_items()
        return jsonify({"items": items}), 200
    except Exception as e:
        return jsonify({"message": f"error fetching menu items: {e}"}), 500


@app.route("/api/getCustomerEmails", methods=["GET"])
def get_customer_emails():
    try:
        emails = DB.get_customer_emails()
        return jsonify({"emails": emails}), 200
    except Exception as e:
        return jsonify({"message": f"error fetching customer emails: {e}"}), 500


@app.route("/api/getTableNumbers", methods=["GET"])
def get_table_numbers():
    try:
        tables = DB.get_table_numbers()
        return jsonify({"tables": tables}), 200
    except Exception as e:
        return jsonify({"message": f"error fetching table numbers: {e}"}), 500


# ------------------------
# order routes
# ------------------------


@app.route("/api/makeOrder", methods=["POST"])
def make_order():
    # require authentication
    payload, error_resp, status = verify_token()
    if error_resp:
        return error_resp, status

    try:
        data = request.get_json() or {}
        email = payload.get("email")
        table_id = data.get("table_id")
        items = data.get("items")
        amount = data.get("amount")
        order_date = data.get("order_date")
        order_time = data.get("order_time")

        # basic validation
        if not all([email, table_id, items, amount, order_date, order_time]):
            return jsonify({"message": "all order fields are required"}), 400

        try:
            amount = float(amount)
        except (ValueError, TypeError):
            return jsonify({"message": "amount must be a number"}), 400

        result = DB.make_order(email, table_id, items, amount, order_date, order_time)
        status_code = 200 if not result.lower().startswith("error") else 500
        return jsonify({"message": result}), status_code

    except Exception as e:
        return jsonify({"message": f"error placing order: {e}"}), 500


@app.route("/api/getAllOrders", methods=["GET"])
def get_all_orders():
    # require admin role
    payload, error_resp, status = verify_token()
    if error_resp:
        return error_resp, status
    if payload.get("role") != "staff":
        return jsonify({"message": "forbidden"}), 403

    try:
        rows = DB.get_all_orders()
        orders = [
            {
                "order_id": r[0],
                "email": r[1],
                "table_number": r[2],
                "items": r[3],
                "total_amount": r[4],
                "status": r[5],
                "order_date": r[6],
                "order_time": r[7],
            }
            for r in rows
        ]
        return jsonify({"orders": orders}), 200

    except Exception as e:
        return jsonify({"message": f"error fetching all orders: {e}"}), 500


# run the app
if __name__ == "__main__":
    app.run(debug=True, port=5000)
