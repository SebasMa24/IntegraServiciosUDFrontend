import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReservedHardwareDetails } from "../../services/hardwareService";
import { getUserLocale } from "../../utils/dateUtils";

const OperationHardwareDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hardwareDetails, setHardwareDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHardwareDetails = async () => {
      if (!id) {
        setError("ID de hardware no proporcionado");
        setLoading(false);
        return;
      }

      try {
        const details = await getReservedHardwareDetails(BigInt(id));
        setHardwareDetails(details);
      } catch (err) {
        setError("Error al cargar los detalles del hardware");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHardwareDetails();
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight: '200px'}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!hardwareDetails) return (
    <div className="container mt-4">
      <div className="alert alert-warning" role="alert">
        No se encontraron detalles para este hardware.
      </div>
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(getUserLocale(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Detalles de Reserva #{hardwareDetails.code}</h1>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => window.history.back()}
        >
          ← Volver
        </button>
      </div>

      {/* Hardware Information */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">📱 Información del Hardware</h5>
        </div>
        <div className="card-body">
          <h6 className="card-title">{hardwareDetails.storedHardware?.hardware?.name}</h6>
          <p className="card-text">
            <strong>Código:</strong> {hardwareDetails.storedHardware?.hardware?.code}<br/>
            <strong>Tipo:</strong> {hardwareDetails.storedHardware?.hardware?.type?.name}<br/>
            <strong>Descripción:</strong> {hardwareDetails.storedHardware?.hardware?.description}
          </p>
        </div>
      </div>

      {/* Location Information */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">📍 Ubicación</h5>
        </div>
        <div className="card-body">
          <p className="card-text">
            <strong>Edificio:</strong> {hardwareDetails.storedHardware?.id?.warehouse?.id?.building?.name}<br/>
            <strong>Facultad:</strong> {hardwareDetails.storedHardware?.id?.warehouse?.id?.building?.faculty?.name}<br/>
            <strong>Dirección:</strong> {hardwareDetails.storedHardware?.id?.warehouse?.id?.building?.address}<br/>
            <strong>Teléfono:</strong> {hardwareDetails.storedHardware?.id?.warehouse?.id?.building?.phone}<br/>
            <strong>Email:</strong> {hardwareDetails.storedHardware?.id?.warehouse?.id?.building?.email}<br/>
            <strong>Bodega:</strong> {hardwareDetails.storedHardware?.id?.warehouse?.id?.code}
          </p>
        </div>
      </div>

      {/* Requester Information */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">👤 Solicitante</h5>
        </div>
        <div className="card-body">
          <p className="card-text">
            <strong>Nombre:</strong> {hardwareDetails.requester?.name}<br/>
            <strong>Email:</strong> {hardwareDetails.requester?.email}<br/>
            <strong>Teléfono:</strong> {hardwareDetails.requester?.phone}<br/>
            <strong>Dirección:</strong> {hardwareDetails.requester?.address}<br/>
            <strong>Rol:</strong> {hardwareDetails.requester?.role?.name.replace('ROLE_', '')}
          </p>
        </div>
      </div>

      {/* Manager Information */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">👨‍💼 Administrador</h5>
        </div>
        <div className="card-body">
          <p className="card-text">
            <strong>Nombre:</strong> {hardwareDetails.manager?.name}<br/>
            <strong>Email:</strong> {hardwareDetails.manager?.email}<br/>
            <strong>Teléfono:</strong> {hardwareDetails.manager?.phone}<br/>
            <strong>Dirección:</strong> {hardwareDetails.manager?.address}<br/>
            <strong>Rol:</strong> {hardwareDetails.manager?.role?.name.replace('ROLE_', '')}
          </p>
        </div>
      </div>

      {/* Dates and Ratings */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">📅 Fechas y Calificaciones</h5>
        </div>
        <div className="card-body">
          <p className="card-text">
            <strong>Fecha de Inicio Programada:</strong> {formatDate(hardwareDetails.startDate)}<br/>
            <strong>Fecha de Fin Programada:</strong> {formatDate(hardwareDetails.endDate)}<br/>
            <strong>Fecha de Entrega Real:</strong> {hardwareDetails.handoverDate ? formatDate(hardwareDetails.handoverDate) : 'Pendiente'}<br/>
            <strong>Fecha de Devolución Real:</strong> {hardwareDetails.returnDate ? formatDate(hardwareDetails.returnDate) : 'Pendiente'}
          </p>
          <div className="mb-3">
            <label className="form-label">Calificación de Condición</label>
            <div className="d-flex align-items-center">
              <span className="me-2">{hardwareDetails.conditionRate}/5</span>
              <div className="progress flex-grow-1" style={{height: '20px'}}>
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{width: `${(hardwareDetails.conditionRate / 5) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Calificación de Servicio</label>
            <div className="d-flex align-items-center">
              <span className="me-2">{hardwareDetails.serviceRate}/5</span>
              <div className="progress flex-grow-1" style={{height: '20px'}}>
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{width: `${(hardwareDetails.serviceRate / 5) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperationHardwareDetails;
