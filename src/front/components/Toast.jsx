import { useEffect, useState } from "react";

export function Toast({ message, type = "success", onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 3000);
        return () => clearTimeout(t);
    }, []);

    const colors = {
        success: { bg: "#111", icon: "✅" },
        error:   { bg: "#e74c3c", icon: "⚠️" },
    };

    return (
        <div style={{
            position: "fixed", bottom: "2rem", left: "50%",
            transform: `translateX(-50%) translateY(${visible ? 0 : "120%"})`,
            background: colors[type].bg, color: "#fff",
            padding: "0.75rem 1.5rem", borderRadius: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            fontWeight: 600, fontSize: "0.9rem", zIndex: 9999,
            display: "flex", alignItems: "center", gap: "0.5rem",
            transition: "transform 0.3s ease",
            whiteSpace: "nowrap",
        }}>
            {colors[type].icon} {message}
        </div>
    );
}

export function useToast() {
    const [toast, setToast] = useState(null);
    const show = (message, type = "success") => setToast({ message, type, key: Date.now() });
    const hide = () => setToast(null);
    const ToastEl = toast ? <Toast key={toast.key} message={toast.message} type={toast.type} onClose={hide} /> : null;
    return { show, ToastEl };
}
