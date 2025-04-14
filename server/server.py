from flask import Flask, request, jsonify
from flask_cors import CORS
import databaseLogic as dbLogic
import jwt
import os
import datetime

app = Flask(__name__)
CORS(app)  

secret_key = "1234567890" #temp secret key

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
    print("Received login request")
    data = request.get_json()

    email = data.get("email") 
    password = data.get("password")
    print(f"Logging in user: {email}")

    result = dbLogic.login_customer(email, password)

    if result == "Login successful":
        #generates HTW token lasting 1 hour alllowing access to protected routes eg, the customer dashboard
        payload = {
            "email": email,
            "exp": datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1)
        }
        token = jwt.encode(payload, secret_key, algorithm="HS256")
        return jsonify({"message": "Login successful", "token": token}), 200
    else:
        return jsonify({"message": result}), 401


if __name__ == "__main__":
    app.run(debug=True, port=5000)
