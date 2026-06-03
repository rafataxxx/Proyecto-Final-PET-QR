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

    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotResult, setForgotResult] = useState(null);

    // Reset form every time the modal opens
    useEffect(() => {
        if (show) {
            setTab(initialTab);
            setEmail("");
            setPassword("");
            setError(null);
            setForgotEmail("");
            setForgotResult(null);
        }
    }, [show, initialTab]);

    const switchTab = (t) => {
        setTab(t);
        setError(null);
        setEmail("");
        setPassword("");
        setForgotEmail("");
        setForgotResult(null);
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Error al restablecer");
            setForgotResult({ success: true, tempPassword: data.temp_password });
        } catch (err) {
            setForgotResult({ success: false, error: err.message });
        } finally {
            setForgotLoading(false);
        }
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
                        {tab !== "forgot" && (
                            <>
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
                            </>
                        )}
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
                        {tab !== "forgot" ? (
                            <>
                                <h2 className="auth-title">
                                    {tab === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta"}
                                </h2>
                                <p className="auth-subtitle">
                                    {tab === "login"
                                        ? "Ingresa tus datos para continuar"
                                        : "Registra tu cuenta y protege a tu mascota"}
                                </p>

                                {error && <div className="auth-error">{error}</div>}

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
                                        <div className="d-flex justify-content-between align-items-center">
                                            <label className="form-label fw-semibold mb-0" style={{ fontSize: "0.9rem" }}>
                                                Contraseña
                                            </label>
                                            {tab === "login" && (
                                                <button
                                                    type="button"
                                                    onClick={() => switchTab("forgot")}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "#ff6b35",
                                                        fontSize: "0.82rem",
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                        padding: 0,
                                                    }}
                                                >
                                                    ¿Olvidaste tu contraseña?
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg mt-1"
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
                            </>
                        ) : (
                            /* ── Forgot password view ── */
                            <>
                                {!forgotResult ? (
                                    <>
                                        <h2 className="auth-title">Restablecer contraseña</h2>
                                        <p className="auth-subtitle">
                                            Ingresa tu correo y te daremos una contraseña temporal.
                                        </p>
                                        <form onSubmit={handleForgot}>
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                                                    Correo electrónico
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control form-control-lg"
                                                    placeholder="tu@correo.com"
                                                    value={forgotEmail}
                                                    onChange={(e) => setForgotEmail(e.target.value)}
                                                    required
                                                    autoFocus
                                                    style={{ borderRadius: 12 }}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn-orange w-100"
                                                disabled={forgotLoading}
                                                style={{
                                                    fontSize: "1rem",
                                                    padding: "0.85rem",
                                                    border: "none",
                                                    cursor: forgotLoading ? "not-allowed" : "pointer",
                                                    borderRadius: 14,
                                                    opacity: forgotLoading ? 0.7 : 1,
                                                }}
                                            >
                                                {forgotLoading ? "Restableciendo..." : "Restablecer contraseña"}
                                            </button>
                                        </form>
                                        <p className="text-center mt-3 text-secondary" style={{ fontSize: "0.88rem" }}>
                                            <button className="btn-link-orange" type="button" onClick={() => switchTab("login")}>
                                                ← Volver al inicio de sesión
                                            </button>
                                        </p>
                                    </>
                                ) : forgotResult.success ? (
                                    <>
                                        <div className="text-center mb-3" style={{ fontSize: "2.5rem" }}>🔑</div>
                                        <h2 className="auth-title text-center">¡Contraseña restablecida!</h2>
                                        <p className="auth-subtitle text-center">Tu contraseña temporal es:</p>
                                        <div
                                            className="text-center fw-bold mb-4"
                                            style={{
                                                background: "#fff4ef",
                                                border: "2px solid #ff6b35",
                                                borderRadius: 12,
                                                padding: "0.9rem",
                                                fontSize: "1.1rem",
                                                letterSpacing: "0.5px",
                                                color: "#ff6b35",
                                                userSelect: "all",
                                            }}
                                        >
                                            {forgotResult.tempPassword}
                                        </div>
                                        <p className="text-secondary text-center mb-4" style={{ fontSize: "0.85rem" }}>
                                            Inicia sesión con esta contraseña y cámbiala desde tu perfil.
                                        </p>
                                        <button
                                            type="button"
                                            className="btn-orange w-100"
                                            onClick={() => switchTab("login")}
                                            style={{
                                                fontSize: "1rem",
                                                padding: "0.85rem",
                                                border: "none",
                                                cursor: "pointer",
                                                borderRadius: 14,
                                            }}
                                        >
                                            Ir a iniciar sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="auth-title text-center">Error</h2>
                                        <p className="text-danger text-center mb-4">{forgotResult.error}</p>
                                        <button
                                            type="button"
                                            className="btn-orange w-100"
                                            onClick={() => switchTab("forgot")}
                                            style={{
                                                fontSize: "1rem",
                                                padding: "0.85rem",
                                                border: "none",
                                                cursor: "pointer",
                                                borderRadius: 14,
                                            }}
                                        >
                                            Intentar de nuevo
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AuthModal;
