import os
from flask import request, jsonify, Blueprint
from api.models import db, User, Pet
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import cloudinary
import cloudinary.uploader 

# 🔥 CONFIGURACIÓN GRABADA EN PIEDRA EN EL ARCHIVO DE ACCIÓN
cloudinary.config(
    cloud_name = "duihbjpmv",
    api_key = "154976915816475",
    api_secret = "ERPF50oeF9xEYe5b6Vv0Fezxga8",
    secure = True
)

from api.qr_generator import generate_pet_qr
from api.qr_utils import generate_pet_qr_image

api = Blueprint('api', __name__)

# --- MISIÓN 1: SUBIDA DE IMÁGENES ---
# --- MISIÓN 1: SUBIDA DE IMÁGENES (A PRUEBA DE BALAS) ---
@api.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"msg": "Falta la llave 'image' en el FormData"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"msg": "No seleccionaste ningún archivo físico"}), 400

    try:
        upload_result = cloudinary.uploader.upload(
            file,
            cloud_name="duihbjpmv",
            api_key="154976915816475",
            api_secret="ERPF50oeF9xEYe5b6Vv0Fezxga8",
            secure=True
        )
        
        return jsonify({
            "msg": "Imagen subida exitosamente",
            "image_url": upload_result['secure_url']
        }), 200

    except Exception as e:
        print("ERROR CRÍTICO:", str(e))
        return jsonify({
            "msg": "Error en el servidor al subir a Cloudinary",
            "error_real": str(e)
        }), 500

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

    hashed_password = generate_password_hash(
    password,
    method='pbkdf2:sha256'
)

    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente"}), 201

@api.route('/login', methods=['POST'])
def login():
    try:
        body = request.get_json(force=True)
        email = body.get('email')
        password = body.get('password')

        if not email or not password:
            return jsonify({"msg": "Faltan el email o la contraseña"}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return jsonify({"msg": "Email o contraseña incorrectos"}), 401

        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "access_token": access_token,
            "is_admin": user.is_admin
        }), 200
    except Exception as e:
        return jsonify({"msg": f"Error interno: {str(e)}"}), 500


@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    body = request.get_json(force=True)
    email = body.get('email')

    if not email:
        return jsonify({"msg": "El correo electrónico es obligatorio"}), 400

    user = User.query.filter_by(email=email).first()

    if user:
        temporal_password = "PetQRProvisional123*"
        user.password = generate_password_hash(temporal_password)
        db.session.commit()

    # Siempre respondemos igual para no revelar si el email existe
    return jsonify({
        "msg": "Si ese correo está registrado, se ha restablecido la contraseña.",
        "temp_password": "PetQRProvisional123*"
    }), 200

@api.route('/pet/public/<int:pet_id>', methods=['GET'])
def get_public_pet(pet_id):
    pet = Pet.query.get(pet_id)

    if not pet:
        return jsonify({"msg": "Mascota no encontrada"}), 404

    return jsonify({
        "id": pet.id,
        "name": pet.name,
        "breed": pet.breed,
        "species": pet.species,
        "color": pet.color,
        "age": pet.age,
        "contact": pet.contact,
        "address": pet.address,  # ← NUEVO CAMPO
        "photo_url": pet.photo_url,
        "clinical_info": pet.clinical_info,
    }), 200

@api.route('/pets/gallery', methods=['GET'])
def get_pets_gallery():

    pets = Pet.query.all()
    
    gallery = []
    for pet in pets:
        gallery.append({
            "id": pet.id,
            "name": pet.name,
            "breed": pet.breed,
            "species": pet.species,
            "photo_url": pet.photo_url,
        })
            
    return jsonify(gallery), 200


    
# --- RUTA DE PERFIL ---
@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({"msg": f"Hola {user.email}, bienvenido a tu panel seguro"}), 200

@api.route('/my_pets', methods=['GET'])
@jwt_required()
def get_my_pets():
    user_id = get_jwt_identity()
    pets = Pet.query.filter_by(owner_id=user_id).all()
    return jsonify([pet.serialize() for pet in pets]), 200

from api.qr_utils import generate_pet_qr_image

@api.route('/pets', methods=['POST'])
@jwt_required()
def create_pet():

    user_id = get_jwt_identity()
    body = request.get_json() or {}

    new_pet = Pet(
        name=body.get('name'),
        breed=body.get('breed'),
        species=body.get('species'),
        color=body.get('color'),
        sex=body.get('sex'),
        age=body.get('age'),
        contact=body.get('contact'),
        address=body.get('address'),  # ← NUEVO CAMPO
        clinical_info=body.get('clinical_info'),
        photo_url=body.get('photo_url'),
        owner_id=user_id
    )

    db.session.add(new_pet)
    db.session.commit()

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

    qr_link = f"{frontend_url}/pets/{new_pet.id}"

    qr_path = generate_pet_qr_image(qr_link, new_pet.id)

    new_pet.qr_code_url = qr_path

    db.session.commit()

    return jsonify(new_pet.serialize()), 201

@api.route('/pets/<int:pet_id>', methods=['PUT'])
@jwt_required()
def update_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, owner_id=user_id).first()
    if not pet:
        return jsonify({"msg": "Mascota no encontrada"}), 404
    body = request.get_json()
    pet.name = body.get('name', pet.name)
    pet.breed = body.get('breed', pet.breed)
    pet.species = body.get('species', pet.species)
    pet.color = body.get('color', pet.color)
    pet.sex = body.get('sex', pet.sex)
    pet.age = body.get('age', pet.age)
    pet.contact = body.get('contact', pet.contact)
    pet.address = body.get('address', pet.address)  # ← NUEVO CAMPO
    pet.clinical_info = body.get('clinical_info', pet.clinical_info)
    pet.photo_url = body.get('photo_url', pet.photo_url)
    db.session.commit()
    return jsonify(pet.serialize()), 200

