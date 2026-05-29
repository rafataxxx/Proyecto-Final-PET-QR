import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Credenciales incorrectas");
            if (!data.is_admin) throw new Error("No tienes permisos de administrador");
            login(data.access_token, true);
            navigate("/admin");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Fondo decorativo */}
            <div style={{
                position: "absolute", inset: 0, zIndex: 0,
                backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,107,53,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,107,53,0.05) 0%, transparent 40%)",
            }} />
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,107,53,0.3), transparent)",
            }} />

            {/* Grid pattern */}
            <div style={{
                position: "absolute", inset: 0, zIndex: 0,
                backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
            }} />

            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>

                {/* Logo + badge */}
                <div className="text-center mb-5">
                    <Link to="/" className="text-decoration-none">
                        <span style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
                            Pet<span style={{ color: "#ff6b35" }}>QR</span>
                        </span>
                    </Link>
                    <div style={{ marginTop: "0.75rem" }}>
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.3)",
                            color: "#ff6b35", fontSize: "0.7rem", fontWeight: 700,
                            letterSpacing: "2px", textTransform: "uppercase",
                            padding: "5px 14px", borderRadius: 999,
                        }}>
                            🔐 Panel de administración
                        </span>
                    </div>
                </div>

                {/* Card */}
                <div style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 24,
                    padding: "2.5rem 2rem",
                    backdropFilter: "blur(12px)",
                }}>
                    <h1 style={{
                        color: "#fff", fontWeight: 800,
                        fontSize: "1.6rem", letterSpacing: "-0.5px",
                        marginBottom: "0.3rem",
                    }}>
                        Acceso restringido
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", marginBottom: "2rem" }}>
                        Solo para administradores del sistema
                    </p>

                    {error && (
                        <div style={{
                            background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.3)",
                            color: "#ff6b6b", borderRadius: 10,
                            padding: "0.65rem 1rem", fontSize: "0.88rem", marginBottom: "1.25rem",
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                                Correo electrónico
                            </label>
                            <input
                                type="email" name="email"
                                placeholder="admin@correo.com"
                                value={form.email} onChange={handleChange} required
                                style={{
                                    width: "100%", background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                                    padding: "0.75rem 1rem", color: "#fff", fontSize: "0.95rem",
                                    outline: "none", transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => e.target.style.borderColor = "rgba(255,107,53,0.5)"}
                                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                            />
                        </div>

                        <div style={{ marginBottom: "1.75rem" }}>
                            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                                Contraseña
                            </label>
                            <input
                                type="password" name="password"
                                placeholder="••••••••••"
                                value={form.password} onChange={handleChange} required
                                style={{
                                    width: "100%", background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                                    padding: "0.75rem 1rem", color: "#fff", fontSize: "0.95rem",
                                    outline: "none", transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => e.target.style.borderColor = "rgba(255,107,53,0.5)"}
                                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                            />
                        </div>

                        <button type="submit" disabled={loading}
                            style={{
                                width: "100%", background: loading ? "rgba(255,107,53,0.5)" : "#ff6b35",
                                color: "#fff", border: "none", borderRadius: 14,
                                padding: "0.9rem", fontWeight: 700, fontSize: "0.95rem",
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "background 0.2s, transform 0.15s",
                                letterSpacing: "0.3px",
                            }}
                            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            {loading ? "Verificando..." : "Entrar al panel →"}
                        </button>
                    </form>
                </div>

                {/* Link volver */}
                <p className="text-center mt-4" style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.85rem" }}>
                    ¿No eres admin?{" "}
                    <Link to="/login" style={{ color: "rgba(255,107,53,0.7)", textDecoration: "none", fontWeight: 600 }}>
                        Ir al login normal
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;
