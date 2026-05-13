import { Link } from "react-router-dom";
import heroImg from "../public/hero.png";

function Hero() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center g-5">

          {/* Text side */}
          <div className="col-lg-6">
            <span className="hero-badge fade-in">Tecnología QR para mascotas</span>

            <h1 className="hero-title mb-4 fade-in fade-in-1">
              Identifica a tu mascota<br />
              con un <span className="accent">código QR</span>
            </h1>

            <p className="hero-subtitle mb-5 fade-in fade-in-2">
              Crea un perfil público para tu mascota. Si se pierde,
              cualquier persona puede escanear el QR y contactarte al instante.
            </p>

            <div className="d-flex gap-3 flex-wrap fade-in fade-in-3">
              <Link to="/register" className="btn-orange btn-lg">
                Registra tu mascota
              </Link>
              <Link to="/login" className="btn-ghost btn-lg">
                Iniciar sesión
              </Link>
            </div>
          </div>

          {/* Image side */}
          <div className="col-lg-6 fade-in fade-in-2">
            <div className="hero-img-wrapper hero-float">
              <img src={heroImg} alt="Mascotas PetQR" />
              <div className="hero-img-overlay" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
