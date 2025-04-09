from flask import Flask, request, jsonify
from flask_cors import CORS

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





if __name__ == '__main__':
    app.run(debug=True, port=5000)