import qrcode
import os
import cloudinary.uploader

def generate_pet_qr_image(url, pet_id):

    print("GENERANDO QR")

    img = qrcode.make(url)

    os.makedirs("static/qr", exist_ok=True)

    local_path = f"static/qr/pet_{pet_id}.png"

    print("GUARDANDO:", local_path)

    img.save(local_path)

    print("SUBIENDO A CLOUDINARY")

    upload_result = cloudinary.uploader.upload(
        local_path,
        folder="pet_qr_codes",
        public_id=f"pet_{pet_id}"
    )

    print("CLOUDINARY OK")

    return upload_result["secure_url"]