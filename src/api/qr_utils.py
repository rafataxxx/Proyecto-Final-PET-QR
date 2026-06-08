import qrcode
import os
import cloudinary.uploader

def generate_pet_qr_image(url, pet_id):

    img = qrcode.make(url)

    os.makedirs("static/qr", exist_ok=True)

    local_path = f"static/qr/pet_{pet_id}.png"
    img.save(local_path)

    upload_result = cloudinary.uploader.upload(
        local_path,
        folder="pet_qr_codes",
        public_id=f"pet_{pet_id}"
    )

    return upload_result["secure_url"]