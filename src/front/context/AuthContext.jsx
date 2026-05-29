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
        window.location.replace("/");
    };

    return (
        <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export function PrivateRoute({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/" replace />;
}

export function AdminRoute({ children }) {
    const { token, isAdmin } = useAuth();
    if (!token) return <Navigate to="/" replace />;
    if (!isAdmin) return <Navigate to="/dashboard" replace />;
    return children;
}
