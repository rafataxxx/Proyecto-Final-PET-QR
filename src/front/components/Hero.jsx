import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="py-5">
      <div className="container text-center py-5">
        <h1 className="display-3 fw-bold mb-4">
          Identificación inteligente con QR
          <br />
          para tus mascotas
        </h1>

        <p className="lead text-secondary mb-4">
          Crea un perfil público para tu mascota y ayuda a que las personas la
          identifiquen al instante usando tecnología QR.
        </p>
        <Link to="/register">
           <button className="btn btn-dark btn-lg px-4">
          Registra tu mascota
        </button>
        </Link>
     
      </div>
    </section>
  );
}

export default Hero;
