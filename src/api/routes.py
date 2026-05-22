from flask import request, jsonify, Blueprint
from api.models import db, User, Pet
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import cloudinary.uploader 

api = Blueprint('api', __name__)

@api.route('/signup', methods=['POST'])
def signup():
    force=True
    body = request.get_json(force=True)
    email = body.get('email')
    password = body.get('password')

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "Ese email ya está registrado"}), 400
    
    if not email or not password:
        return jsonify({"msg": "El email y la contraseña son obligatorios"}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente"}), 201

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json(force=True)
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return jsonify({"msg": "Faltan el email o la contraseña"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({"access_token": access_token}), 200


@api.route('/pet/public/<int:pet_id>', methods=['GET'])
def get_public_pet(pet_id):
    # Buscamos a la mascota por su ID
    pet = Pet.query.get(pet_id)
    
    if not pet:
        return jsonify({"msg": "Mascota no encontrada"}), 404
        
    # Devolvemos SOLO la información pública y necesaria para un rescate
    return jsonify({
        "name": pet.name,
        "breed": pet.breed,
        "photo_url": pet.photo_url,
        "clinical_info": pet.clinical_info,
        # NO enviamos el password del dueño ni datos privados sensibles
    }), 200

@api.route('/pets/gallery', methods=['GET'])
def get_pets_gallery():
    # 1. Buscamos todas las mascotas registradas en la base de datos
    pets = Pet.query.all()
    
    # 2. Filtramos y empaquetamos SOLO la información pública (Minimización de datos)
    gallery = []
    for pet in pets:
        # Opcional: Solo enviamos mascotas que ya tengan una foto subida
        if pet.photo_url: 
            gallery.append({
                "id": pet.id,
                "name": pet.name,
                "photo_url": pet.photo_url
            })
            
    return jsonify(gallery), 200

# --- MISIÓN 1: SUBIDA DE IMÁGENES ---
@api.route('/upload_image', methods=['POST'])
@jwt_required()
def upload_image():
    if 'image' not in request.files:
        return jsonify({"msg": "No se encontró ninguna imagen"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"msg": "No se seleccionó archivo"}), 400

    try:
        # Subida a Cloudinary
        upload_result = cloudinary.uploader.upload(file)
        return jsonify({
            "msg": "Imagen subida a la nube",
            "image_url": upload_result['secure_url']
        }), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

# --- RUTA DE PERFIL ---
@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({"msg": f"Hola {user.email}, bienvenido a tu panel seguro"}), 200

# --- RUTAS DE MASCOTAS (GABRIEL) ---

# 1. Crear Mascota (POST)
@api.route('/pet', methods=['POST'])
@jwt_required()
def create_pet():
    owner_id = get_jwt_identity()

    name = request.form.get("name")
    breed = request.form.get("breed")
    clinical_info = request.form.get("clinical_info")

    if not name:
        return jsonify({"msg": "El nombre es obligatorio"}), 400

    image_file = request.files.get('photo')
    photo_url = None 

    # Si viene una foto, la subimos a Cloudinary de una
    if image_file:
        try:
            upload_result = cloudinary.uploader.upload(image_file)
            photo_url = upload_result.get('secure_url')
        except Exception as e:
            return jsonify({"msg": "Error al subir la foto a Cloudinary", "error": str(e)}), 500

    #  Guardamos la mascota con la URL real generada en el paso anterior
    new_pet = Pet(
        name=name,
        breed=breed,
        clinical_info=clinical_info,
        photo_url=photo_url, 
        owner_id=owner_id
    )

    db.session.add(new_pet)
    db.session.commit()
    
    # Se devuelve el diccionario serializado completo
    return jsonify({
        "msg": f"Mascota {new_pet.name} creada con éxito",
        "pet": new_pet.serialize() 
    }), 201

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