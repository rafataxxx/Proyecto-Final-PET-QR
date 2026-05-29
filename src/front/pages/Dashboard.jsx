import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

// ── Formulario reutilizable (crear / editar) ────────────────────────────────
function PetForm({ initial = {}, loading, error, onSubmit, submitLabel }) {
    const fileRef = useRef(null);

    const [form, setForm] = useState({
        name: initial.name || "",
        breed: initial.breed || "",
        species: initial.species || "",
        color: initial.color || "",
        sex: initial.sex || "",
        age: initial.age || "",
        contact: initial.contact || "",
        clinical_info: initial.clinical_info || "",
        photo: null,
        photoPreview: initial.photo_url || null,
    });

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm((p) => ({
            ...p,
            photo: file,
            photoPreview: URL.createObjectURL(file),
        }));
    };

    const inputStyle = {
        borderRadius: 12,
        border: "1.5px solid #e0e0e0",
        background: "#fff",
        fontSize: "0.95rem",
    };

    return (
        <form onSubmit={(e) => onSubmit(e, form)}>

            {/* FOTO (IGUAL) */}
            <div className="text-center mb-4">
                <div
                    onClick={() => fileRef.current.click()}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: form.photoPreview ? "transparent" : "#f5f5f7",
                        border: `2.5px dashed ${form.photoPreview ? "#ff6b35" : "#ddd"}`,
                        cursor: "pointer",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                    }}
                >
                    {form.photoPreview ? (
                        <img
                            src={form.photoPreview}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            alt="preview"
                        />
                    ) : (
                        <span style={{ fontSize: "2rem", color: "#ccc" }}>📷</span>
                    )}
                </div>

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhoto}
                />
            </div>

            {/* ERROR */}
            {error && (
                <div style={{
                    background: "#fff0ee",
                    color: "#c0392b",
                    borderRadius: 10,
                    padding: "0.65rem 1rem",
                    fontSize: "0.88rem",
                    marginBottom: "1rem"
                }}>
                    {error}
                </div>
            )}

            {/* ───── CAMPOS (MISMO ESTILO) ───── */}

            <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Nombre <span style={{ color: "#ff6b35" }}>*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    style={inputStyle}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Especie
                </label>
                <input
                    type="text"
                    name="species"
                    value={form.species}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    style={inputStyle}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Raza
                </label>
                <input
                    type="text"
                    name="breed"
                    value={form.breed}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    style={inputStyle}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Color
                </label>
                <input
                    type="text"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    style={inputStyle}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Sexo
                </label>
                <input
                    type="text"
                    name="sex"
                    value={form.sex}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    style={inputStyle}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Edad
                </label>
                <input
                    type="text"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    style={inputStyle}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Contacto
                </label>
                <input
                    type="text"
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    style={inputStyle}
                />
            </div>

            <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Info médica / notas
                </label>
                <textarea
                    name="clinical_info"
                    value={form.clinical_info}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                    style={{ ...inputStyle, resize: "none" }}
                />
            </div>

            {/* BOTÓN (IGUAL) */}
            <button
                type="submit"
                disabled={loading}
                style={{
                    width: "100%",
                    background: "#ff6b35",
                    color: "#fff",
                    border: "none",
                    borderRadius: 14,
                    padding: "0.85rem",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                }}
            >
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
    const { token, logout, apiFetch } = useAuth();
    const { show: showToast, ToastEl } = useToast();
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
        apiFetch("/api/my_pets")
            .then((r) => r && r.json())
            .then((data) => { if (data) setPets(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    // ── Subir foto helper ───────────────────────────────────────────────────
    const uploadPhoto = async (file) => {
        const fd = new FormData();
        fd.append("image", file);
        const res = await apiFetch("/api/upload_image", { method: "POST", body: fd });
        if (!res) throw new Error("Sesión expirada");
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

            const res = await apiFetch("/api/pets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, breed: form.breed, species: form.species, color: form.color, sex: form.sex, age: form.age, contact: form.contact, clinical_info: form.clinical_info, photo_url }),
            });
            if (!res) return;
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Error al crear");
            setPets((p) => [...p, data]);
            setShowAdd(false);
            showToast(`¡${data.name} agregado correctamente! 🐾`);
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

            const res = await apiFetch(`/api/pets/${editPet.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, breed: form.breed, species: form.species, color: form.color, sex: form.sex, age: form.age, contact: form.contact, clinical_info: form.clinical_info, photo_url }),
            });
            if (!res) return;
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Error al editar");
            setPets((p) => p.map((pet) => pet.id === editPet.id ? data : pet));
            setEditPet(null);
            showToast("Cambios guardados correctamente ✅");
        } catch (err) { setFormError(err.message); }
        finally { setFormLoading(false); }
    };

    // ── Eliminar mascota ────────────────────────────────────────────────────
    const handleDelete = async () => {
        setDeleteLoading(true);
        const petName = deletePet.name;
        try {
            const res = await apiFetch(`/api/pets/${deletePet.id}`, { method: "DELETE" });
            if (!res) return;
            if (!res.ok) throw new Error("Error al eliminar");
            setPets((p) => p.filter((pet) => pet.id !== deletePet.id));
            setDeletePet(null);
            showToast(`${petName} eliminado`, "error");
        } catch (err) { showToast(err.message, "error"); }
        finally { setDeleteLoading(false); }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f7" }}>

            {/* Navbar */}
            <nav style={{ background: "#fff", boxShadow: "0 2px 24px rgba(0,0,0,0.07)", padding: "0.85rem 0", position: "sticky", top: 0, zIndex: 100 }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <Link to="/" className="text-decoration-none"
                        style={{ fontSize: "1.4rem", fontWeight: 900, color: "#111", letterSpacing: "-0.5px" }}>
                        Pet<span style={{ color: "#ff6b35" }}>QR</span>
                    </Link>
                    <div className="d-flex align-items-center gap-3">
                        <Link to="/mascotas" style={{ color: "#666", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>
                            Galería
                        </Link>
                        <button onClick={logout}
                            style={{ background: "#111", color: "#fff", border: "none", borderRadius: 10, padding: "0.45rem 1.2rem", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </nav>

            {/* Banner superior */}
            <div style={{
                background: "linear-gradient(135deg, #111 0%, #1c1c1c 100%)",
                padding: "3rem 0 2.5rem",
            }}>
                <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", margin: 0, marginBottom: "0.3rem", letterSpacing: "0.5px" }}>
                            Bienvenido de vuelta 👋
                        </p>
                        <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.5px", margin: 0 }}>
                            Mis <span style={{ color: "#ff6b35" }}>mascotas</span>
                        </h1>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", margin: "0.4rem 0 0" }}>
                            {loading ? "Cargando..." : pets.length === 0
                                ? "Aún no tienes mascotas registradas"
                                : `${pets.length} mascota${pets.length !== 1 ? "s" : ""} registrada${pets.length !== 1 ? "s" : ""}`}
                        </p>
                    </div>
                    <button onClick={() => { setFormError(null); setShowAdd(true); }}
                        style={{
                            background: "#ff6b35", color: "#fff", border: "none", borderRadius: 14,
                            padding: "0.75rem 1.6rem", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                            boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
                            transition: "transform 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        + Agregar mascota
                    </button>
                </div>
            </div>

            <div className="container py-5">

                {/* Loading */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: "#ff6b35" }} role="status" />
                    </div>
                )}

                {/* Empty state */}
                {!loading && pets.length === 0 && (
                    <div className="text-center py-5">
                        <div style={{
                            width: 100, height: 100, borderRadius: "50%",
                            background: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 1.5rem", fontSize: "2.8rem",
                        }}>🐾</div>
                        <h4 style={{ fontWeight: 800, color: "#222", marginBottom: "0.5rem" }}>Aún no tienes mascotas</h4>
                        <p style={{ color: "#999", marginBottom: "2rem", maxWidth: 340, margin: "0 auto 2rem" }}>
                            Registra tu primera mascota, sube su foto y genera su código QR único.
                        </p>
                        <button onClick={() => { setFormError(null); setShowAdd(true); }}
                            style={{
                                background: "#ff6b35", color: "#fff", border: "none", borderRadius: 14,
                                padding: "0.85rem 2.2rem", fontWeight: 700, cursor: "pointer", fontSize: "1rem",
                                boxShadow: "0 4px 16px rgba(255,107,53,0.35)",
                            }}>
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
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    display: "flex", flexDirection: "column", height: "100%",
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.13)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)"; }}
                                >
                                    {/* Imagen con overlay */}
                                    <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                                        <img
                                            src={pet.photo_url || "https://placehold.co/300x220?text=🐾"}
                                            alt={pet.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        {pet.species && (
                                            <span style={{
                                                position: "absolute", top: 10, left: 10,
                                                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                                                color: "#fff", fontSize: "0.72rem", fontWeight: 600,
                                                padding: "3px 10px", borderRadius: 999,
                                            }}>
                                                {pet.species}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: "1rem 1.2rem 0.6rem", flex: 1 }}>
                                        <h5 style={{ fontWeight: 800, margin: 0, marginBottom: "0.25rem", fontSize: "1.05rem" }}>
                                            {pet.name}
                                        </h5>
                                        <div className="d-flex flex-wrap gap-1">
                                            {pet.breed && (
                                                <span style={{ background: "#f5f5f7", color: "#666", fontSize: "0.75rem", padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>
                                                    {pet.breed}
                                                </span>
                                            )}
                                            {pet.sex && (
                                                <span style={{ background: "#f5f5f7", color: "#666", fontSize: "0.75rem", padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>
                                                    {pet.sex}
                                                </span>
                                            )}
                                            {pet.age && (
                                                <span style={{ background: "#f5f5f7", color: "#666", fontSize: "0.75rem", padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>
                                                    {pet.age}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div style={{ padding: "0.6rem 1rem 1rem", display: "flex", gap: "0.5rem" }}>
                                        <button onClick={() => { setFormError(null); setEditPet(pet); }}
                                            style={{ flex: 1, background: "#f5f5f7", border: "none", borderRadius: 10, padding: "0.5rem", fontSize: "0.82rem", fontWeight: 600, color: "#333", cursor: "pointer" }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#eaeaea"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "#f5f5f7"}>
                                            ✏️ Editar
                                        </button>
                                        <button onClick={() => setDeletePet(pet)}
                                            style={{ flex: 1, background: "#fff0ee", border: "none", borderRadius: 10, padding: "0.5rem", fontSize: "0.82rem", fontWeight: 600, color: "#e74c3c", cursor: "pointer" }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#ffddd9"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "#fff0ee"}>
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

            {ToastEl}
        </div>
    );
}

export default Dashboard;
