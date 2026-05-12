import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          PetQR
        </Link>

        <div className="d-flex gap-3 align-items-center">
          <Link className="nav-link" to="/">
            Inicio
          </Link>

          <Link className="nav-link" to="/mascotas">
            Mascotas
          </Link>

          <Link className="btn btn-dark" to="/login">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
