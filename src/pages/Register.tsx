import React, { useState , useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { isLoggedIn } from '../services/auth';


const Register: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/home');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
    name: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para controlar el modal
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone ? Number(formData.phone) : undefined,
          code: Number(formData.code)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el registro");
      }

      // Guardar el token (si es necesario)
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      
      // Mostrar modal de éxito en lugar de redirigir directamente
      setShowSuccessModal(true);

    } catch (error: any) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/home"); // Redirigir al home cuando se cierra el modal
  };

  return (
    <div className="container mt-5">
      {/* Modal de éxito */}
      <Modal show={showSuccessModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>¡Registro exitoso!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tu cuenta ha sido creada correctamente. Ya puedes hacer uso del sistema.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Registro de Usuario</h2>
              
              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* ... (resto del formulario permanece igual) ... */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Nombre Completo*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="code" className="form-label">
                      Código Universitario
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico*
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña*
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={5}
                  />
                  <div className="form-text">Mínimo 5 caracteres</div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                    />
                    <div className="form-text">Ej: 3123456789</div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="address" className="form-label">
                      Dirección
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registrando...
                      </>
                    ) : (
                      "Registrarse"
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="mb-0">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-decoration-none">
                      Inicia sesión aquí
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

export default Register;