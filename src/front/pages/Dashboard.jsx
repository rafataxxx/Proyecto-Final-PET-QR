import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { token, logout } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/my_pets", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar mascotas");
                return res.json();
            })
            .then((data) => {
                setPets(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [token]);

    return (
        <div>
            <nav className="navbar bg-white border-bottom">
                <div className="container d-flex justify-content-between align-items-center">
                    <Link className="navbar-brand fw-bold" to="/">
                        PetQR
                    </Link>
                    <button className="btn btn-outline-dark" onClick={logout}>
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <div className="container py-5">
                <h2 className="fw-bold mb-4">Mis Mascotas</h2>

                {loading && <p className="text-secondary">Cargando...</p>}

                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                {!loading && !error && pets.length === 0 && (
                    <p className="text-secondary">
                        Aún no tienes mascotas registradas. ¡Agrega la primera!
                    </p>
                )}

                {!loading && !error && pets.length > 0 && (
                    <div className="row g-4">
                        {pets.map((pet) => (
                            <div className="col-sm-6 col-md-4 col-lg-3" key={pet.id}>
                                <div className="card border-0 shadow-sm h-100">
                                    <img
                                        src={
                                            pet.photo ||
                                            "https://placehold.co/300x200?text=Sin+foto"
                                        }
                                        className="card-img-top"
                                        alt={pet.name}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <div className="card-body text-center">
                                        <h5 className="card-title fw-bold mb-0">
                                            {pet.name}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Link
                to="/register"
                className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center text-decoration-none"
                style={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem",
                    width: "56px",
                    height: "56px",
                    fontSize: "1.5rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                }}
                title="Agregar nueva mascota"
            >
                +
            </Link>
        </div>
    );
}

export default Dashboard;
