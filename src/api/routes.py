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

# --- RUTAS DE MASCOTAS (GABRIEL) ---

# 1. Crear Mascota (POST)
@api.route('/pet', methods=['POST'])
@jwt_required()
def create_pet():
    body = request.get_json()
    owner_id = get_jwt_identity() # Identifica al usuario por el Token

    if not body.get("name"):
        return jsonify({"msg": "El nombre es obligatorio"}), 400

    new_pet = Pet(
        name=body.get("name"),
        breed=body.get("breed"),
        clinical_info=body.get("clinical_info"),
        photo_url=body.get("photo_url"),
        owner_id=owner_id
    )

    db.session.add(new_pet)
    db.session.commit()
    return jsonify({"msg": f"Mascota {new_pet.name} creada con éxito"}), 201

# 2. Ver mis Mascotas (GET)
@api.route('/my_pets', methods=['GET'])
@jwt_required()
def get_my_pets():
    owner_id = get_jwt_identity()
    user_pets = Pet.query.filter_by(owner_id=owner_id).all()
    results = [pet.serialize() for pet in user_pets]
    return jsonify(results), 200

# 3. Editar Mascota (PUT)
@api.route('/pet/<int:pet_id>', methods=['PUT'])
@jwt_required()
def update_pet(pet_id):
    body = request.get_json()
    owner_id = get_jwt_identity()
    
    # Buscamos la mascota y verificamos que sea del usuario logueado
    pet = Pet.query.filter_by(id=pet_id, owner_id=owner_id).first()
    
    if not pet:
        return jsonify({"msg": "Mascota no encontrada o no tienes permiso para modificarla"}), 404

    pet.name = body.get("name", pet.name)
    pet.breed = body.get("breed", pet.breed)
    pet.clinical_info = body.get("clinical_info", pet.clinical_info)
    pet.photo_url = body.get("photo_url", pet.photo_url)

    db.session.commit()
    return jsonify({"msg": "Datos de mascota actualizados"}), 200

# 4. Eliminar Mascota (DELETE)
@api.route('/pet/<int:pet_id>', methods=['DELETE'])
@jwt_required()
def delete_pet(pet_id):
    owner_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, owner_id=owner_id).first()

    if not pet:
        return jsonify({"msg": "No se pudo eliminar la mascota"}), 404

    db.session.delete(pet)
    db.session.commit()
    return jsonify({"msg": "Mascota eliminada correctamente"}), 200

@api.route('/hello', methods=['GET'])
def home():
    return jsonify({"msg": "Servidor de Mascota Activo"}), 200