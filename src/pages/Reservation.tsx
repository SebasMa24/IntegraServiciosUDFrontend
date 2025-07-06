import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid, getToken } from "../services/auth";
import OperationsManager from "../components/OperationsManager";
import SpaceOperationsManager from "../components/spaceOperationsManager";

const Reservation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hardware' | 'spaces'>('hardware');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token || !isTokenValid(token)) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h1 className="text-primary mb-4">Gestión de Reservas</h1>
      <p className="lead mb-4">
        Gestiona tus reservas de hardware y espacios desde un solo lugar.
      </p>
      
      {/* Navegación por pestañas */}
      <ul className="nav nav-tabs mb-4" id="reservationTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'hardware' ? 'active' : ''}`}
            id="hardware-tab"
            type="button"
            role="tab"
            aria-controls="hardware"
            aria-selected={activeTab === 'hardware'}
            onClick={() => setActiveTab('hardware')}
          >
            <i className="fas fa-microchip me-2"></i>
            Reservas de Hardware
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'spaces' ? 'active' : ''}`}
            id="spaces-tab"
            type="button"
            role="tab"
            aria-controls="spaces"
            aria-selected={activeTab === 'spaces'}
            onClick={() => setActiveTab('spaces')}
          >
            <i className="fas fa-building me-2"></i>
            Reservas de Espacios
          </button>
        </li>
      </ul>

      {/* Contenido de las pestañas */}
      <div className="tab-content" id="reservationTabsContent">
        {/* Pestaña de Hardware */}
        <div
          className={`tab-pane fade ${activeTab === 'hardware' ? 'show active' : ''}`}
          id="hardware"
          role="tabpanel"
          aria-labelledby="hardware-tab"
        >
          <div className="mb-3">
            <h3 className="h5 text-secondary">Hardware y Equipos</h3>
            <p className="text-muted">
              Administra las reservas de computadoras, proyectores, equipos de audio y otros dispositivos.
            </p>
          </div>
          <OperationsManager />
        </div>

        {/* Pestaña de Espacios */}
        <div
          className={`tab-pane fade ${activeTab === 'spaces' ? 'show active' : ''}`}
          id="spaces"
          role="tabpanel"
          aria-labelledby="spaces-tab"
        >
          <div className="mb-3">
            <h3 className="h5 text-secondary">Espacios y Salas</h3>
            <p className="text-muted">
              Administra las reservas de salas de reuniones, auditorios, laboratorios y otros espacios.
            </p>
          </div>
          <SpaceOperationsManager />
        </div>
      </div>
    </div>
  );
};

export default Reservation;
