import React, { useState , useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importar Link
import { isLoggedIn } from '../services/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/home');
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(""); // Crear una instancia de navigate

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch("https://usermanagement-82tn.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      // Si la respuesta no es OK, muestra el código de estado y la respuesta
      if (!response.ok) {
        const errorResponse = await response.json(); // Obtenemos el JSON con el error
        throw new Error(errorResponse.message || "Error desconocido");
      }

      const data = await response.json();

      // Guardar el token en el localStorage o sessionStorage
      localStorage.setItem("authToken", data.token);

      // Redirigir a la página principal
      navigate("/"); // Asume que tienes una ruta "/home" en tu React Router
    } catch (error: any) {
      setError(`Error: ${error.message}`);
      console.error("Error de solicitud:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary">
                    Entrar
                  </button>
                </div>

                <div className="text-center">
                  <p className="mb-0">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-decoration-none">
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;