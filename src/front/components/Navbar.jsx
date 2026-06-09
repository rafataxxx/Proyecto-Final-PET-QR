import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ onOpenModal }) {
    const [scrolled, setScrolled] = useState(false);
    const { token, logout } = useAuth();

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
                    <a className="nav-link-custom" href="#inicio">Inicio</a>
                    <a className="nav-link-custom" href="#como-funciona">Cómo funciona</a>
                    <Link className="nav-link-custom" to="/mascotas">Mascotas</Link>
                    {token ? (
                        <div className="d-flex gap-2 align-items-center">
                            <Link className="nav-btn" to="/dashboard">Mi dashboard</Link>
                            <button
                                className="nav-btn"
                                type="button"
                                onClick={logout}
                                style={{ opacity: 0.7 }}
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <button
                            className="nav-btn"
                            type="button"
                            onClick={() => onOpenModal?.("login")}
                        >
                            Iniciar sesión
                        </button>
                    )}
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
