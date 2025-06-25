import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid, getToken } from "../../services/auth";
import HardwareHistoryTab from "./components/HardwareHistoryTab";
import SpaceHistoryTab from "./components/SpaceHistoryTab";

const Operation: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'hardware' | 'spaces'>('hardware');

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
        
        {/* Tab Navigation */}
        <ul className="nav nav-tabs mb-3" id="reservationTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeTab === 'hardware' ? 'active' : ''}`}
              onClick={() => setActiveTab('hardware')}
              type="button"
            >
              Hardware Reservado
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeTab === 'spaces' ? 'active' : ''}`}
              onClick={() => setActiveTab('spaces')}
              type="button"
            >
              Espacios Reservados
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content" id="reservationTabsContent">
          {activeTab === 'hardware' && <HardwareHistoryTab />}
          {activeTab === 'spaces' && <SpaceHistoryTab />}
        </div>
      </div>
    );
  };

export default Operation;
