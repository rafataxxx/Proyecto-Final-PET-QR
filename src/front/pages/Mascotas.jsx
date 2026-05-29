import { Link } from "react-router-dom";
import PetsGallery from "../components/PetsGallery";

function MascotasNavbar() {
    return (
        <nav
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: "#fff",
                boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
                padding: "0.75rem 0",
            }}
        >
            <div className="container d-flex justify-content-between align-items-center">
                <Link
                    to="/"
                    className="text-decoration-none"
                    style={{ fontSize: "1.4rem", fontWeight: 900, color: "#111", letterSpacing: "-0.5px" }}
                >
                    Pet<span style={{ color: "#ff6b35" }}>QR</span>
                </Link>
                <div className="d-flex gap-3 align-items-center">
                    <Link
                        to="/"
                        style={{ color: "#555", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem" }}
                    >
                        Inicio
                    </Link>
                    <Link
                        to="/login"
                        style={{
                            background: "#111",
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: 600,
                            padding: "0.45rem 1.2rem",
                            borderRadius: 10,
                            fontSize: "0.9rem",
                        }}
                    >
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function Mascotas() {
    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f7" }}>
            <MascotasNavbar />

            {/* Header de la página */}
            <div
                style={{
                    background: "linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)",
                    paddingTop: "7rem",
                    paddingBottom: "4rem",
                    textAlign: "center",
                }}
            >
                <span
                    style={{
                        display: "inline-block",
                        background: "#ff6b35",
                        color: "#fff",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "2.5px",
                        textTransform: "uppercase",
                        padding: "6px 18px",
                        borderRadius: 999,
                        marginBottom: "1rem",
                    }}
                >
                    Comunidad PetQR
                </span>
                <h1
                    style={{
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        letterSpacing: "-1px",
                        marginBottom: "0.75rem",
                    }}
                >
                    Todas las{" "}
                    <span style={{ color: "#ff6b35" }}>mascotas</span>
                </h1>
                <p
                    style={{
                        color: "rgba(255,255,255,0.55)",
                        fontSize: "1.05rem",
                        maxWidth: 480,
                        margin: "0 auto 1.5rem",
                    }}
                >
                    Estas mascotas ya tienen su perfil seguro con código QR.
                    Si encontraste una, escanea su collar para ver sus datos.
                </p>
                <Link
                    to="/login"
                    style={{
                        background: "#ff6b35",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 600,
                        padding: "0.75rem 1.8rem",
                        borderRadius: 14,
                        fontSize: "0.95rem",
                        display: "inline-block",
                        transition: "background 0.2s",
                    }}
                >
                    Registrar mi mascota →
                </Link>
            </div>

            {/* Galería */}
            <PetsGallery />

            {/* Footer mínimo */}
            <footer
                style={{
                    background: "#0f0f0f",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.85rem",
                    padding: "2rem 0",
                    textAlign: "center",
                }}
            >
                Pet<span style={{ color: "#ff6b35" }}>QR</span> — © 2025 · 4Geeks Academy
            </footer>
        </div>
    );
}

export default Mascotas;
