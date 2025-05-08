import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid, getToken } from "../services/auth";

const Operation: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
      const token = getToken();
      
      if (!token || !isTokenValid(token)) {
        // Si no hay token o el token ha expirado, redirigir al login
        navigate("/login");
      }
    }, [navigate]);  
  return (
      <div className="container mt-4">
        <h1 className="text-primary">Reservas</h1>
        <p className="lead">
          Pagina de reservas.
        </p>
      </div>
    );
  };

export default Operation;