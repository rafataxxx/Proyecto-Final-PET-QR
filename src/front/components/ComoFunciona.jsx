function ComoFunciona() {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center fw-bold mb-5">Cómo funciona</h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <h4>1. Regístrate</h4>

              <p className="text-secondary">
                Crea una cuenta y agrega la información de tu mascota.
              </p>
            </div>
          </div>
          

          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <h4>2. Genera el QR</h4>

              <p className="text-secondary">
                Genera un código QR único vinculado al perfil de tu mascota.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <h4>3. Escanea e identifica</h4>

              <p className="text-secondary">
                Cualquier persona puede escanear el código QR para acceder al
                perfil de tu mascota.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComoFunciona;
