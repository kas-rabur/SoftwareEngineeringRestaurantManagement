from flask import Flask, request, jsonify
from flask_cors import CORS
import databaseLogic as dbLogic
import os

app = Flask(__name__)
CORS(app)  


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

@app.route("/api/login", methods=["POST"])
def login_user():
    print("Received login request")
    data = request.get_json()

    email = data.get("email") 
    password = data.get("password")
    print(f"Logging in user: {email}")
    print(f"Password: {password}")
    print(f"email: {email}")
    result = dbLogic.login_customer(email, password)
    print(result)

    if result == "Login successful":
        return jsonify({"message": result}), 200
    else:
        return jsonify({"message": result}), 401  


if __name__ == "__main__":
    app.run(debug=True, port=5000)
