import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PetDetail() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [error, setError] = useState(null);
    const [urlIntentada, setUrlIntentada] = useState("");

    useEffect(() => {
        const backendUrl = "http://localhost:3001"; // Para local
        const url = `${backendUrl}/pet/public/${id}`; // Sin /api
        setUrlIntentada(url);

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .then(data => {
                setPet(data);
            })
            .catch(err => {
                setError(err.message);
            });
    }, [id]);

    if (error) {
        return (
            <div style={{ padding: 20, color: "red" }}>
                <h3>Error:</h3>
                <p>{error}</p>
                <h4>Intentó cargar:</h4>
                <p style={{ fontSize: 12, wordBreak: "break-all" }}>{urlIntentada}</p>
            </div>
        );
    }

    if (!pet) return <p>Cargando...</p>;

    return (
        <div style={{ padding: 20 }}>
            <h1>{pet.name}</h1>
            <pre>{JSON.stringify(pet, null, 2)}</pre>
        </div>
    );
}