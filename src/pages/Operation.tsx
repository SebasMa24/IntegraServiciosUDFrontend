// Operation.tsx - Versión combinada con autenticación
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid, getToken } from "../services/auth";
import OperationsManager from "../components/OperationsManager";

const Operation: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    const token = getToken();
    
    if (!token || !isTokenValid(token)) {
      // Si no hay token o el token ha expirado, redirigir al login
      navigate("/login");
    } else {
      // Token válido, usuario autenticado
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Mostrar loading o nada mientras se verifica la autenticación
  if (!isAuthenticated) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Verificando autenticación...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-primary mb-4">Reservas</h1>
      <p className="lead mb-5">
        Gestiona tus reservas de hardware y espacios.
      </p>
      
      {/* Componente de gestión de operaciones - Solo se renderiza si está autenticado */}
      <OperationsManager />
    </div>
  );
};

export default Operation;