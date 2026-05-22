import { useEffect, useState } from "react";

function PetsGallery() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/pets/gallery")
            .then((res) => res.json())
            .then((data) => {
                setPets(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section id="galeria" style={{ background: "#fff", padding: "6rem 0" }}>
            <div className="container">
                <div className="text-center mb-5">
                    <span className="section-badge">Comunidad</span>
                    <h2
                        style={{
                            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                            fontWeight: 900,
                            letterSpacing: "-0.5px",
                            marginTop: "0.5rem",
                        }}
                    >
                        Mascotas{" "}
                        <span style={{ color: "#ff6b35" }}>registradas</span>
                    </h2>
                    <p
                        className="text-secondary mt-2"
                        style={{ maxWidth: 460, margin: "0.5rem auto 0" }}
                    >
                        Estas mascotas ya tienen su perfil seguro con código QR.
                        ¿La tuya todavía no?
                    </p>
                </div>

                {loading && (
                    <div className="text-center py-5">
                        <div
                            className="spinner-border"
                            style={{ color: "#ff6b35", width: "2.5rem", height: "2.5rem" }}
                        />
                    </div>
                )}

                {!loading && pets.length === 0 && (
                    <div className="text-center py-5">
                        <p style={{ fontSize: "3rem" }}>🐾</p>
                        <p className="text-secondary">
                            Aún no hay mascotas registradas.{" "}
                            <strong>¡Sé el primero!</strong>
                        </p>
                    </div>
                )}

                {!loading && pets.length > 0 && (
                    <div className="row g-4">
                        {pets.map((pet) => (
                            <div
                                className="col-6 col-md-4 col-lg-3"
                                key={pet.id}
                            >
                                <div
                                    className="pet-card"
                                    style={{
                                        background: "#fff",
                                        borderRadius: 20,
                                        overflow: "hidden",
                                        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        cursor: "default",
                                    }}
                                >
                                    <div style={{ height: 200, overflow: "hidden" }}>
                                        <img
                                            src={
                                                pet.photo_url ||
                                                "https://placehold.co/300x300/f5f5f7/999?text=🐾"
                                            }
                                            alt={pet.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                transition: "transform 0.4s ease",
                                            }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            padding: "0.9rem 1rem",
                                            textAlign: "center",
                                        }}
                                    >
                                        <h6
                                            style={{
                                                fontWeight: 700,
                                                margin: 0,
                                                fontSize: "1rem",
                                            }}
                                        >
                                            {pet.name}
                                        </h6>
                                        {pet.breed && (
                                            <p
                                                className="text-secondary mb-0"
                                                style={{ fontSize: "0.82rem" }}
                                            >
                                                {pet.breed}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default PetsGallery;