@api.route('/pets/<int:pet_id>', methods=['DELETE'])
@jwt_required()
def delete_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, owner_id=user_id).first()
    if not pet:
        return jsonify({"msg": "Mascota no encontrada"}), 404
    db.session.delete(pet)
    db.session.commit()
    return jsonify({"msg": "Mascota eliminada"}), 200

# ── ADMIN ENDPOINTS ─────────────────────────────────────────────────────────
def admin_required():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return None, True
    return user, False

@api.route('/admin/pets', methods=['GET'])
@jwt_required()
def admin_get_all_pets():
    user, denied = admin_required()
    if denied:
        return jsonify({"msg": "Acceso denegado"}), 403
    pets = Pet.query.all()
    result = []
    for pet in pets:
        data = pet.serialize()
        data['owner_email'] = pet.owner.email if pet.owner else "—"
        result.append(data)
    return jsonify(result), 200

@api.route('/admin/pets/<int:pet_id>', methods=['PUT'])
@jwt_required()
def admin_update_pet(pet_id):
    user, denied = admin_required()
    if denied:
        return jsonify({"msg": "Acceso denegado"}), 403
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"msg": "Mascota no encontrada"}), 404
    body = request.get_json()
    pet.name = body.get('name', pet.name)
    pet.breed = body.get('breed', pet.breed)
    pet.species = body.get('species', pet.species)
    pet.color = body.get('color', pet.color)
    pet.sex = body.get('sex', pet.sex)
    pet.age = body.get('age', pet.age)
    pet.contact = body.get('contact', pet.contact)
    pet.address = body.get('address', pet.address)  # ← NUEVO CAMPO
    pet.clinical_info = body.get('clinical_info', pet.clinical_info)
    pet.photo_url = body.get('photo_url', pet.photo_url)
    db.session.commit()
    data = pet.serialize()
    data['owner_email'] = pet.owner.email if pet.owner else "—"
    return jsonify(data), 200

@api.route('/admin/pets/<int:pet_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_pet(pet_id):
    user, denied = admin_required()
    if denied:
        return jsonify({"msg": "Acceso denegado"}), 403
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"msg": "Mascota no encontrada"}), 404
    db.session.delete(pet)
    db.session.commit()
    return jsonify({"msg": "Mascota eliminada"}), 200

@api.route('/hello', methods=['GET'])
def home():
    return jsonify({"msg": "Servidor de Mascota Activo"}), 200

@api.route('/pet/<int:pet_id>', methods=['GET'])
def get_pet(pet_id):
    pet = Pet.query.get(pet_id)

    if not pet:
        return jsonify({"msg": "Mascota no encontrada"}), 404

    return jsonify({
        "id": pet.id,
        "name": pet.name,
        "species": pet.species,
        "breed": pet.breed,
        "age": pet.age,
        "color": pet.color,
        "address": pet.address,  # ← NUEVO CAMPO
        "image_url": pet.image_url if hasattr(pet, 'image_url') else pet.photo_url,
        "description": pet.description if hasattr(pet, 'description') else pet.clinical_info
    })

# ── GENERAR PDF CON QR ─────────────────────────────────────────────────────────
@api.route('/pets/<int:pet_id>/qr_pdf', methods=['GET'])
@jwt_required()
def generate_qr_pdf(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, owner_id=user_id).first()
    
    if not pet:
        return jsonify({"msg": "Mascota no encontrada"}), 404
    
    if not pet.qr_code_url:
        return jsonify({"msg": "La mascota no tiene código QR generado"}), 404
    
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
        from reportlab.lib.utils import ImageReader
        from io import BytesIO
        import requests
        
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        # Título
        c.setFont("Helvetica-Bold", 20)
        c.drawString(50, height - 50, f"Código QR - {pet.name}")
        
        # Línea separadora
        c.line(50, height - 70, width - 50, height - 70)
        
        # Información de la mascota
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 100, f"Nombre: {pet.name}")
        c.drawString(50, height - 120, f"Especie: {pet.species or 'No especificada'}")
        c.drawString(50, height - 140, f"Raza: {pet.breed or 'No especificada'}")
        c.drawString(50, height - 160, f"Color: {pet.color or 'No especificado'}")
        c.drawString(50, height - 180, f"Sexo: {pet.sex or 'No especificado'}")
        c.drawString(50, height - 200, f"Edad: {pet.age or 'No especificada'}")
        c.drawString(50, height - 220, f"Contacto: {pet.contact or 'No especificado'}")
        c.drawString(50, height - 240, f"Dirección: {pet.address or 'No especificada'}")
        
        # Descargar QR desde Cloudinary
        response = requests.get(pet.qr_code_url)
        qr_image = ImageReader(BytesIO(response.content))
        
        # Posición del QR
        qr_size = 200
        qr_x = (width - qr_size) / 2
        qr_y = height - 500
        c.drawImage(qr_image, qr_x, qr_y, width=qr_size, height=qr_size)
        
        # Texto adicional
        c.setFont("Helvetica", 10)
        c.drawString(50, qr_y - 30, "Escanea este código QR para ver la informacion completa")
        
        # Finalizar PDF
        c.save()
        buffer.seek(0)
        
        from flask import send_file
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"qr_{pet.name}_{pet.id}.pdf",
            mimetype='application/pdf'
        )
        
    except Exception as e:
        print(f"Error generando PDF: {str(e)}")
        return jsonify({"msg": f"Error al generar PDF: {str(e)}"}), 500