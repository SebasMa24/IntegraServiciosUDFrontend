import React, { useEffect, useState } from 'react';
import { getAllResources, getAllBookings, getAllResourceTypes } from '../services/TroyaDevService';
import type { TroyaDevResource, TroyaDevBooking, TroyaDevResourceType } from '../services/TroyaDevService';

const TroyaDev: React.FC = () => {
  const [allResources, setAllResources] = useState<TroyaDevResource[]>([]);
  const [resourceTypes, setResourceTypes] = useState<TroyaDevResourceType[]>([]);
  const [bookings, setBookings] = useState<TroyaDevBooking[]>([]);
  const [availableResources, setAvailableResources] = useState<TroyaDevResource[]>([]);
  const [searchName, setSearchName] = useState<string>('');
  const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  /**
   * Finds available resources based on name, type, and date range.
   * Filters out resources that have active bookings (CREADA or ENTREGADA) during the specified period.
   * 
   * @param nameLike - Partial name to search for in resource names (case-insensitive)
   * @param resourceTypeId - ID of the resource type to filter by (0 for all types)
   * @param startDate - Start date of the desired reservation period
   * @param endDate - End date of the desired reservation period
   * @returns Array of available TroyaDevResource objects that match the criteria
   */
  function findAvailableResources(
    nameLike: string,
    resourceTypeId: number,
    startDate: Date,
    endDate: Date
  ): TroyaDevResource[] {
    // Filter resources by name and type
    let filteredResources = allResources.filter(resource => {
      const nameMatches = nameLike === '' || 
        resource.recu_NOMBRE.toLowerCase().includes(nameLike.toLowerCase());
      const typeMatches = resourceTypeId === 0 || resource.tireid === resourceTypeId;
      
      return nameMatches && typeMatches;
    });

    // Filter out resources that have conflicting bookings
    const availableResources = filteredResources.filter(resource => {
      // Find bookings for this specific resource
      const resourceBookings = bookings.filter(booking => 
        booking.recu_NOMBRE === resource.recu_NOMBRE
      );

      // Check if any booking conflicts with the requested date range
      const hasConflict = resourceBookings.some(booking => {
        // Only consider active bookings (CREADA or ENTREGADA)
        const isActiveBooking = booking.rese_ESTADO === 'CREADA' || 
                                booking.rese_ESTADO === 'ENTREGADA';
        
        if (!isActiveBooking) {
          return false; // DEVUELTA bookings don't block availability
        }

        // For active bookings, we assume they occupy the resource
        // Since we don't have end dates in the booking data, we'll consider
        // that CREADA and ENTREGADA bookings make the resource unavailable
        const bookingDate = new Date(booking.rese_FECHA_REGISTRO);
        return bookingDate >= startDate && bookingDate <= endDate;
      });

      return !hasConflict;
    });

    return availableResources;
  }

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesData = await getAllResources();
        setAllResources(resourcesData);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    const fetchResourceTypes = async () => {
      try {
        const typesData = await getAllResourceTypes();
        setResourceTypes(typesData);
      } catch (error) {
        console.error("Error fetching resource types:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const bookingsData = await getAllBookings();
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchResources();
    fetchBookings();
    fetchResourceTypes();
  }, []);

  useEffect(() => {
    console.log("Resources fetched:", allResources);
    console.log("Bookings fetched:", bookings);
    console.log("Resource Types fetched:", resourceTypes);
  }, [allResources, resourceTypes, bookings]);

  // Function to handle search and update available resources
  const handleSearch = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const available = findAvailableResources(searchName, selectedTypeId, start, end);
      setAvailableResources(available);
    }
  };

  return (
    <div className="container mt-4">
      <h2>TroyaDev Tab</h2>
      <p> En esta pag va a salir lo de la integración. </p>
      
      {/* Search Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h4>Buscar Recursos Disponibles</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <label htmlFor="searchName" className="form-label">Nombre del Recurso</label>
              <input
                type="text"
                className="form-control"
                id="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Buscar por nombre..."
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="resourceType" className="form-label">Tipo de Recurso</label>
              <select
                className="form-select"
                id="resourceType"
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(parseInt(e.target.value))}
              >
                <option value={0}>Todos los tipos</option>
                {resourceTypes.map((type) => (
                  <option key={type.tire_ID} value={type.tire_ID}>
                    {type.tire_NOMBRE}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label htmlFor="startDate" className="form-label">Fecha Inicio</label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="endDate" className="form-label">Fecha Fin</label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleSearch}
                disabled={!startDate || !endDate}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Resources Results */}
      {availableResources.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">
            <h4>Recursos Disponibles ({availableResources.length})</h4>
          </div>
          <div className="card-body">
            <div className="row">
              {availableResources.map((resource) => (
                <div key={resource.recu_ID} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{resource.recu_NOMBRE}</h5>
                      <p className="card-text">
                        <small className="text-muted">
                          ID: {resource.recu_ID} | Tipo: {resource.tireid} | 
                          Registro: {new Date(resource.recu_FECHA_REGISTRO).toLocaleDateString()}
                        </small>
                      </p>
                      <span className="badge bg-success">Disponible</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="row">
        <div className="col-md-6">
          <h3>Recursos</h3>
          {allResources.length > 0 ? (
            <ul className="list-group">
              {allResources.map((resource) => (
                <li key={resource.recu_ID} className="list-group-item">
                  <strong>{resource.recu_NOMBRE}</strong>
                  <br />
                  <small className="text-muted">
                    ID: {resource.recu_ID} | Tipo: {resource.tireid} | 
                    Registro: {new Date(resource.recu_FECHA_REGISTRO).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No hay recursos disponibles</p>
          )}
        </div>
        
        {/* List all bookings */}
        <div className="col-md-6">
          <h3>Reservas</h3>
          {bookings.length > 0 ? (
            <ul className="list-group">
              {bookings.map((booking) => (
                <li key={booking.rese_ID} className="list-group-item">
                  <strong>{booking.recu_NOMBRE}</strong>
                  <br />
                  <span className="text-primary">
                    {booking.usua_NOMBRES} {booking.usua_APELLIDOS}
                  </span>
                  <br />
                  <small className="text-muted">
                    Email: {booking.usua_CORREO}
                  </small>
                  <br />
                  <small className="text-muted">
                    ID Reserva: {booking.rese_ID} | 
                    Estado: <span className={`badge ${booking.rese_ESTADO === 'ACTIVA' ? 'bg-success' : 'bg-secondary'}`}>
                      {booking.rese_ESTADO}
                    </span> | 
                    Calificación: {booking.rese_CALIFICACION}/5 | 
                    Registro: {new Date(booking.rese_FECHA_REGISTRO).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No hay reservas disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TroyaDev;
