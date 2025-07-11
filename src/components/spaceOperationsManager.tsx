import React, { useState, useEffect } from 'react';
import AvailableSpacesTab from '../pages/Availability/components/AvailableSpaceTab';
import { getRoles, isLoggedIn, getSub } from '../services/auth'; 

// Tipos para TypeScript
interface SpaceReservation {
  id?: string;
  reservationCode?: number; // Para mostrar código de reserva
  building: number;
  resourceCode: number;
  requester: string;
  manager: string;
  start: string;
  end: string;
  handover?: string; //Fecha de entrega
  returnTime?: string; //Fecha de devolución
  conditionRate?: number; //Calificación de condición
  serviceRate?: number; //Calificación de servicio
  status?: string; //Estado de la reserva
}

interface ReturnData {
  conditionRate: number;
  serviceRate: number;
}

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

// Configuración de la API
const API_BASE_URL = 'https://operationmanagement.onrender.com/api/operations/space';

const SpaceOperationsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('availability');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ text: '', type: 'info' });
  const [reservations, setReservations] = useState<SpaceReservation[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userSub, setUserSub] = useState<string>('');

  // Estado para el formulario de nueva reserva de espacio
  const [formData, setFormData] = useState<SpaceReservation>({
    building: 0,
    resourceCode: 0,
    requester: '',
    manager: '',
    start: '',
    end: ''
  });

  // Estado para acciones
  const [reservationId, setReservationId] = useState<string>('');
  const [returnData, setReturnData] = useState<ReturnData>({
    conditionRate: 5,
    serviceRate: 5
  });

  // Verificar roles del usuario
  useEffect(() => {
    if (isLoggedIn()) {
      const roles = getRoles();
      const sub = getSub();
      setUserRoles(roles || []);
      setUserSub(sub || '');
      
      // Auto-llenar el campo requester si es ROLE_USER
      if (roles?.includes('ROLE_USER') && !roles?.includes('ROLE_ADMIN') && sub) {
        setFormData(prevData => ({
          ...prevData,
          requester: sub
        }));
      }
    }
  }, []);

  // Función para verificar si el usuario es admin
  const isAdmin = (): boolean => {
    return userRoles.includes('ROLE_ADMIN');
  };

  // Función para verificar si el usuario tiene acceso (admin o user)
  const hasUserAccess = (): boolean => {
    return userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_USER');
  };

  // Función para verificar si el usuario es solo ROLE_USER (no admin)
  const isOnlyUser = (): boolean => {
    return userRoles.includes('ROLE_USER') && !userRoles.includes('ROLE_ADMIN');
  };

  // Función para validar horarios permitidos (7:00 AM - 6:59 PM)
  const isValidTime = (dateTime: string): boolean => {
    const date = new Date(dateTime);
    const hours = date.getHours();
    return hours >= 7 && hours <= 18;
  };

  // Función para validar que ambas fechas estén en horario permitido
  const validateTimeRange = (start: string, end: string): { valid: boolean; message: string } => {
    if (!start || !end) {
      return { valid: false, message: 'Ambas fechas son requeridas' };
    }

    const startValid = isValidTime(start);
    const endValid = isValidTime(end);

    if (!startValid || !endValid) {
      return { 
        valid: false, 
        message: 'Las reservas solo están permitidas entre las 7:00 AM y las 6:59 PM' 
      };
    }

    return { valid: true, message: '' };
  };

  //Función para obtener el color del badge según el status
  const getStatusBadgeClass = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-primary';
      case 'pending':
        return 'bg-warning';
      case 'completed':
        return 'bg-success';
      case 'past':
        return 'bg-secondary';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-info';
    }
  };

  //Función para obtener el texto del status en español
  const getStatusText = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Activa';
      case 'pending':
        return 'Pendiente';
      case 'completed':
        return 'Completada';
      case 'past':
        return 'Pasada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status || 'Sin estado';
    }
  };

  // Función para mostrar mensajes
  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: 'info' }), 3000);
  };

  // Obtener reservas de espacios
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        const allReservations = Array.isArray(data) ? data : [];
        
        // Filtrar reservas según el rol del usuario
        let filteredReservations = allReservations;
        if (isAdmin()) {
          // Si es admin, filtrar solo las reservas donde el usuario es el gerente
          filteredReservations = allReservations.filter(reservation => 
            reservation.manager === userSub
          );
        } else if (userSub) {
          // Si no es admin, filtrar solo las reservas donde el usuario es el solicitante
          filteredReservations = allReservations.filter(reservation => 
            reservation.requester === userSub
          );
        }
        
        setReservations(filteredReservations);
        showMessage('Reservas de espacios actualizadas', 'success');
      } else {
        showMessage('Error al obtener reservas de espacios', 'error');
      }
    } catch (error) {
      showMessage('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva reserva de espacio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validar horarios antes de enviar
      const timeValidation = validateTimeRange(formData.start, formData.end);
      if (!timeValidation.valid) {
        showMessage(timeValidation.message, 'error');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        building: Number(formData.building),
        resourceCode: Number(formData.resourceCode)
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showMessage('Reserva de espacio creada exitosamente', 'success');
        setFormData({
          building: 0,
          resourceCode: 0,
          requester: isOnlyUser() ? userSub : '', // Mantener el sub si es solo user
          manager: '',
          start: '',
          end: ''
        });
      } else {
        showMessage('Error al crear la reserva de espacio', 'error');
      }
    } catch (error) {
      showMessage('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar reserva de espacio (solo para admin)
  const handleDelete = async (id: string) => {
    if (!isAdmin()) {
      showMessage('No tienes permisos para eliminar reservas', 'error');
      return;
    }

    if (!window.confirm('¿Estás seguro de que quieres eliminar esta reserva de espacio?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showMessage('Reserva de espacio eliminada exitosamente', 'success');
        fetchReservations();
      } else {
        showMessage('Error al eliminar la reserva de espacio', 'error');
      }
    } catch (error) {
      showMessage('Error de conexión', 'error');
    }
  };

  // Entrega de espacio (solo para admin)
  const handleHandOver = async () => {
    if (!isAdmin()) {
      showMessage('No tienes permisos para realizar esta acción', 'error');
      return;
    }

    if (!reservationId) {
      showMessage('Por favor ingresa un ID de reserva', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${reservationId}/handOver`, {
        method: 'POST'
      });
      
      if (response.ok) {
        showMessage('Entrega de espacio realizada exitosamente', 'success');
        //Limpiar el campo después de la acción exitosa
        setReservationId('');
      } else {
        showMessage('Error al realizar la entrega del espacio', 'error');
      }
    } catch (error) {
      showMessage('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Devolución de espacio (solo para admin)
  const handleReturn = async () => {
    if (!isAdmin()) {
      showMessage('No tienes permisos para realizar esta acción', 'error');
      return;
    }

    if (!reservationId) {
      showMessage('Por favor ingresa un ID de reserva', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${reservationId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conditionRate: Number(returnData.conditionRate),
          serviceRate: Number(returnData.serviceRate)
        })
      });
      
      if (response.ok) {
        showMessage('Devolución de espacio realizada exitosamente', 'success');
        setReservationId('');
        setReturnData({ conditionRate: 5, serviceRate: 5 });
      } else {
        showMessage('Error al realizar la devolución del espacio', 'error');
      }
    } catch (error) {
      showMessage('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reservations') {
      fetchReservations();
    }
  }, [activeTab]);

  // Verificar si el usuario tiene acceso a la aplicación
  if (!hasUserAccess()) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger text-center">
              <h3>Acceso Denegado</h3>
              <p>No tienes permisos para acceder a esta funcionalidad.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1 className="display-4 text-primary mb-2">Sistema de Reservas de Espacios</h1>
          <p className="lead text-muted">Gestiona las reservas y disponibilidad de espacios</p>
          <div className="alert alert-info">
            <strong>Horarios permitidos:</strong> Las reservas solo están disponibles de 7:00 AM a 6:59 PM
          </div>
          {isAdmin() && (
            <div className="badge bg-success">Administrador</div>
          )}
        </div>
      </div>

      {/* Mensaje de estado */}
      {message.text && (
        <div className="row mb-4">
          <div className="col-12">
            <div className={`alert alert-${message.type === 'success' ? 'success' : message.type === 'error' ? 'danger' : 'info'} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: 'info' })}></button>
            </div>
          </div>
        </div>
      )}

      {/* Navegación con tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'availability' ? 'active' : ''}`}
                onClick={() => setActiveTab('availability')}
              >
                🏢 Disponibilidad
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                ➕ Nueva Reserva
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'reservations' ? 'active' : ''}`}
                onClick={() => setActiveTab('reservations')}
              >
                📅 Mis Reservas
              </button>
            </li>
            {/* Tab de Acciones solo para admin */}
            {isAdmin() && (
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'actions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('actions')}
                >
                  ⚡ Acciones
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Contenido */}
      <div className="row">
        <div className="col-12">
          {/* Tab de Disponibilidad - Usando AvailableSpacesTab */}
          {activeTab === 'availability' && (
            <div className="card shadow">
              <div className="card-body">
                <AvailableSpacesTab />
              </div>
            </div>
          )}

          {/* Resto de tabs mantienen la estructura original */}
          {activeTab !== 'availability' && (
            <div className="card shadow">
              <div className="card-body">
                
                {/* Tab de Nueva Reserva */}
                {activeTab === 'create' && (
                  <div>
                    <h2 className="card-title mb-4">Nueva Reserva de Espacio</h2>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Edificio</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.building}
                            onChange={(e) => setFormData({...formData, building: Number(e.target.value)})}
                            placeholder="Número del edificio"
                            required
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label">Código de Espacio</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.resourceCode}
                            onChange={(e) => setFormData({...formData, resourceCode: Number(e.target.value)})}
                            placeholder="Código del espacio (ej: 102)"
                            required
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label">Solicitante</label>
                          <input
                            type="email"
                            className="form-control"
                            value={formData.requester}
                            onChange={(e) => {
                              // Solo permitir cambios si es admin o si no es solo user
                              if (isAdmin() || !isOnlyUser()) {
                                setFormData({...formData, requester: e.target.value});
                              }
                            }}
                            placeholder="usuario@example.com"
                            required
                            disabled={isOnlyUser()} // Deshabilitado si es solo user
                            style={isOnlyUser() ? { backgroundColor: '#e9ecef', cursor: 'not-allowed' } : {}}
                          />
                          {isOnlyUser() && (
                            <small className="form-text text-muted">
                              Este campo se llena automáticamente con tu usuario
                            </small>
                          )}
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label">Gerente</label>
                          <input
                            type="email"
                            className="form-control"
                            value={formData.manager}
                            onChange={(e) => setFormData({...formData, manager: e.target.value})}
                            placeholder="manager@example.com"
                            required
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label">Fecha/Hora Inicio</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={formData.start}
                            onChange={(e) => setFormData({...formData, start: e.target.value})}
                            required
                          />
                          <small className="form-text text-muted">
                            Horario permitido: 7:00 AM - 6:59 PM
                          </small>
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label">Fecha/Hora Fin</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={formData.end}
                            onChange={(e) => setFormData({...formData, end: e.target.value})}
                            required
                          />
                          <small className="form-text text-muted">
                            Horario permitido: 7:00 AM - 6:59 PM
                          </small>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary btn-lg w-100"
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Creando Reserva...
                            </>
                          ) : (
                            'Crear Reserva de Espacio'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* MEJORADO: Tab de Reservas con badges de estado y más información */}
                {activeTab === 'reservations' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className="card-title mb-0">
                        {isAdmin() ? 'Reservas que Gestiono' : 'Mis Reservas de Espacios'}
                      </h2>
                      <button
                        onClick={fetchReservations}
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Cargando...
                          </>
                        ) : (
                          <>🔄 Actualizar</>
                        )}
                      </button>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">Cargando reservas de espacios...</p>
                      </div>
                    ) : reservations.length > 0 ? (
                      <div className="row">
                        {reservations.map((reservation, index) => (
                          <div key={reservation.id || index} className="col-12 mb-3">
                            <div className="card">
                              <div className="card-header d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                  <h5 className="card-title mb-0">
                                    Reserva de Espacio #{reservation.reservationCode || reservation.id || index + 1}
                                  </h5>
                                  {/*Badge de estado */}
                                  {reservation.status && (
                                    <span className={`badge ${getStatusBadgeClass(reservation.status)}`}>
                                      {getStatusText(reservation.status)}
                                    </span>
                                  )}
                                </div>
                                {/* Botón de eliminar solo para admin */}
                                {isAdmin() && (
                                  <button
                                    onClick={() => handleDelete(reservation.id || reservation.reservationCode?.toString() || '')}
                                    className="btn btn-outline-danger btn-sm"
                                  >
                                    🗑️ Eliminar
                                  </button>
                                )}
                              </div>
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-6">
                                    {/*Mostrar código de reserva si existe */}
                                    {reservation.reservationCode && (
                                      <p><strong>Código de Reserva:</strong> {reservation.reservationCode}</p>
                                    )}
                                    <p><strong>Edificio:</strong> {reservation.building}</p>
                                    <p><strong>Código de Espacio:</strong> {reservation.resourceCode}</p>
                                    <p><strong>Solicitante:</strong> {reservation.requester}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <p><strong>Gerente:</strong> {reservation.manager}</p>
                                    <p><strong>Inicio:</strong> {new Date(reservation.start).toLocaleString()}</p>
                                    <p><strong>Fin:</strong> {new Date(reservation.end).toLocaleString()}</p>
                                    {/*Mostrar fechas de entrega y devolución si existen */}
                                    {reservation.handover && (
                                      <p><strong>Entrega:</strong> {new Date(reservation.handover).toLocaleString()}</p>
                                    )}
                                    {reservation.returnTime && (
                                      <p><strong>Devolución:</strong> {new Date(reservation.returnTime).toLocaleString()}</p>
                                    )}
                                  </div>
                                </div>
                                
                                {/*Mostrar calificaciones si existen */}
                                {(reservation.conditionRate || reservation.serviceRate) && (
                                  <div className="mt-3 pt-3 border-top">
                                    <h6 className="text-muted mb-2">Calificaciones:</h6>
                                    <div className="row">
                                      {reservation.conditionRate && (
                                        <div className="col-md-6">
                                          <small className="text-muted">Condición: </small>
                                          <span className="badge bg-info">{reservation.conditionRate}/5</span>
                                        </div>
                                      )}
                                      {reservation.serviceRate && (
                                        <div className="col-md-6">
                                          <small className="text-muted">Servicio: </small>
                                          <span className="badge bg-info">{reservation.serviceRate}/5</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <div className="text-muted">
                          <i className="bi bi-calendar-x display-1"></i>
                          <p className="mt-3">
                            {isAdmin() ? 'No hay reservas de espacios que gestiones' : 'No tienes reservas de espacios activas'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab de Acciones - Solo para admin */}
                {activeTab === 'actions' && isAdmin() && (
                  <div>
                    <h2 className="card-title mb-4">Acciones de Reserva de Espacio</h2>
                    
                    <div className="mb-4">
                      <label className="form-label">ID de Reserva</label>
                      <input
                        type="text"
                        className="form-control"
                        value={reservationId}
                        onChange={(e) => setReservationId(e.target.value)}
                        placeholder="Ingresa el ID de la reserva de espacio"
                      />
                    </div>

                    <div className="row g-4">
                      {/* Entrega */}
                      <div className="col-md-6">
                        <div className="card border-primary">
                          <div className="card-header bg-primary text-white">
                            <h5 className="card-title mb-0">🏢 Entrega de Espacio</h5>
                          </div>
                          <div className="card-body">
                            <p className="card-text">Marca el espacio como entregado al usuario</p>
                            <button
                              onClick={handleHandOver}
                              disabled={loading || !reservationId}
                              className="btn btn-primary w-100"
                            >
                              {loading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Procesando...
                                </>
                              ) : (
                                'Realizar Entrega'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Devolución */}
                      <div className="col-md-6">
                        <div className="card border-success">
                          <div className="card-header bg-success text-white">
                            <h5 className="card-title mb-0">🔄 Devolución de Espacio</h5>
                          </div>
                          <div className="card-body">
                            <p className="card-text">Procesa la devolución del espacio con calificaciones</p>
                            
                            <div className="row g-3 mb-3">
                              <div className="col-6">
                                <label className="form-label small">Calificación de Condición (1-5)</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="5"
                                  className="form-control"
                                  value={returnData.conditionRate}
                                  onChange={(e) => setReturnData({...returnData, conditionRate: Number(e.target.value)})}
                                />
                              </div>
                              
                              <div className="col-6">
                                <label className="form-label small">Calificación de Servicio (1-5)</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="5"
                                  className="form-control"
                                  value={returnData.serviceRate}
                                  onChange={(e) => setReturnData({...returnData, serviceRate: Number(e.target.value)})}
                                />
                              </div>
                            </div>
                            
                            <button
                              onClick={handleReturn}
                              disabled={loading || !reservationId}
                              className="btn btn-success w-100"
                            >
                              {loading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Procesando...
                                </>
                              ) : (
                                'Procesar Devolución'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceOperationsManager;