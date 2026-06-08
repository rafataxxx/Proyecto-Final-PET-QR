import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PetView() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/pet/${id}`)
            .then(res => res.json())
            .then(data => {
                setPet(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Cargando...</p>;
    if (!pet) return <p>No encontrada</p>;

    return (
        <div style={{ maxWidth: "420px", margin: "auto" }}>
            <img
                src={pet.image_url}
                style={{ width: "100%", borderRadius: "12px" }}
                alt={pet.name}
            />

            <h2>{pet.name}</h2>
            <p>🐶 {pet.species}</p>
            <p>🐾 {pet.breed}</p>
            <p>🎂 {pet.age} años</p>
            <p>🎨 {pet.color}</p>

            <p>{pet.description}</p>
        </div>
    );
}