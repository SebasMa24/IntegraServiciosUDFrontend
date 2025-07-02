import React, { useState } from 'react';
import { Calendar, Package, MapPin, Trash2, HandMetal, RotateCcw, Plus, User, Mail, Clock, Star } from 'lucide-react';

// Mock del servicio de operaciones
const operationsService = {
  createHardwareReservation: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: Math.random().toString(36).substr(2, 9), ...data };
  },
  createSpaceReservation: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: Math.random().toString(36).substr(2, 9), ...data };
  },
  deleteHardwareReservation: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },
  deleteSpaceReservation: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },
  handOverHardware: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },
  handOverSpace: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },
  returnHardware: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },
  returnSpace: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  }
};

const OperationsManager = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('hardware');

  // Estados para los formularios
  const [hardwareForm, setHardwareForm] = useState({
    building: 1,
    resourceCode: 2,
    storedResourceCode: 2,
    requester: '',
    manager: '',
    start: '',
    end: ''
  });

  const [spaceForm, setSpaceForm] = useState({
    building: 1,
    resourceCode: 102,
    requester: '',
    manager: '',
    start: '',
    end: ''
  });

  const [reservationId, setReservationId] = useState('');
  const [returnForm, setReturnForm] = useState({
    conditionRate: 5,
    serviceRate: 2
  });

  const handleError = (err) => {
    setError(err.message || 'Error desconocido');
    setMessage('');
    setTimeout(() => setError(''), 5000);
  };

  const handleSuccess = (msg) => {
    setMessage(msg);
    setError('');
    setTimeout(() => setMessage(''), 5000);
  };

  // Crear reserva de hardware
  const createHardwareReservation = async () => {
    setLoading(true);
    try {
      const result = await operationsService.createHardwareReservation(hardwareForm);
      handleSuccess('Reserva de hardware creada exitosamente');
      console.log('Hardware reservation created:', result);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear reserva de espacio
  const createSpaceReservation = async () => {
    setLoading(true);
    try {
      const result = await operationsService.createSpaceReservation(spaceForm);
      handleSuccess('Reserva de espacio creada exitosamente');
      console.log('Space reservation created:', result);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar reserva de hardware
  const deleteHardwareReservation = async () => {
    if (!reservationId) {
      setError('Ingrese un ID de reserva');
      return;
    }
    
    setLoading(true);
    try {
      await operationsService.deleteHardwareReservation(reservationId);
      handleSuccess('Reserva de hardware eliminada exitosamente');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar reserva de espacio
  const deleteSpaceReservation = async () => {
    if (!reservationId) {
      setError('Ingrese un ID de reserva');
      return;
    }
    
    setLoading(true);
    try {
      await operationsService.deleteSpaceReservation(reservationId);
      handleSuccess('Reserva de espacio eliminada exitosamente');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Entrega de hardware
  const handOverHardware = async () => {
    if (!reservationId) {
      setError('Ingrese un ID de reserva');
      return;
    }
    
    setLoading(true);
    try {
      await operationsService.handOverHardware(reservationId);
      handleSuccess('Hardware entregado exitosamente');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Entrega de espacio
  const handOverSpace = async () => {
    if (!reservationId) {
      setError('Ingrese un ID de reserva');
      return;
    }
    
    setLoading(true);
    try {
      await operationsService.handOverSpace(reservationId);
      handleSuccess('Espacio entregado exitosamente');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Devolución de hardware
  const returnHardware = async () => {
    if (!reservationId) {
      setError('Ingrese un ID de reserva');
      return;
    }
    
    setLoading(true);
    try {
      await operationsService.returnHardware(reservationId, returnForm);
      handleSuccess('Hardware devuelto exitosamente');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Devolución de espacio
  const returnSpace = async () => {
    if (!reservationId) {
      setError('Ingrese un ID de reserva');
      return;
    }
    
    setLoading(true);
    try {
      await operationsService.returnSpace(reservationId, returnForm);
      handleSuccess('Espacio devuelto exitosamente');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange, label }) => {
    return (
      <div className="mb-3">
        <label className="form-label fw-medium">{label}</label>
        <div className="d-flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`btn btn-link p-0 ${
                star <= value ? 'text-warning' : 'text-muted'
              }`}
              style={{ fontSize: '1.5rem', lineHeight: 1 }}
            >
              <Star fill={star <= value ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      <style>
        {`
          .bg-gradient-primary {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          }
          .bg-gradient-success {
            background: linear-gradient(135deg, #10b981, #059669);
          }
          .bg-gradient-danger {
            background: linear-gradient(135deg, #ef4444, #dc2626);
          }
          .bg-gradient-warning {
            background: linear-gradient(135deg, #f59e0b, #d97706);
          }
          .bg-gradient-info {
            background: linear-gradient(135deg, #06b6d4, #0891b2);
          }
          .gradient-text {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .spinner-border-sm {
            width: 1rem;
            height: 1rem;
          }
          .card-custom {
            border: none;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-radius: 20px;
          }
          .btn-custom {
            border-radius: 15px;
            font-weight: 600;
            padding: 12px 24px;
            transition: all 0.3s ease;
          }
          .btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          body {
            background: linear-gradient(135deg, #f0f8ff, #e6f3ff);
            min-height: 100vh;
          }
          .fade-in {
            animation: fadeIn 0.5s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .pulse {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      
      <div className="min-vh-100 py-5">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">
              <span className="gradient-text">Gestión de Operaciones</span>
            </h1>
            <p className="lead text-muted">Administra reservas de hardware y espacios de forma eficiente</p>
          </div>

          {/* Mensajes de estado */}
          {message && (
            <div className="mb-4 fade-in">
              <div className="alert alert-success border-0 bg-gradient-success text-white shadow-lg rounded-4">
                <div className="d-flex align-items-center">
                  <span className="badge bg-light text-success rounded-circle p-1 me-3 pulse"></span>
                  {message}
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-4 fade-in">
              <div className="alert alert-danger border-0 bg-gradient-danger text-white shadow-lg rounded-4">
                <div className="d-flex align-items-center">
                  <span className="badge bg-light text-danger rounded-circle p-1 me-3 pulse"></span>
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="d-flex justify-content-center mb-5">
            <div className="card border-0 shadow-lg rounded-4 p-2">
              <div className="btn-group" role="group">
                <button
                  onClick={() => setActiveTab('hardware')}
                  className={`btn btn-custom d-flex align-items-center ${
                    activeTab === 'hardware'
                      ? 'btn-primary text-white shadow'
                      : 'btn-outline-secondary'
                  }`}
                >
                  <Package className="me-2" size={20} />
                  Hardware
                </button>
                <button
                  onClick={() => setActiveTab('space')}
                  className={`btn btn-custom d-flex align-items-center ${
                    activeTab === 'space'
                      ? 'btn-primary text-white shadow'
                      : 'btn-outline-secondary'
                  }`}
                >
                  <MapPin className="me-2" size={20} />
                  Espacios
                </button>
                <button
                  onClick={() => setActiveTab('operations')}
                  className={`btn btn-custom d-flex align-items-center ${
                    activeTab === 'operations'
                      ? 'btn-primary text-white shadow'
                      : 'btn-outline-secondary'
                  }`}
                >
                  <Calendar className="me-2" size={20} />
                  Operaciones
                </button>
              </div>
            </div>
          </div>

          {/* Hardware Tab */}
          {activeTab === 'hardware' && (
            <div className="fade-in">
              <div className="card card-custom p-4">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-4 me-3">
                      <Package className="text-primary" size={32} />
                    </div>
                    <h2 className="h3 fw-bold mb-0">Nueva Reserva de Hardware</h2>
                  </div>
                  
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <MapPin className="me-2 text-muted" size={16} />
                        Edificio
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        value={hardwareForm.building}
                        onChange={(e) => setHardwareForm({...hardwareForm, building: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Package className="me-2 text-muted" size={16} />
                        Código de Recurso
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        value={hardwareForm.resourceCode}
                        onChange={(e) => setHardwareForm({...hardwareForm, resourceCode: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Package className="me-2 text-muted" size={16} />
                        Código de Resource Almacenado
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        value={hardwareForm.storedResourceCode}
                        onChange={(e) => setHardwareForm({...hardwareForm, storedResourceCode: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Mail className="me-2 text-muted" size={16} />
                        Email del Solicitante
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        placeholder="usuario@ejemplo.com"
                        value={hardwareForm.requester}
                        onChange={(e) => setHardwareForm({...hardwareForm, requester: e.target.value})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <User className="me-2 text-muted" size={16} />
                        Email del Gerente
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        placeholder="gerente@ejemplo.com"
                        value={hardwareForm.manager}
                        onChange={(e) => setHardwareForm({...hardwareForm, manager: e.target.value})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Clock className="me-2 text-muted" size={16} />
                        Fecha de Inicio
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        value={hardwareForm.start}
                        onChange={(e) => setHardwareForm({...hardwareForm, start: e.target.value})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Clock className="me-2 text-muted" size={16} />
                        Fecha de Fin
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        value={hardwareForm.end}
                        onChange={(e) => setHardwareForm({...hardwareForm, end: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={createHardwareReservation}
                    disabled={loading}
                    className="btn btn-primary btn-lg w-100 mt-4 btn-custom bg-gradient-primary border-0 d-flex align-items-center justify-content-center"
                  >
                    {loading ? (
                      <div className="spinner-border spinner-border-sm me-3" role="status"></div>
                    ) : (
                      <Plus className="me-3" size={24} />
                    )}
                    {loading ? 'Creando Reserva...' : 'Crear Reserva de Hardware'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Space Tab */}
          {activeTab === 'space' && (
            <div className="fade-in">
              <div className="card card-custom p-4">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-info bg-opacity-10 p-3 rounded-4 me-3">
                      <MapPin className="text-info" size={32} />
                    </div>
                    <h2 className="h3 fw-bold mb-0">Nueva Reserva de Espacio</h2>
                  </div>
                  
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <MapPin className="me-2 text-muted" size={16} />
                        Edificio
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        value={spaceForm.building}
                        onChange={(e) => setSpaceForm({...spaceForm, building: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Package className="me-2 text-muted" size={16} />
                        Código de Recurso
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        value={spaceForm.resourceCode}
                        onChange={(e) => setSpaceForm({...spaceForm, resourceCode: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Mail className="me-2 text-muted" size={16} />
                        Email del Solicitante
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        placeholder="usuario@ejemplo.com"
                        value={spaceForm.requester}
                        onChange={(e) => setSpaceForm({...spaceForm, requester: e.target.value})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <User className="me-2 text-muted" size={16} />
                        Email del Gerente
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        placeholder="gerente@ejemplo.com"
                        value={spaceForm.manager}
                        onChange={(e) => setSpaceForm({...spaceForm, manager: e.target.value})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Clock className="me-2 text-muted" size={16} />
                        Fecha de Inicio
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        value={spaceForm.start}
                        onChange={(e) => setSpaceForm({...spaceForm, start: e.target.value})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Clock className="me-2 text-muted" size={16} />
                        Fecha de Fin
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-lg rounded-3 bg-light border-0"
                        value={spaceForm.end}
                        onChange={(e) => setSpaceForm({...spaceForm, end: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={createSpaceReservation}
                    disabled={loading}
                    className="btn btn-info btn-lg w-100 mt-4 btn-custom bg-gradient-info border-0 d-flex align-items-center justify-content-center"
                  >
                    {loading ? (
                      <div className="spinner-border spinner-border-sm me-3" role="status"></div>
                    ) : (
                      <Plus className="me-3" size={24} />
                    )}
                    {loading ? 'Creando Reserva...' : 'Crear Reserva de Espacio'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Operations Tab */}
          {activeTab === 'operations' && (
            <div className="fade-in">
              <div className="row g-4">
                {/* ID Input */}
                <div className="col-12">
                  <div className="card card-custom p-4">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-success bg-opacity-10 p-3 rounded-4 me-3">
                          <Calendar className="text-success" size={32} />
                        </div>
                        <h2 className="h3 fw-bold mb-0">Gestión de Reservas</h2>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-medium">ID de Reserva</label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3 bg-light border-0"
                          placeholder="Ingrese el ID de la reserva"
                          value={reservationId}
                          onChange={(e) => setReservationId(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="col-md-6">
                  <div className="card card-custom p-4 h-100">
                    <div className="card-body">
                      <h3 className="h5 fw-bold mb-4 d-flex align-items-center">
                        <Trash2 className="me-2 text-danger" size={20} />
                        Eliminar Reservas
                      </h3>
                      <div className="d-grid gap-3">
                        <button
                          onClick={deleteHardwareReservation}
                          disabled={loading}
                          className="btn btn-danger btn-custom bg-gradient-danger border-0 d-flex align-items-center justify-content-center"
                        >
                          <Package className="me-2" size={20} />
                          Eliminar Hardware
                        </button>
                        <button
                          onClick={deleteSpaceReservation}
                          disabled={loading}
                          className="btn btn-danger btn-custom bg-gradient-danger border-0 d-flex align-items-center justify-content-center"
                        >
                          <MapPin className="me-2" size={20} />
                          Eliminar Espacio
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card card-custom p-4 h-100">
                    <div className="card-body">
                      <h3 className="h5 fw-bold mb-4 d-flex align-items-center">
                        <HandMetal className="me-2 text-warning" size={20} />
                        Entregas
                      </h3>
                      <div className="d-grid gap-3">
                        <button
                          onClick={handOverHardware}
                          disabled={loading}
                          className="btn btn-warning btn-custom bg-gradient-warning border-0 d-flex align-items-center justify-content-center"
                        >
                          <Package className="me-2" size={20} />
                          Entregar Hardware
                        </button>
                        <button
                          onClick={handOverSpace}
                          disabled={loading}
                          className="btn btn-warning btn-custom bg-gradient-warning border-0 d-flex align-items-center justify-content-center"
                        >
                          <MapPin className="me-2" size={20} />
                          Entregar Espacio
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Return Section */}
                <div className="col-12">
                  <div className="card card-custom p-4">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-secondary bg-opacity-10 p-3 rounded-4 me-3">
                          <RotateCcw className="text-secondary" size={32} />
                        </div>
                        <h3 className="h3 fw-bold mb-0">Devoluciones</h3>
                      </div>
                      
                      <div className="row g-4 mb-4">
                        <div className="col-md-6">
                          <StarRating
                            value={returnForm.conditionRate}
                            onChange={(value) => setReturnForm({...returnForm, conditionRate: value})}
                            label="Calificación de Condición"
                          />
                        </div>
                        <div className="col-md-6">
                          <StarRating
                            value={returnForm.serviceRate}
                            onChange={(value) => setReturnForm({...returnForm, serviceRate: value})}
                            label="Calificación de Servicio"  
                          />
                        </div>
                      </div>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <button
                            onClick={returnHardware}
                            disabled={loading}
                            className="btn btn-secondary btn-lg w-100 btn-custom d-flex align-items-center justify-content-center"
                          >
                            <Package className="me-3" size={24} />
                            Devolver Hardware
                          </button>
                        </div>
                        <div className="col-md-6">
                          <button
                            onClick={returnSpace}
                            disabled={loading}
                            className="btn btn-secondary btn-lg w-100 btn-custom d-flex align-items-center justify-content-center"
                          >
                            <MapPin className="me-3" size={24} />
                            Devolver Espacio
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OperationsManager;