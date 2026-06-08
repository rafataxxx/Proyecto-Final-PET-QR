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
        <div style={styles.page}>

            <div style={styles.card}>

                {/* FOTO */}
                <div style={styles.imageBox}>
                    {pet.photo_url ? (
                        <img
                            src={pet.photo_url}
                            alt={pet.name}
                            style={styles.image}
                        />
                    ) : (
                        <div style={styles.noImage}>🐾 Sin foto</div>
                    )}
                </div>

                {/* INFO */}
                <div style={styles.info}>
                    <h1 style={styles.name}>🐶 {pet.name}</h1>

                    <div style={styles.grid}>
                        <p><b>Especie:</b> {pet.species}</p>
                        <p><b>Raza:</b> {pet.breed}</p>
                        <p><b>Color:</b> {pet.color}</p>
                        <p><b>Edad:</b> {pet.age}</p>
                    </div>

                    <div style={styles.section}>
                        <p><b>📞 Contacto:</b></p>
                        <span>{pet.contact}</span>
                    </div>

                    {pet.clinical_info && (
                        <div style={styles.section}>
                            <p><b>🩺 Información clínica</b></p>
                            <p style={{ fontSize: 14 }}>{pet.clinical_info}</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}