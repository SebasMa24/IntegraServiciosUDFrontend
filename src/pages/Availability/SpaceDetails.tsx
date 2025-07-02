import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSpaceDetails } from "../../services/spaceService";

const SpaceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [spaceDetails, setSpaceDetails] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchSpaceDetails = async () => {
      if (!id) {
        setError("ID de espacio no proporcionado");
        setLoading(false);
        return;
      }

      try {
        const buildingId = Number(id.split("-")[0]);
        const spaceId = Number(id.split("-")[1]);

        const details = await getSpaceDetails(buildingId, spaceId);
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Detalles del Espacio</h1>
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
          <h6 className="card-title">{spaceDetails.name}</h6>
          <p className="card-text">
            <strong>Código:</strong> {spaceDetails.id?.code}<br/>
            <strong>Tipo:</strong> {spaceDetails.type?.description}<br/>
            <strong>Estado:</strong> {spaceDetails.state?.description}<br/>
            <strong>Capacidad:</strong> {spaceDetails.capacity} personas<br/>
            <strong>Descripción:</strong> {spaceDetails.description}
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
            <strong>Edificio:</strong> {spaceDetails.id?.building?.name}<br/>
            <strong>Facultad:</strong> {spaceDetails.id?.building?.faculty?.name}<br/>
            <strong>Dirección:</strong> {spaceDetails.id?.building?.address}<br/>
            <strong>Teléfono:</strong> {spaceDetails.id?.building?.phone}<br/>
            <strong>Email:</strong> {spaceDetails.id?.building?.email}
          </p>
        </div>
      </div>

      {/* Schedule Information */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">⏰ Horarios Disponibles</h5>
        </div>
        <div className="card-body">
          {spaceDetails.schedule?.length > 0 ? (
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
                    
                    const sortedSchedule = spaceDetails.schedule
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

export default SpaceDetails;
