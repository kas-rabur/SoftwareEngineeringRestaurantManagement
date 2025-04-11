from flask import Flask, request, jsonify
from flask_cors import CORS
import databaseLogic as dbLogic

app = Flask(__name__)
CORS(app)




@app.route('/api/prac', methods=['GET'])
def get_data():
    data = {"message": "GET request received"}
    return jsonify(data)

@app.route('/create_reservation', methods=['POST'])
def create_reservation():
    pass

@app.route('/update_reservation', methods=['PUT'])
def update_reservation():
    pass

@app.route('/register_customer', methods=['POST'])
def register_customer():
    data = request.get_json()
    name = data.get('name')
    contact = data.get('contact')
    address = data.get('address')
    email = data.get('email')
    password = data.get('password')

    dbLogic.register_customer(name, contact, address, email, password)

    return jsonify({"message": "Customer registered successfully"}), 201





if __name__ == '__main__':
    app.run(debug=True, port=5000)