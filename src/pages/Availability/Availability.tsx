import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid, getToken } from '../../services/auth';
import AvailableHardwareTab from './components/AvailableHardwareTab'
import AvailableSpaceTab from './components/AvailableSpaceTab';


const Availability: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'hardware' | 'spaces'>('hardware');

  const navigate = useNavigate();
  React.useEffect(() => {
    const token = getToken();
    
    if (!token || !isTokenValid(token)) {
      // If no token or the token has expired, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='container mt-4'>
      <h1 className='text-primary'>Disponibilidad</h1>

      {/* Tab Navigation */}
      <ul className='nav nav-tabs mb-3' id='availabilityTabs' role='tablist'>
        <li className='nav-item' role='presentation'>
          <button
            className={`nav-link ${activeTab === 'hardware' ? 'active' : ''}`}
            onClick={() => setActiveTab('hardware')}
            type='button'
          >
            Hardware
          </button>
        </li>
        <li className='nav-item' role='presentation'>
          <button
            className={`nav-link ${activeTab === 'spaces' ? 'active' : ''}`}
            onClick={() => setActiveTab('spaces')}
            type='button'
          >
            Spaces
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className='tab-content'>
        {activeTab === 'hardware' && <AvailableHardwareTab />}
        {activeTab === 'spaces' && <AvailableSpaceTab />}
      </div>
    </div>
  );
};

export default Availability;
