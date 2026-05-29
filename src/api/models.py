from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean(), default=True)
    is_admin = db.Column(db.Boolean(), default=False)

    pets = db.relationship('Pet', backref='owner', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active,
            "is_admin": self.is_admin
        }

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    breed = db.Column(db.String(100))
    species = db.Column(db.String(50))
    color = db.Column(db.String(50))
    sex = db.Column(db.String(20))
    age = db.Column(db.String(20))
    contact = db.Column(db.String(100))
    clinical_info = db.Column(db.Text)
    photo_url = db.Column(db.String(255))
    qr_code_url = db.Column(db.String(255))
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "breed": self.breed,
            "species": self.species,
            "color": self.color,
            "sex": self.sex,
            "age": self.age,
            "contact": self.contact,
            "clinical_info": self.clinical_info,
            "photo_url": self.photo_url,
            "qr_code_url": self.qr_code_url,
            "owner_id": self.owner_id
        }
