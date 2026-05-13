import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthModal({ show, initialTab = "login", onClose }) {
    const [tab, setTab] = useState(initialTab);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Reset form every time the modal opens
    useEffect(() => {
        if (show) {
            setTab(initialTab);
            setEmail("");
            setPassword("");
            setError(null);
        }
    }, [show, initialTab]);

    const switchTab = (t) => {
        setTab(t);
        setError(null);
        setEmail("");
        setPassword("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Error al iniciar sesión");
            login(data.access_token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Error al registrarse");

            // Auto-login after successful signup
            const loginRes = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const loginData = await loginRes.json();
            if (loginRes.ok) {
                login(loginData.access_token);
                navigate("/dashboard");
            } else {
                switchTab("login");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="auth-backdrop" onClick={onClose} />

            {/* Modal */}
            <div className="auth-modal-wrap">
                <div className="auth-modal">
                    {/* Tabs */}
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${tab === "login" ? "active" : ""}`}
                            onClick={() => switchTab("login")}
                            type="button"
                        >
                            Iniciar sesión
                        </button>
                        <button
                            className={`auth-tab ${tab === "register" ? "active" : ""}`}
                            onClick={() => switchTab("register")}
                            type="button"
                        >
                            Registrarse
                        </button>
                        <button
                            className="auth-close"
                            onClick={onClose}
                            type="button"
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Body */}
                    <div className="auth-body">
                        <h2 className="auth-title">
                            {tab === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta"}
                        </h2>
                        <p className="auth-subtitle">
                            {tab === "login"
                                ? "Ingresa tus datos para continuar"
                                : "Registra tu cuenta y protege a tu mascota"}
                        </p>

                        {error && (
                            <div className="auth-error">{error}</div>
                        )}

                        <form onSubmit={tab === "login" ? handleLogin : handleSignup}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="tu@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ borderRadius: 12 }}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ borderRadius: 12 }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-orange w-100"
                                disabled={loading}
                                style={{
                                    fontSize: "1rem",
                                    padding: "0.85rem",
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    borderRadius: 14,
                                    opacity: loading ? 0.7 : 1,
                                }}
                            >
                                {loading
                                    ? "Cargando..."
                                    : tab === "login"
                                    ? "Iniciar sesión"
                                    : "Crear cuenta"}
                            </button>
                        </form>

                        <p className="text-center mt-3 text-secondary" style={{ fontSize: "0.88rem" }}>
                            {tab === "login" ? (
                                <>
                                    ¿No tienes cuenta?{" "}
                                    <button className="btn-link-orange" type="button" onClick={() => switchTab("register")}>
                                        Regístrate
                                    </button>
                                </>
                            ) : (
                                <>
                                    ¿Ya tienes cuenta?{" "}
                                    <button className="btn-link-orange" type="button" onClick={() => switchTab("login")}>
                                        Inicia sesión
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AuthModal;
