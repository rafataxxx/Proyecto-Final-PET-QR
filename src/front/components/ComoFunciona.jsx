import { useEffect, useRef } from "react";

const steps = [
  {
    num: "Paso 01",
    icon: "🐾",
    title: "Regístrate",
    description: "Crea una cuenta y agrega la información de tu mascota en minutos.",
  },
  {
    num: "Paso 02",
    icon: "📱",
    title: "Genera el QR",
    description: "Obtén un código QR único vinculado al perfil público de tu mascota.",
  },
  {
    num: "Paso 03",
    icon: "🔍",
    title: "Escanea e identifica",
    description: "Cualquier persona escanea el QR para ver el perfil y contactarte al instante.",
  },
];

function ComoFunciona() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="como-section" ref={sectionRef}>
      <div className="container">

        <div className="text-center mb-5 reveal">
          <span className="section-badge">Simple y rápido</span>
          <h2 className="fw-bold mt-3" style={{ fontSize: "2.25rem", letterSpacing: "-0.5px" }}>
            Cómo funciona
          </h2>
          <p className="text-secondary mt-2" style={{ maxWidth: 480, margin: "0.5rem auto 0" }}>
            En tres pasos tu mascota estará protegida y localizable.
          </p>
        </div>

        <div className="row g-4">
          {steps.map((step, i) => (
            <div
              className="col-md-4 reveal"
              key={i}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="step-card">
                <div className="step-icon-wrap">{step.icon}</div>
                <div className="step-num">{step.num}</div>
                <h4 className="fw-bold mb-2">{step.title}</h4>
                <p className="text-secondary mb-0" style={{ lineHeight: 1.7 }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ComoFunciona;
