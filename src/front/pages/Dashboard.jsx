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
            console.log(data);

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

                {!loading && pets.length > 0 && (
                    <div
                        className="d-flex flex-column gap-4"
                        style={{
                            maxWidth: "1000px",
                            margin: "0 auto",
                            width: "100%",
                        }}
                    >
                        {pets.map((pet) => (

                            <div
                                key={pet.id}
                                style={{
                                    background: "#ffffff",
                                    borderRadius: "22px",
                                    padding: "20px",
                                    border: "1px solid #ececec",
                                    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "24px",
                                        alignItems: "center",
                                    }}
                                >
                                    {/* FOTO */}
                                    <img
                                        src={
                                            pet.photo_url ||
                                            "https://placehold.co/300x300?text=🐾"
                                        }
                                        alt={pet.name}
                                        style={{
                                            width: "220px",
                                            height: "220px",
                                            objectFit: "cover",
                                            borderRadius: "18px",
                                            flexShrink: 0,
                                        }}
                                    />

                                    {/* DATOS */}
                                    <div
                                        style={{
                                            flex: 1,
                                            minWidth: "250px",
                                        }}
                                    >
                                        <h2
                                            style={{
                                                margin: 0,
                                                marginBottom: "15px",
                                                fontSize: "1.8rem",
                                                fontWeight: "700",
                                                color: "#222",
                                            }}
                                        >
                                            🐾 {pet.name}
                                        </h2>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(180px, 1fr))",
                                                gap: "12px",
                                                color: "#444",
                                            }}
                                        >
                                            <div><strong>Raza:</strong> {pet.breed || "-"}</div>
                                            <div><strong>Especie:</strong> {pet.species || "-"}</div>
                                            <div><strong>Color:</strong> {pet.color || "-"}</div>
                                            <div><strong>Sexo:</strong> {pet.sex || "-"}</div>
                                            <div><strong>Edad:</strong> {pet.age || "-"}</div>
                                            <div><strong>Contacto:</strong> {pet.contact || "-"}</div>
                                        </div>
                                    </div>

                                    {/* QR Y BOTONES */}
                                    <div
                                        style={{
                                            minWidth: "190px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "15px",
                                            padding: "18px",
                                            background: "#fafafa",
                                            borderRadius: "18px",
                                            border: "1px solid #ececec",
                                        }}
                                    >

                                        {pet.qr_code_url && (
                                            <>
                                                <div
                                                    style={{
                                                        fontSize: "0.85rem",
                                                        fontWeight: "600",
                                                        color: "#666",
                                                        letterSpacing: "0.5px",
                                                    }}
                                                >
                                                    CÓDIGO QR
                                                </div>

                                                <img
                                                    src={pet.qr_code_url}
                                                    alt="QR"
                                                    style={{
                                                        width: "185px",
                                                        height: "180px",
                                                        background: "#fff",
                                                        padding: "12px",
                                                        borderRadius: "16px",
                                                        border: "1px solid #e5e7eb",
                                                        boxShadow:
                                                            "0 4px 15px rgba(0,0,0,0.05)",
                                                    }}
                                                />
                                            </>
                                        )}

                                        <div
                                            style={{
                                                display: "flex",
                                                width: "100%",
                                                gap: "10px",
                                            }}
                                        >
                                            <button
                                                onClick={() => {
                                                    setFormError(null);
                                                    setEditPet(pet);
                                                }}
                                                style={{
                                                    flex: 1,
                                                    border: "none",
                                                    background: "#ff6b35",
                                                    color: "#fff",
                                                    padding: "6px 10px",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    fontWeight: "500",
                                                    fontSize: "0.85rem",
                                                    lineHeight: "1",
                                                }}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => setDeletePet(pet)}
                                                style={{
                                                    flex: 1,
                                                    border: "1px solid #d6d6d6",
                                                    background: "#f8f9fa",
                                                    color: "#444",
                                                    padding: "6px 10px",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    fontWeight: "500",
                                                    fontSize: "0.85rem",
                                                    lineHeight: "1",
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
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
