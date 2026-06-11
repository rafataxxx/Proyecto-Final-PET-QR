import qrcode
import os

def generate_pet_qr(pet_id):

    qr = qrcode.make(f"http://localhost:3000/pet/{pet_id}")

    folder = "static/qr"
    os.makedirs(folder, exist_ok=True)

    filepath = f"{folder}/pet_{pet_id}.png"

    qr.save(filepath)

    return filepath