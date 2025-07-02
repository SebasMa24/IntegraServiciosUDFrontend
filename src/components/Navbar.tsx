import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/auth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Creamos el elemento style
    const style = document.createElement('style');
    style.innerHTML = `
      body {
        padding-top: 56px;
      }
      @media (min-width: 992px) {
        body {
          padding-top: 60px;
        }
      }
    `;
    // Lo agregamos al head del documento
    document.head.appendChild(style);

    // Función de limpieza para remover el estilo al desmontar
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
      <Link className="navbar-brand d-flex align-items-center" to="/home">
          <img 
            src={"https://images.seeklogo.com/logo-png/14/3/universidad-distrital-francisco-jose-de-caldas-logo-png_seeklogo-145737.png?v=1955246906122213448"} 
            alt="Logo Universidad Distrital" 
            style={{
              height: '40px',
              marginRight: '10px'
            }}
          />
          IntegraServiciosUD
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav">
            {isLoggedIn() ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/resource">
                    Resource
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/availability">
                    Availability
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/operation">
                    Operation
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
