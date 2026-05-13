import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`petqr-navbar ${scrolled ? "solid" : "transparent"}`}>
      <div className="container d-flex justify-content-between align-items-center">

        <Link className="nav-brand" to="/">
          Pet<span style={{ color: "#ff6b35" }}>QR</span>
        </Link>

        <div className="d-flex gap-4 align-items-center">
          <Link className="nav-link-custom" to="/">Inicio</Link>
          <Link className="nav-btn" to="/login">Iniciar sesión</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
