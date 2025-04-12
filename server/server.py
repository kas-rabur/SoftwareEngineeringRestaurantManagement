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

if __name__ == "__main__":
    app.run(debug=True, port=5000)
