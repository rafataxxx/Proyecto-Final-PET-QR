import { createContext, useContext, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("is_admin") === "true");

    const login = (newToken, adminFlag = false) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("is_admin", adminFlag ? "true" : "false");
        setToken(newToken);
        setIsAdmin(adminFlag);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("is_admin");
        setToken(null);
        setIsAdmin(false);
        window.location.replace("/login");
    };

    // Fetch con detección automática de token expirado (401)
    const apiFetch = async (url, options = {}) => {
        const res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        if (res.status === 401) {
            logout();
            return null;
        }
        return res;
    };

    return (
        <AuthContext.Provider value={{ token, isAdmin, login, logout, apiFetch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export function PrivateRoute({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
    const { token, isAdmin } = useAuth();
    if (!token) return <Navigate to="/admin/login" replace />;
    if (!isAdmin) return <Navigate to="/dashboard" replace />;
    return children;
}
