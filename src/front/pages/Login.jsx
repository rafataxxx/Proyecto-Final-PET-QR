import { Link } from "react-router-dom";
import heroImg from "../public/hero.png";

function Login() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>

      {/* Left panel — dark + image */}
      <div
        className="d-none d-lg-flex flex-column justify-content-between p-5"
        style={{
          width: "55%",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Brand */}
        <Link to="/" className="text-decoration-none" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
          Pet<span style={{ color: "#ff6b35" }}>QR</span>
        </Link>

        {/* Center image */}
        <div className="text-center px-4">
          <img
            src={heroImg}
            alt="Mascotas"
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 24,
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}
          />
          <h2 className="mt-4 fw-bold text-white" style={{ fontSize: "1.6rem" }}>
            Tu mascota siempre<br />
            <span style={{ color: "#ff6b35" }}>identificada y segura.</span>
          </h2>
        </div>

        {/* Bottom tagline */}
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
          © 2025 PetQR — Tecnología QR para mascotas
        </p>
      </div>

      {/* Right panel — form */}
      <div
        className="d-flex flex-column justify-content-center align-items-center p-4 p-md-5"
        style={{ flex: 1, background: "#f5f5f7" }}
      >
        {/* Mobile brand */}
        <Link to="/" className="d-lg-none text-decoration-none mb-4" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111" }}>
          Pet<span style={{ color: "#ff6b35" }}>QR</span>
        </Link>

        <div
          className="w-100 fade-in"
          style={{ maxWidth: 400 }}
        >
          <h1 className="fw-bold mb-1" style={{ fontSize: "2rem", letterSpacing: "-0.5px" }}>
            Bienvenido de vuelta
          </h1>
          <p className="text-secondary mb-4">Ingresa tus datos para continuar</p>

          <form>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                Correo electrónico
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="tu@correo.com"
                style={{ borderRadius: 12, border: "1.5px solid #e0e0e0", background: "#fff" }}
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
                style={{ borderRadius: 12, border: "1.5px solid #e0e0e0", background: "#fff" }}
              />
            </div>

            <button
              type="submit"
              className="btn-orange w-100 text-center"
              style={{ fontSize: "1rem", padding: "0.85rem", borderRadius: 14, border: "none", cursor: "pointer" }}
            >
              Iniciar sesión
            </button>
          </form>

          <p className="text-center mt-4 text-secondary" style={{ fontSize: "0.9rem" }}>
            ¿No tienes una cuenta?{" "}
            <Link to="/register" style={{ color: "#ff6b35", fontWeight: 600, textDecoration: "none" }}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;
