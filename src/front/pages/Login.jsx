function Login() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 shadow-sm p-4">
            <h1 className="fw-bold text-center mb-4">Iniciar Sesión</h1>

            <form>
              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Ingresa tu correo"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Contraseña</label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                />
              </div>

              <button type="submit" className="btn btn-dark w-100">
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
