import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReservedSpaceDetails } from "../../services/spaceService";
import { getUserLocale } from "../../utils/dateUtils";

const OperationSpaceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [spaceDetails, setSpaceDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpaceDetails = async () => {
      if (!id) {
        setError("ID de espacio no proporcionado");
        setLoading(false);
        return;
      }

      try {
        const details = await getReservedSpaceDetails(BigInt(id));
        setSpaceDetails(details);
      } catch (err) {
        setError("Error al cargar los detalles del espacio");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceDetails();
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

  if (!spaceDetails) return (
    <div className="container mt-4">
      <div className="alert alert-warning" role="alert">
        No se encontraron detalles para este espacio.
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
// {
//     "code": 22,
//     "space": {
//         "id": {
//             "building": {
//                 "code": 2,
//                 "faculty": {
//                     "name": "Artes",
//                     "description": "Facultad de Artes"
//                 },
//                 "name": "Edificio 2",
//                 "phone": 6000002,
//                 "address": "Dirección Edificio 2",
//                 "email": "edificio2@example.com"
//             },
//             "code": 9
//         },
//         "type": {
//             "name": "SALON",
//             "description": "Salón de clases"
//         },
//         "state": {
//             "name": "PRESTADO",
//             "description": "Recurso entregado al solicitante"
//         },
//         "name": "Espacio 2-9",
//         "capacity": 13,
//         "schedule": [
//             {
//                 "day": "THURSDAY",
//                 "start": "07:00:00",
//                 "end": "20:00:00"
//             },
//             {
//                 "day": "WEDNESDAY",
//                 "start": "16:00:00",
//                 "end": "17:00:00"
//             },
//             {
//                 "day": "FRIDAY",
//                 "start": "09:00:00",
//                 "end": "10:00:00"
//             },
//             {
//                 "day": "SUNDAY",
//                 "start": "20:00:00",
//                 "end": "22:00:00"
//             },
//             {
//                 "day": "SATURDAY",
//                 "start": "13:00:00",
//                 "end": "16:00:00"
//             }
//         ],
//         "description": "Descripción del espacio 2-9"
//     },
//     "requester": {
//         "email": "usuario2@example.com",
//         "role": {
//             "name": "ROLE_USER",
//             "description": "Usuario regular con acceso limitado"
//         },
//         "code": 2,
//         "name": "Usuario 2",
//         "phone": 3000000002,
//         "address": "Dirección 2"
//     },
//     "manager": {
//         "email": "usuario31@example.com",
//         "role": {
//             "name": "ROLE_ADMIN",
//             "description": "Administrador con acceso total al sistema"
//         },
//         "code": 31,
//         "name": "Usuario 31",
//         "phone": 3000000031,
//         "address": "Dirección 31"
//     },
//     "startDate": "2025-03-10T23:50:43.317885Z",
//     "endDate": "2025-03-11T01:50:43.317885Z",
//     "handoverDate": "2025-03-11T00:03:43.317885Z",
//     "returnDate": null,
//     "conditionRate": null,
//     "serviceRate": null
// }
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Detalles de Reserva #{spaceDetails.code}</h1>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => window.history.back()}
        >
          ← Volver
        </button>
      </div>

      {/* Space Information */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">🏢 Información del Espacio</h5>
        </div>
        <div className="card-body">
          <h6 className="card-title">{spaceDetails.space?.name}</h6>
          <p className="card-text">
            <strong>Código:</strong> {spaceDetails.space?.id?.code}<br/>
            <strong>Tipo:</strong> {spaceDetails.space?.type?.description}<br/>
            <strong>Capacidad:</strong> {spaceDetails.space?.capacity} personas<br/>
            <strong>Descripción:</strong> {spaceDetails.space?.description}
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
            <strong>Edificio:</strong> {spaceDetails.space?.id?.building?.name}<br/>
            <strong>Facultad:</strong> {spaceDetails.space?.id?.building?.faculty?.name}<br/>
            <strong>Dirección:</strong> {spaceDetails.space?.id?.building?.address}<br/>
            <strong>Teléfono:</strong> {spaceDetails.space?.id?.building?.phone}<br/>
            <strong>Email:</strong> {spaceDetails.space?.id?.building?.email}
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
            <strong>Nombre:</strong> {spaceDetails.requester?.name}<br/>
            <strong>Email:</strong> {spaceDetails.requester?.email}<br/>
            <strong>Teléfono:</strong> {spaceDetails.requester?.phone}<br/>
            <strong>Dirección:</strong> {spaceDetails.requester?.address}<br/>
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
            <strong>Nombre:</strong> {spaceDetails.manager?.name}<br/>
            <strong>Email:</strong> {spaceDetails.manager?.email}<br/>
            <strong>Teléfono:</strong> {spaceDetails.manager?.phone}<br/>
            <strong>Dirección:</strong> {spaceDetails.manager?.address}<br/>
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">📅 Fechas y Calificaciones</h5>
        </div>
        <div className="card-body">
          <p className="card-text">
            <strong>Fecha de Inicio Programada:</strong> {formatDate(spaceDetails.startDate)}<br/>
            <strong>Fecha de Fin Programada:</strong> {formatDate(spaceDetails.endDate)}<br/>
            <strong>Fecha de Entrega Real:</strong> {spaceDetails.handoverDate ? formatDate(spaceDetails.handoverDate) : 'Pendiente'}<br/>
            <strong>Fecha de Devolución Real:</strong> {spaceDetails.returnDate ? formatDate(spaceDetails.returnDate) : 'Pendiente'}
          </p>
          <div className="mb-3">
            <label className="form-label">Calificación de Condición</label>
            <div className="d-flex align-items-center">
              <span className="me-2">{spaceDetails.conditionRate !== null ? `${spaceDetails.conditionRate}/5` : 'Sin calificar'}</span>
              {spaceDetails.conditionRate !== null && (
                <div className="progress flex-grow-1" style={{height: '20px'}}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{width: `${(spaceDetails.conditionRate / 5) * 100}%`}}
                  ></div>
                </div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Calificación de Servicio</label>
            <div className="d-flex align-items-center">
              <span className="me-2">{spaceDetails.serviceRate !== null ? `${spaceDetails.serviceRate}/5` : 'Sin calificar'}</span>
              {spaceDetails.serviceRate !== null && (
                <div className="progress flex-grow-1" style={{height: '20px'}}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{width: `${(spaceDetails.serviceRate / 5) * 100}%`}}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperationSpaceDetails;
