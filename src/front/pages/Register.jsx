import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const fileRef = useRef(null);

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirm: "",
        petName: "",
        breed: "",
        clinicalInfo: "",
        photo: null,
        photoPreview: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm((prev) => ({
            ...prev,
            photo: file,
            photoPreview: URL.createObjectURL(file),
        }));
    };

    const goToStep2 = (e) => {
        e.preventDefault();
        if (!form.email || !form.password || !form.confirm)
            return setError("Completa todos los campos");
        if (form.password !== form.confirm)
            return setError("Las contraseñas no coinciden");
        if (form.password.length < 6)
            return setError("La contraseña debe tener al menos 6 caracteres");
        setError(null);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.petName) return setError("El nombre de tu mascota es obligatorio");

        setLoading(true);
        setError(null);

        try {
            // 1. Crear cuenta de usuario
            const signupRes = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });
            const signupData = await signupRes.json();
            if (!signupRes.ok)
                throw new Error(signupData.msg || "Error al crear la cuenta");

            // 2. Auto-login para obtener el token
            const loginRes = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });
            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error("Error al iniciar sesión automáticamente");

            const token = loginData.access_token;
            login(token);

            // 3. Subir foto si se seleccionó una
            let photoUrl = null;
            if (form.photo) {
                const formData = new FormData();
                formData.append("image", form.photo);
                const uploadRes = await fetch("/api/upload_image", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    photoUrl = uploadData.image_url;
                }
            }

            // 4. Crear perfil de mascota
            await fetch("/api/pets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: form.petName,
                    breed: form.breed,
                    clinical_info: form.clinicalInfo,
                    photo_url: photoUrl,
                }),
            });

            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const inputStyle = {
        borderRadius: 12,
        border: "1.5px solid #e0e0e0",
        background: "#fff",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f7",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <div style={{ padding: "1.5rem 2rem" }}>
                <Link
                    to="/"
                    className="text-decoration-none"
                    style={{ fontSize: "1.4rem", fontWeight: 900, color: "#111" }}
                >
                    Pet<span style={{ color: "#ff6b35" }}>QR</span>
                </Link>
            </div>

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                }}
            >
                <div style={{ width: "100%", maxWidth: 520 }}>

                    {/* Indicador de paso */}
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: "#ff6b35",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            1
                        </div>
                        <div
                            style={{
                                height: 3,
                                flex: 1,
                                background: step >= 2 ? "#ff6b35" : "#e0e0e0",
                                borderRadius: 2,
                                transition: "background 0.4s ease",
                            }}
                        />
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: step >= 2 ? "#ff6b35" : "#e0e0e0",
                                color: step >= 2 ? "#fff" : "#aaa",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: "background 0.4s ease, color 0.4s ease",
                            }}
                        >
                            2
                        </div>
                    </div>

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 24,
                            padding: "2rem 2rem 2.5rem",
                            boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
                        }}
                        className="fade-in"
                    >
                        {step === 1 ? (
                            <>
                                <h1
                                    style={{
                                        fontSize: "1.8rem",
                                        fontWeight: 800,
                                        letterSpacing: "-0.5px",
                                        marginBottom: "0.2rem",
                                    }}
                                >
                                    Crea tu cuenta
                                </h1>
                                <p
                                    className="text-secondary mb-4"
                                    style={{ fontSize: "0.9rem" }}
                                >
                                    Paso 1 de 2 — Datos de acceso
                                </p>

                                {error && <div className="auth-error">{error}</div>}

                                <form onSubmit={goToStep2}>
                                    <div className="mb-3">
                                        <label
                                            className="form-label fw-semibold"
                                            style={{ fontSize: "0.88rem" }}
                                        >
                                            Correo electrónico
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control form-control-lg"
                                            placeholder="tu@correo.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            className="form-label fw-semibold"
                                            style={{ fontSize: "0.88rem" }}
                                        >
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control form-control-lg"
                                            placeholder="Mínimo 6 caracteres"
                                            value={form.password}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            className="form-label fw-semibold"
                                            style={{ fontSize: "0.88rem" }}
                                        >
                                            Confirmar contraseña
                                        </label>
                                        <input
                                            type="password"
                                            name="confirm"
                                            className="form-control form-control-lg"
                                            placeholder="Repite la contraseña"
                                            value={form.confirm}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-orange w-100 text-center"
                                        style={{
                                            fontSize: "1rem",
                                            padding: "0.85rem",
                                            borderRadius: 14,
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Siguiente →
                                    </button>
                                </form>

                                <p
                                    className="text-center mt-4 text-secondary"
                                    style={{ fontSize: "0.9rem" }}
                                >
                                    ¿Ya tienes cuenta?{" "}
                                    <Link
                                        to="/login"
                                        style={{
                                            color: "#ff6b35",
                                            fontWeight: 600,
                                            textDecoration: "none",
                                        }}
                                    >
                                        Inicia sesión
                                    </Link>
                                </p>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setError(null);
                                    }}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#999",
                                        fontSize: "0.88rem",
                                        cursor: "pointer",
                                        padding: 0,
                                        marginBottom: "0.75rem",
                                    }}
                                >
                                    ← Volver
                                </button>
                                <h1
                                    style={{
                                        fontSize: "1.8rem",
                                        fontWeight: 800,
                                        letterSpacing: "-0.5px",
                                        marginBottom: "0.2rem",
                                    }}
                                >
                                    Tu mascota
                                </h1>
                                <p
                                    className="text-secondary mb-4"
                                    style={{ fontSize: "0.9rem" }}
                                >
                                    Paso 2 de 2 — Perfil de tu mascota
                                </p>

                                {error && <div className="auth-error">{error}</div>}

                                <form onSubmit={handleSubmit}>
                                    {/* Foto circular */}
                                    <div className="mb-4 text-center">
                                        <div
                                            onClick={() => fileRef.current.click()}
                                            style={{
                                                width: 110,
                                                height: 110,
                                                borderRadius: "50%",
                                                background: form.photoPreview
                                                    ? "transparent"
                                                    : "#f5f5f7",
                                                border: `2.5px dashed ${form.photoPreview ? "#ff6b35" : "#ddd"}`,
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: "0 auto",
                                                overflow: "hidden",
                                                transition: "border-color 0.2s",
                                            }}
                                        >
                                            {form.photoPreview ? (
                                                <img
                                                    src={form.photoPreview}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                    alt="preview"
                                                />
                                            ) : (
                                                <span style={{ fontSize: "2.2rem", color: "#ccc" }}>
                                                    📷
                                                </span>
                                            )}
                                        </div>
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handlePhoto}
                                        />
                                        <p
                                            className="mt-2 mb-0 text-secondary"
                                            style={{ fontSize: "0.82rem", cursor: "pointer" }}
                                            onClick={() => fileRef.current.click()}
                                        >
                                            {form.photoPreview
                                                ? "Cambiar foto"
                                                : "Agregar foto de la mascota"}
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            className="form-label fw-semibold"
                                            style={{ fontSize: "0.88rem" }}
                                        >
                                            Nombre de la mascota{" "}
                                            <span style={{ color: "#ff6b35" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="petName"
                                            className="form-control form-control-lg"
                                            placeholder="Ej: Luna, Max, Firulais"
                                            value={form.petName}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            className="form-label fw-semibold"
                                            style={{ fontSize: "0.88rem" }}
                                        >
                                            Raza
                                        </label>
                                        <input
                                            type="text"
                                            name="breed"
                                            className="form-control form-control-lg"
                                            placeholder="Ej: Golden Retriever, Mestizo"
                                            value={form.breed}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label
                                            className="form-label fw-semibold"
                                            style={{ fontSize: "0.88rem" }}
                                        >
                                            Info médica / notas
                                        </label>
                                        <textarea
                                            name="clinicalInfo"
                                            className="form-control"
                                            rows={3}
                                            placeholder="Ej: Vacunas al día, alérgica a la penicilina, contacto de emergencia..."
                                            value={form.clinicalInfo}
                                            onChange={handleChange}
                                            style={{ ...inputStyle, resize: "none" }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-orange w-100 text-center"
                                        disabled={loading}
                                        style={{
                                            fontSize: "1rem",
                                            padding: "0.85rem",
                                            borderRadius: 14,
                                            border: "none",
                                            cursor: loading ? "not-allowed" : "pointer",
                                            opacity: loading ? 0.7 : 1,
                                        }}
                                    >
                                        {loading
                                            ? "Creando tu cuenta..."
                                            : "Crear cuenta y continuar"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
