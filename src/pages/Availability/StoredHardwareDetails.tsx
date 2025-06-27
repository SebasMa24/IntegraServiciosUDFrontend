// {
//     "id": {
//         "warehouse": {
//             "id": {
//                 "building": {
//                     "code": 5,
//                     "faculty": {
//                         "name": "Ingeniería",
//                         "description": "Facultad de Ingeniería"
//                     },
//                     "name": "Edificio 5",
//                     "phone": 6000005,
//                     "address": "Dirección Edificio 5",
//                     "email": "edificio5@example.com"
//                 },
//                 "code": 2
//             }
//         },
//         "code": 2
//     },
//     "hardware": {
//         "code": 2,
//         "type": {
//             "name": "Tipo Hardware 6",
//             "description": "Descripción del tipo de hardware 6"
//         },
//         "name": "Hardware 2",
//         "schedule": [
//             {
//                 "day": "THURSDAY",
//                 "start": "10:00:00",
//                 "end": "15:00:00"
//             },
//             {
//                 "day": "WEDNESDAY",
//                 "start": "15:00:00",
//                 "end": "22:00:00"
//             },
//             {
//                 "day": "TUESDAY",
//                 "start": "15:00:00",
//                 "end": "20:00:00"
//             },
//             {
//                 "day": "SUNDAY",
//                 "start": "13:00:00",
//                 "end": "23:00:00"
//             },
//             {
//                 "day": "MONDAY",
//                 "start": "11:00:00",
//                 "end": "18:00:00"
//             },
//             {
//                 "day": "SATURDAY",
//                 "start": "11:00:00",
//                 "end": "15:00:00"
//             },
//             {
//                 "day": "FRIDAY",
//                 "start": "13:00:00",
//                 "end": "22:00:00"
//             }
//         ],
//         "description": "Descripción del hardware 2"
//     },
//     "state": {
//         "name": "DISPONIBLE",
//         "description": "Recurso disponible para reserva"
//     }
// }

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getStoredHardwareDetails } from "../../services/hardwareService";

const StoredHardwareDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hardwareDetails, setHardwareDetails] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchHardwareDetails = async () => {
      if (!id) {
        setError("ID de hardware no proporcionado");
        setLoading(false);
        return;
      }

      try {
        const buildingId = Number(id.split("-")[0]);
        const warehouseId = Number(id.split("-")[1]);
        const hardwareId = Number(id.split("-")[2]);

        const details = await getStoredHardwareDetails(buildingId, warehouseId, hardwareId);
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Detalles del Hardware Almacenado</h1>
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
          <h5 className="mb-0">🔧 Información del Hardware</h5>
        </div>
        <div className="card-body">
          <h6 className="card-title">{hardwareDetails.hardware?.name}</h6>
          <p className="card-text">
            <strong>Código:</strong> {hardwareDetails.hardware?.code}<br/>
            <strong>Tipo:</strong> {hardwareDetails.hardware?.type?.name}<br/>
            <strong>Descripción del Tipo:</strong> {hardwareDetails.hardware?.type?.description}<br/>
            <strong>Estado:</strong> {hardwareDetails.state?.description}<br/>
            <strong>Descripción:</strong> {hardwareDetails.hardware?.description}
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
            <strong>Edificio:</strong> {hardwareDetails.id?.warehouse?.id?.building?.name}<br/>
            <strong>Facultad:</strong> {hardwareDetails.id?.warehouse?.id?.building?.faculty?.name}<br/>
            <strong>Dirección:</strong> {hardwareDetails.id?.warehouse?.id?.building?.address}<br/>
            <strong>Teléfono:</strong> {hardwareDetails.id?.warehouse?.id?.building?.phone}<br/>
            <strong>Email:</strong> {hardwareDetails.id?.warehouse?.id?.building?.email}<br/>
            <strong>Bodega:</strong> {hardwareDetails.id?.warehouse?.id?.code}
          </p>
        </div>
      </div>

      {/* Schedule Information */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">⏰ Horarios Disponibles</h5>
        </div>
        <div className="card-body">
          {hardwareDetails.hardware?.schedule?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th scope="col" className="text-center">Día</th>
                    <th scope="col" className="text-center">Hora Inicio</th>
                    <th scope="col" className="text-center">Hora Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
                    const dayTranslations = {
                      'MONDAY': 'Lunes',
                      'TUESDAY': 'Martes',
                      'WEDNESDAY': 'Miércoles',
                      'THURSDAY': 'Jueves',
                      'FRIDAY': 'Viernes',
                      'SATURDAY': 'Sábado',
                      'SUNDAY': 'Domingo'
                    };
                    
                    const sortedSchedule = hardwareDetails.hardware.schedule
                      .sort((a: any, b: any) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
                    
                    return sortedSchedule.map((slot: any, index: number) => (
                      <tr key={index}>
                        <td className="text-center">{dayTranslations[slot.day as keyof typeof dayTranslations]}</td>
                        <td className="text-center">{slot.start}</td>
                        <td className="text-center">{slot.end}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No hay horarios disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoredHardwareDetails;
