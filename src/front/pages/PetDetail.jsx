import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PetDetail() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);

    useEffect(() => {
        console.log("ID:", id);

        fetch(`http://localhost:3001/api/pet/public/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log("DATA:", data);
                setPet(data);
            });
    }, [id]);

    if (!pet) return <p>Cargando...</p>;

    return (
        <div style={{ padding: 20 }}>
            <h1>🐾 {pet.name}</h1>

            <img
                src={pet.photo_url}
                style={{ width: 200, borderRadius: 12 }}
            />

            <p><b>Raza:</b> {pet.breed}</p>
            <p><b>Especie:</b> {pet.species}</p>
            <p><b>Color:</b> {pet.color}</p>
            <p><b>Edad:</b> {pet.age}</p>
            <p><b>Contacto:</b> {pet.contact}</p>
        </div>
    );
}