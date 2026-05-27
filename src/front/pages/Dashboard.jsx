import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Formulario reutilizable (crear / editar) ────────────────────────────────
function PetForm({ initial = {}, loading, error, onSubmit, submitLabel }) {
    const fileRef = useRef(null);
    const [form, setForm] = useState({
        name: initial.name || "",
        breed: initial.breed || "",
        clinical_info: initial.clinical_info || "",
        photo: null,
        photoPreview: initial.photo_url || null,
    });

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm((p) => ({ ...p, photo: file, photoPreview: URL.createObjectURL(file) }));
    };

    const inputStyle = { borderRadius: 12, border: "1.5px solid #e0e0e0", background: "#fff", fontSize: "0.95rem" };

    return (
        <form onSubmit={(e) => onSubmit(e, form)}>
            {/* Foto */}
            <div className="text-center mb-4">
                <div onClick={() => fileRef.current.click()}
                    style={{
                        width: 100, height: 100, borderRadius: "50%",
                        background: form.photoPreview ? "transparent" : "#f5f5f7",
                        border: `2.5px dashed ${form.photoPreview ? "#ff6b35" : "#ddd"}`,
                        cursor: "pointer", overflow: "hidden",
                        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
                    }}>
                    {form.photoPreview
                        ? <img src={form.photoPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="preview" />
                        : <span style={{ fontSize: "2rem", color: "#ccc" }}>📷</span>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
                <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.5rem", cursor: "pointer" }}
                    onClick={() => fileRef.current.click()}>
                    {form.photoPreview ? "Cambiar foto" : "Agregar foto"}
                </p>
            </div>

            {error && (
                <div style={{ background: "#fff0ee", color: "#c0392b", borderRadius: 10, padding: "0.65rem 1rem", fontSize: "0.88rem", marginBottom: "1rem" }}>
                    {error}
                </div>
            )}

            <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Nombre <span style={{ color: "#ff6b35" }}>*</span>
                </label>
                <input type="text" name="name" className="form-control form-control-lg"
                    placeholder="Ej: Luna, Max, Firulais"
                    value={form.name} onChange={handleChange} style={inputStyle} required />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>Raza</label>
                <input type="text" name="breed" className="form-control form-control-lg"
                    placeholder="Ej: Golden Retriever, Mestizo"
                    value={form.breed} onChange={handleChange} style={inputStyle} />
            </div>

            <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>Info médica / notas</label>
                <textarea name="clinical_info" className="form-control" rows={3}
                    placeholder="Vacunas, alergias, contacto de emergencia..."
                    value={form.clinical_info} onChange={handleChange}
                    style={{ ...inputStyle, resize: "none" }} />
            </div>

            <button type="submit" disabled={loading}
                style={{
                    width: "100%", background: "#ff6b35", color: "#fff",
                    border: "none", borderRadius: 14, padding: "0.85rem",
                    fontWeight: 700, fontSize: "1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                }}>
                {loading ? "Guardando..." : submitLabel}
            </button>
        </form>
    );
}

// ── Modal genérico ──────────────────────────────────────────────────────────
function Modal({ show, title, onClose, children }) {
    if (!show) return null;
    return (
        <>
            <div onClick={onClose}
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 1040 }} />
            <div style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                <div style={{
                    background: "#fff", borderRadius: 24, padding: "2rem",
                    width: "100%", maxWidth: 460,
                    boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
                    animation: "modalIn 0.25s ease",
                    maxHeight: "90vh", overflowY: "auto",
                }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 style={{ fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>{title}</h4>
                        <button onClick={onClose}
                            style={{
                                background: "#f5f5f7", border: "none", borderRadius: "50%",
                                width: 34, height: 34, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: "#555",
                            }}>✕</button>
                    </div>
                    {children}
                </div>
            </div>
        </>
    );
}

// ── Dashboard principal ─────────────────────────────────────────────────────
function Dashboard() {
    const { token, logout } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modales
    const [showAdd, setShowAdd] = useState(false);
    const [editPet, setEditPet] = useState(null);      // pet a editar
    const [deletePet, setDeletePet] = useState(null);  // pet a eliminar

    // Estados de operaciones
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetch("/api/my_pets", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => { setPets(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    // ── Subir foto helper ───────────────────────────────────────────────────
    const uploadPhoto = async (file) => {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch("/api/upload_image", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error("Error al subir imagen: " + (data.msg || res.status));
        return data.image_url;
    };

    // ── Crear mascota ───────────────────────────────────────────────────────
    const handleCreate = async (e, form) => {
        e.preventDefault();
        if (!form.name) return setFormError("El nombre es obligatorio");
        setFormLoading(true); setFormError(null);
        try {
            let photo_url = null;
            if (form.photo) photo_url = await uploadPhoto(form.photo);

            const res = await fetch("/api/pets", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: form.name, breed: form.breed, clinical_info: form.clinical_info, photo_url }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Error al crear");
            setPets((p) => [...p, data]);
            setShowAdd(false);
        } catch (err) { setFormError(err.message); }
        finally { setFormLoading(false); }
    };

    // ── Editar mascota ──────────────────────────────────────────────────────
    const handleEdit = async (e, form) => {
        e.preventDefault();
        if (!form.name) return setFormError("El nombre es obligatorio");
        setFormLoading(true); setFormError(null);
        try {
            let photo_url = editPet.photo_url;
            if (form.photo) photo_url = await uploadPhoto(form.photo);

            const res = await fetch(`/api/pets/${editPet.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: form.name, breed: form.breed, clinical_info: form.clinical_info, photo_url }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Error al editar");
            setPets((p) => p.map((pet) => pet.id === editPet.id ? data : pet));
            setEditPet(null);
        } catch (err) { setFormError(err.message); }
        finally { setFormLoading(false); }
    };

    // ── Eliminar mascota ────────────────────────────────────────────────────
    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/pets/${deletePet.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al eliminar");
            setPets((p) => p.filter((pet) => pet.id !== deletePet.id));
            setDeletePet(null);
        } catch (err) { alert(err.message); }
        finally { setDeleteLoading(false); }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f7" }}>

            {/* Navbar */}
            <nav style={{ background: "#fff", boxShadow: "0 2px 24px rgba(0,0,0,0.07)", padding: "0.75rem 0", position: "sticky", top: 0, zIndex: 100 }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <Link to="/" className="text-decoration-none"
                        style={{ fontSize: "1.4rem", fontWeight: 900, color: "#111", letterSpacing: "-0.5px" }}>
                        Pet<span style={{ color: "#ff6b35" }}>QR</span>
                    </Link>
                    <button onClick={logout}
                        style={{ background: "none", border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "0.4rem 1.1rem", fontWeight: 600, fontSize: "0.88rem", color: "#555", cursor: "pointer" }}>
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <div className="container py-5">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 style={{ fontWeight: 800, fontSize: "2rem", letterSpacing: "-0.5px", marginBottom: "0.2rem" }}>Mis mascotas</h2>
                        <p style={{ color: "#999", margin: 0, fontSize: "0.95rem" }}>
                            {loading ? "Cargando..." : pets.length === 0 ? "Aún no tienes mascotas registradas"
                                : `${pets.length} mascota${pets.length !== 1 ? "s" : ""} registrada${pets.length !== 1 ? "s" : ""}`}
                        </p>
                    </div>
                    <button onClick={() => { setFormError(null); setShowAdd(true); }}
                        style={{
                            background: "#ff6b35", color: "#fff", border: "none", borderRadius: 14,
                            padding: "0.65rem 1.4rem", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                            boxShadow: "0 4px 16px rgba(255,107,53,0.35)",
                        }}>
                        + Agregar mascota
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: "#ff6b35" }} role="status" />
                    </div>
                )}

                {/* Empty state */}
                {!loading && pets.length === 0 && (
                    <div className="text-center py-5">
                        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🐾</div>
                        <h5 style={{ fontWeight: 700, color: "#333" }}>Aún no tienes mascotas</h5>
                        <p style={{ color: "#999", marginBottom: "1.5rem" }}>Registra tu primera mascota y genera su código QR</p>
                        <button onClick={() => { setFormError(null); setShowAdd(true); }}
                            style={{ background: "#ff6b35", color: "#fff", border: "none", borderRadius: 14, padding: "0.75rem 2rem", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
                            + Registrar primera mascota
                        </button>
                    </div>
                )}

                {/* Grid */}
                {!loading && pets.length > 0 && (
                    <div className="row g-4">
                        {pets.map((pet) => (
                            <div className="col-sm-6 col-md-4 col-lg-3" key={pet.id}>
                                <div style={{
                                    background: "#fff", borderRadius: 20, overflow: "hidden",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    display: "flex", flexDirection: "column",
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"; }}
                                >
                                    <img
                                        src={pet.photo_url || "https://placehold.co/300x220?text=🐾"}
                                        alt={pet.name}
                                        style={{ width: "100%", height: 200, objectFit: "cover" }}
                                    />
                                    <div style={{ padding: "1rem 1.1rem 0.8rem" }}>
                                        <h5 style={{ fontWeight: 800, margin: 0, marginBottom: "0.2rem" }}>{pet.name}</h5>
                                        {pet.breed && <p style={{ color: "#999", fontSize: "0.85rem", margin: 0 }}>{pet.breed}</p>}
                                    </div>

                                    {/* Acciones */}
                                    <div style={{ padding: "0 1.1rem 1rem", display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                                        <button
                                            onClick={() => { setFormError(null); setEditPet(pet); }}
                                            style={{
                                                flex: 1, background: "#f5f5f7", border: "none",
                                                borderRadius: 10, padding: "0.45rem",
                                                fontSize: "0.82rem", fontWeight: 600, color: "#333", cursor: "pointer",
                                                transition: "background 0.15s",
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#e8e8e8"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "#f5f5f7"}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => setDeletePet(pet)}
                                            style={{
                                                flex: 1, background: "#fff0ee", border: "none",
                                                borderRadius: 10, padding: "0.45rem",
                                                fontSize: "0.82rem", fontWeight: 600, color: "#e74c3c", cursor: "pointer",
                                                transition: "background 0.15s",
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#ffddd9"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "#fff0ee"}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal — Agregar */}
            <Modal show={showAdd} title="Nueva mascota" onClose={() => setShowAdd(false)}>
                <PetForm loading={formLoading} error={formError} onSubmit={handleCreate} submitLabel="Agregar mascota" />
            </Modal>

            {/* Modal — Editar */}
            <Modal show={!!editPet} title="Editar mascota" onClose={() => setEditPet(null)}>
                {editPet && (
                    <PetForm initial={editPet} loading={formLoading} error={formError} onSubmit={handleEdit} submitLabel="Guardar cambios" />
                )}
            </Modal>

            {/* Modal — Confirmar eliminar */}
            <Modal show={!!deletePet} title="Eliminar mascota" onClose={() => setDeletePet(null)}>
                {deletePet && (
                    <div className="text-center">
                        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🗑️</div>
                        <p style={{ fontSize: "1rem", color: "#333", marginBottom: "0.5rem" }}>
                            ¿Seguro que quieres eliminar a <strong>{deletePet.name}</strong>?
                        </p>
                        <p style={{ fontSize: "0.85rem", color: "#999", marginBottom: "2rem" }}>
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="d-flex gap-3">
                            <button onClick={() => setDeletePet(null)}
                                style={{ flex: 1, background: "#f5f5f7", border: "none", borderRadius: 14, padding: "0.75rem", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem" }}>
                                Cancelar
                            </button>
                            <button onClick={handleDelete} disabled={deleteLoading}
                                style={{ flex: 1, background: "#e74c3c", color: "#fff", border: "none", borderRadius: 14, padding: "0.75rem", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem", opacity: deleteLoading ? 0.7 : 1 }}>
                                {deleteLoading ? "Eliminando..." : "Sí, eliminar"}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default Dashboard;
