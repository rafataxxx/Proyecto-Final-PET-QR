import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ComoFunciona from "../components/ComoFunciona";
import AuthModal from "../components/AuthModal";

function Footer() {
    return (
        <footer className="footer-strip">
            <div className="container">
                <p className="mb-1 fw-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Pet<span style={{ color: "#ff6b35" }}>QR</span> — Identificación inteligente para mascotas
                </p>
                <p className="mb-0">
                    © 2025 Desarrollado por el equipo PetQR · 4Geeks Academy
                </p>
            </div>
        </footer>
    );
}

function LandingPage() {
    const [modal, setModal] = useState({ show: false, tab: "login" });

    const openModal = (tab = "login") => setModal({ show: true, tab });
    const closeModal = () => setModal({ show: false, tab: "login" });

    return (
        <>
            <Navbar onOpenModal={openModal} />
            <Hero onOpenModal={openModal} />
            <ComoFunciona />
            <Footer />
            <AuthModal
                show={modal.show}
                initialTab={modal.tab}
                onClose={closeModal}
            />
        </>
    );
}

export default LandingPage;
