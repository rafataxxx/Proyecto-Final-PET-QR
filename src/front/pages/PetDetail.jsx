import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function PetDetail() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/api/pet/public/${id}`)
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}`);
                return res.json();
            })
            .then(setPet)
            .catch(err => setError(err.message));
    }, [id]);

    if (error) {
        return (
            <div style={{ minHeight: "100vh", background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🐾</div>
                    <h2 style={{ fontWeight: 800, color: "#222", marginBottom: "0.5rem" }}>Mascota no encontrada</h2>
                    <p style={{ color: "#999", marginBottom: "1.5rem" }}>El perfil que buscas no existe o fue eliminado.</p>
                    <Link to="/" style={{ color: "#ff6b35", fontWeight: 600, textDecoration: "none" }}>Volver al inicio</Link>
                </div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div style={{ minHeight: "100vh", background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="spinner-border" style={{ color: "#ff6b35", width: "2.5rem", height: "2.5rem" }} role="status" />
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f7" }}>

            {/* Header */}
            <nav style={{ background: "#fff", boxShadow: "0 2px 24px rgba(0,0,0,0.07)", padding: "0.85rem 0" }}>
                <div className="container">
                    <Link to="/" className="text-decoration-none" style={{ fontSize: "1.4rem", fontWeight: 900, color: "#111", letterSpacing: "-0.5px" }}>
                        Pet<span style={{ color: "#ff6b35" }}>QR</span>
                    </Link>
                </div>
            </nav>

            <div className="container py-5">
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.09)" }}>

                        {/* Foto */}
                        <div style={{ height: 320, background: "#f5f5f7", overflow: "hidden" }}>
                            {pet.photo_url ? (
                                <img src={pet.photo_url} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>🐾</div>
                            )}
                        </div>

                        <div style={{ padding: "2rem 2.5rem 2.5rem" }}>

                            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#111", letterSpacing: "-0.5px", marginBottom: "1.5rem" }}>
                                {pet.name}
                            </h1>

                            {/* Grid de datos */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                                {[
                                    { label: "Especie", value: pet.species },
                                    { label: "Raza", value: pet.breed },
                                    { label: "Color", value: pet.color },
                                    { label: "Sexo", value: pet.sex },
                                    { label: "Edad", value: pet.age },
                                ].filter(d => d.value).map(d => (
                                    <div key={d.label} style={{ background: "#f8f8fa", borderRadius: 14, padding: "0.9rem 1.1rem" }}>
                                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.25rem" }}>{d.label}</div>
                                        <div style={{ fontSize: "1rem", fontWeight: 600, color: "#222" }}>{d.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Contacto */}
                            {pet.contact && (
                                <div style={{ background: "#fff4f0", border: "1px solid #ffe0d4", borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
                                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ff6b35", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.35rem" }}>📞 Contacto del dueño</div>
                                    <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#222" }}>{pet.contact}</div>
                                </div>
                            )}

                            {/* Info clínica */}
                            {pet.clinical_info && (
                                <div style={{ background: "#f0f7ff", border: "1px solid #d4e8ff", borderRadius: 16, padding: "1.25rem 1.5rem" }}>
                                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.35rem" }}>🩺 Información médica</div>
                                    <p style={{ fontSize: "0.95rem", color: "#333", lineHeight: 1.7, margin: 0 }}>{pet.clinical_info}</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}