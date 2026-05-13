from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    # Importante: Esta línea conecta al usuario con sus mascotas
    pets = db.relationship('Pet', backref='owner', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # No serializamos el password por seguridad ya que es información sensible
        }

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    breed = db.Column(db.String(100), nullable=True) 
    clinical_info = db.Column(db.Text, nullable=True) # El text permite almacenar información clínica más extensa
    photo_url = db.Column(db.String(255), nullable=True)
    qr_code_url = db.Column(db.String(255), nullable=True)
    
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Pet {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "breed": self.breed,
            "clinical_info": self.clinical_info,
            "photo_url": self.photo_url,
            "qr_code_url": self.qr_code_url,
            "owner_id": self.owner_id
        }