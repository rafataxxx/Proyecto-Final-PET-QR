from flask import request, jsonify, Blueprint
from api.models import db, User, Pet
# ¡Agrupamos todo lo de JWT aquí arriba!
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "Ese email ya está registrado"}), 400
    
    if not email or not password:
        return jsonify({"msg": "El email y la contraseña son obligatorios"}), 400

    # Usamos la herramienta nativa de Flask para encriptar
    hashed_password = generate_password_hash(password)

    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente"}), 201

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return jsonify({"msg": "Faltan el email o la contraseña"}), 400

    user = User.query.filter_by(email=email).first()

    # Verificamos con la herramienta nativa
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401

    # Creamos el Token
    access_token = create_access_token(identity=str(user.id))

    return jsonify({"access_token": access_token}), 200

@api.route('/profile', methods=['GET'])
@jwt_required() # <--- El candado
def get_profile():
    # El token nos dice quién es el usuario
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    return jsonify({"msg": f"Hola {user.email}, bienvenido a tu panel seguro"}), 200

@api.route('/hello', methods=['GET'])
def home():
    return jsonify({"msg": "Servidor de Mascota Activo"}), 200