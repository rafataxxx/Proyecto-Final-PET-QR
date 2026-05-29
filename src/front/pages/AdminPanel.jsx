import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Modal editar mascota ────────────────────────────────────────────────────
function EditModal({ pet, token, onClose, onSaved }) {
    const fileRef = useRef(null);
    const [form, setForm] = useState({
        name: pet.name || "",
        breed: pet.breed || "",
        clinical_info: pet.clinical_info || "",
        photo: null,
        photoPreview: pet.photo_url || null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm((p) => ({ ...p, photo: file, photoPreview: URL.createObjectURL(file) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(null);
        try {
            let photo_url = pet.photo_url;
            if (form.photo) {
                const fd = new FormData();
                fd.append("image", form.photo);
                const upRes = await fetch("/api/upload_image", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                });
                const upData = await upRes.json();
                if (!upRes.ok) throw new Error("Error al subir imagen: " + upData.msg);
                photo_url = upData.image_url;
            }

            const res = await fetch(`/api/admin/pets/${pet.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: form.name, breed: form.breed, clinical_info: form.clinical_info, photo_url }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg);
            onSaved(data);
            onClose();
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const inputStyle = { borderRadius: 10, border: "1.5px solid #e0e0e0", background: "#fff", fontSize: "0.9rem" };

    return (
        <>
            <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1040 }} />
            <div style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", width: "100%", maxWidth: 440, boxShadow: "0 24px 80px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto", animation: "modalIn 0.2s ease" }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 style={{ fontWeight: 800, margin: 0 }}>Editar mascota</h5>
                        <button onClick={onClose} style={{ background: "#f5f5f7", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>

                    {error && <div style={{ background: "#fff0ee", color: "#c0392b", borderRadius: 8, padding: "0.6rem 1rem", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="text-center mb-3">
                            <div onClick={() => fileRef.current.click()}
                                style={{ width: 80, height: 80, borderRadius: "50%", background: form.photoPreview ? "transparent" : "#f5f5f7", border: `2px dashed ${form.photoPreview ? "#ff6b35" : "#ddd"}`, cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                                {form.photoPreview
                                    ? <img src={form.photoPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="preview" />
                                    : <span style={{ fontSize: "1.5rem", color: "#ccc" }}>📷</span>}
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
                            <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "0.4rem", cursor: "pointer" }} onClick={() => fileRef.current.click()}>
                                {form.photoPreview ? "Cambiar foto" : "Agregar foto"}
                            </p>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>Nombre *</label>
                            <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>Raza</label>
                            <input type="text" name="breed" className="form-control" value={form.breed} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>Info médica</label>
                            <textarea name="clinical_info" className="form-control" rows={3} value={form.clinical_info} onChange={handleChange} style={{ ...inputStyle, resize: "none" }} />
                        </div>
                        <button type="submit" disabled={loading}
                            style={{ width: "100%", background: "#ff6b35", color: "#fff", border: "none", borderRadius: 12, padding: "0.75rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

// ── Panel Admin ─────────────────────────────────────────────────────────────
function AdminPanel() {
    const { token, logout } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editPet, setEditPet] = useState(null);
    const [deletePet, setDeletePet] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetch("/api/admin/pets", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => { setPets(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/admin/pets/${deletePet.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            setPets((p) => p.filter((pet) => pet.id !== deletePet.id));
            setDeletePet(null);
        } catch { alert("Error al eliminar"); }
        finally { setDeleteLoading(false); }
    };

    const filtered = pets.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.breed || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.owner_email || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f7" }}>

            {/* Navbar admin */}
            <nav style={{ background: "#111", padding: "0.75rem 0", position: "sticky", top: 0, zIndex: 100 }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <Link to="/" className="text-decoration-none"
                            style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
                            Pet<span style={{ color: "#ff6b35" }}>QR</span>
                        </Link>
                        <span style={{ background: "#ff6b35", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                            Admin
                        </span>
                    </div>
                    <button onClick={logout}
                        style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "0.35rem 1rem", color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", cursor: "pointer" }}>
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <div className="container py-5">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                    <div>
                        <h2 style={{ fontWeight: 800, fontSize: "1.8rem", letterSpacing: "-0.5px", margin: 0 }}>
                            Panel de administración
                        </h2>
                        <p style={{ color: "#999", margin: "0.2rem 0 0", fontSize: "0.9rem" }}>
                            {loading ? "Cargando..." : `${pets.length} mascotas registradas en el sistema`}
                        </p>
                    </div>

                    {/* Buscador */}
                    <input
                        type="text"
                        placeholder="Buscar por nombre, raza o dueño..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            border: "1.5px solid #e0e0e0", borderRadius: 12, padding: "0.55rem 1rem",
                            fontSize: "0.9rem", background: "#fff", width: "100%", maxWidth: 300, outline: "none",
                        }}
                    />
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: "#ff6b35" }} role="status" />
                    </div>
                )}

                {/* Tabla */}
                {!loading && (
                    <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                        {filtered.length === 0 ? (
                            <div className="text-center py-5" style={{ color: "#999" }}>
                                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🔍</div>
                                No se encontraron mascotas
                            </div>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                                        {["Foto", "Nombre", "Raza", "Info médica", "Dueño", "Acciones"].map((h) => (
                                            <th key={h} style={{ padding: "1rem 1.2rem", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((pet, i) => (
                                        <tr key={pet.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f5f5f7" : "none", transition: "background 0.15s" }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>

                                            <td style={{ padding: "0.85rem 1.2rem" }}>
                                                <img
                                                    src={pet.photo_url || "https://placehold.co/48x48?text=🐾"}
                                                    alt={pet.name}
                                                    style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", background: "#f5f5f7" }}
                                                />
                                            </td>

                                            <td style={{ padding: "0.85rem 1.2rem" }}>
                                                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{pet.name}</span>
                                            </td>

                                            <td style={{ padding: "0.85rem 1.2rem", color: "#666", fontSize: "0.9rem" }}>
                                                {pet.breed || <span style={{ color: "#ccc" }}>—</span>}
                                            </td>

                                            <td style={{ padding: "0.85rem 1.2rem", color: "#666", fontSize: "0.85rem", maxWidth: 200 }}>
                                                {pet.clinical_info
                                                    ? <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{pet.clinical_info}</span>
                                                    : <span style={{ color: "#ccc" }}>—</span>}
                                            </td>

                                            <td style={{ padding: "0.85rem 1.2rem" }}>
                                                <span style={{ background: "#f5f5f7", borderRadius: 8, padding: "4px 10px", fontSize: "0.82rem", color: "#555", fontWeight: 500 }}>
                                                    {pet.owner_email}
                                                </span>
                                            </td>

                                            <td style={{ padding: "0.85rem 1.2rem" }}>
                                                <div className="d-flex gap-2">
                                                    <button onClick={() => setEditPet(pet)}
                                                        style={{ background: "#f0f0f0", border: "none", borderRadius: 8, padding: "0.4rem 0.85rem", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", color: "#333" }}>
                                                        ✏️ Editar
                                                    </button>
                                                    <button onClick={() => setDeletePet(pet)}
                                                        style={{ background: "#fff0ee", border: "none", borderRadius: 8, padding: "0.4rem 0.85rem", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", color: "#e74c3c" }}>
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* Modal editar */}
            {editPet && (
                <EditModal
                    pet={editPet}
                    token={token}
                    onClose={() => setEditPet(null)}
                    onSaved={(updated) => {
                        setPets((p) => p.map((pet) => pet.id === updated.id ? updated : pet));
                        setEditPet(null);
                    }}
                />
            )}

            {/* Modal confirmar eliminar */}
            {deletePet && (
                <>
                    <div onClick={() => setDeletePet(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1040 }} />
                    <div style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                        <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", width: "100%", maxWidth: 380, boxShadow: "0 24px 80px rgba(0,0,0,0.2)", textAlign: "center", animation: "modalIn 0.2s ease" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🗑️</div>
                            <h5 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>¿Eliminar a {deletePet.name}?</h5>
                            <p style={{ color: "#999", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
                                Dueño: <strong>{deletePet.owner_email}</strong><br />Esta acción no se puede deshacer.
                            </p>
                            <div className="d-flex gap-3">
                                <button onClick={() => setDeletePet(null)}
                                    style={{ flex: 1, background: "#f5f5f7", border: "none", borderRadius: 12, padding: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
                                    Cancelar
                                </button>
                                <button onClick={handleDelete} disabled={deleteLoading}
                                    style={{ flex: 1, background: "#e74c3c", color: "#fff", border: "none", borderRadius: 12, padding: "0.75rem", fontWeight: 700, cursor: "pointer", opacity: deleteLoading ? 0.7 : 1 }}>
                                    {deleteLoading ? "Eliminando..." : "Eliminar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(8px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default AdminPanel;
