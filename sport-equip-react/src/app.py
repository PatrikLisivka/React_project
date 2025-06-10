from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://another-domain.com"]}})

users = [
    {"username": "Patrik", "password": "react"}
]

SECRET_KEY = "moj_tajny_kluc"

items = [
    {"name": "Horský bicykel", "description": "Odolný bicykel pre jazdu v horách", "price": 15},
    {"name": "Lyže", "description": "Lyže pre začiatočníkov aj pokročilých", "price": 20},
    {"name": "Kajak", "description": "Jednomiestny kajak vhodný na rieky aj jazerá", "price": 25}
]


def create_token(username):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    token = jwt.encode({"username": username, "exp": expiration}, SECRET_KEY, algorithm="HS256")
    return token


def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.get_json()
        token = data.get('token') if data else None
        if not token:
            return jsonify({"message": "Chýba token!"}), 401
        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token vypršal!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Neplatný token!"}), 401
        return f(decoded_token, *args, **kwargs)

    return decorated_function


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = next((u for u in users if u['username'] == username and u['password'] == password), None)

    if user:
        token = create_token(username)
        return jsonify({"token": token}), 200
    else:
        return jsonify({"message": "Nesprávne prihlasovacie údaje"}), 401


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Používateľské meno a heslo sú povinné"}), 400

    if any(u['username'] == username for u in users):
        return jsonify({"message": "Používateľ už existuje"}), 409

    new_user = {"username": username, "password": password}
    users.append(new_user)

    return jsonify({"message": "Registrácia úspešná"}), 201


@app.route('/listofitems', methods=['POST'])
@token_required
def get_items(decoded_token):
    return jsonify(items)


@app.route('/items', methods=['POST'])
@token_required
def create_item(decoded_token):
    data = request.get_json()
    new_item = data.get('item')

    if not new_item:
        return jsonify({"message": "Nie sú zadané údaje o vybavení"}), 400

    if 'name' not in new_item or not new_item['name']:
        return jsonify({"message": "Názov vybavenia je povinný"}), 400
    if 'description' not in new_item or not new_item['description']:
        return jsonify({"message": "Popis vybavenia je povinný"}), 400
    if 'price' not in new_item or not isinstance(new_item['price'], (int, float)) or new_item['price'] <= 0:
        return jsonify({"message": "Cena musí byť kladné číslo"}), 400

    items.append(new_item)
    return jsonify(new_item), 201


@app.route('/items/<int:item_id>', methods=['PUT'])
@token_required
def update_item(decoded_token, item_id):
    data = request.get_json()
    updated_item = data.get('item')

    if item_id < 0 or item_id >= len(items):
        return jsonify({"message": "Vybavenie neexistuje"}), 404

    if not updated_item:
        return jsonify({"message": "Nie sú zadané údaje o vybavení"}), 400

    if 'name' not in updated_item or not updated_item['name']:
        return jsonify({"message": "Názov vybavenia je povinný"}), 400
    if 'description' not in updated_item or not updated_item['description']:
        return jsonify({"message": "Popis vybavenia je povinný"}), 400
    if 'price' not in updated_item or not isinstance(updated_item['price'], (int, float)) or updated_item['price'] <= 0:
        return jsonify({"message": "Cena musí byť kladné číslo"}), 400

    items[item_id] = updated_item
    return jsonify(updated_item)

@app.route('/items/<int:item_id>', methods=['GET'])
def get_item_by_id(item_id):
    if item_id < 0 or item_id >= len(items):
        return jsonify({"message": "Vybavenie neexistuje"}), 404
    item = items[item_id]
    return jsonify(item), 200


@app.route('/items/<int:item_id>', methods=['DELETE'])
@token_required
def delete_item(decoded_token, item_id):
    if item_id < 0 or item_id >= len(items):
        return jsonify({"message": "Vybavenie neexistuje"}), 404
    item = items.pop(item_id)
    return jsonify({"message": "Vybavenie bolo odstránené", "item": item}), 200


if __name__ == '__main__':
    app.run(debug=True)
