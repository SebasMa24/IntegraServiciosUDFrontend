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
  const [error, setError] = useState<string>('');
  const [hasAppliedFilters, setHasAppliedFilters] = useState<boolean>(false);

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
    // Show all resources when data is loaded (initial search without filters)
    if (allResources.length > 0) {
      setAvailableResources(allResources);
    }
  }, [allResources]);

  // Function to get resource type name by ID
  const getResourceTypeName = (typeId: number): string => {
    const resourceType = resourceTypes.find(type => type.tire_ID === typeId);
    return resourceType ? resourceType.tire_NOMBRE : `Tipo ${typeId}`;
  };
  const handleSearch = () => {
    // Clear previous errors
    setError('');

    // Validate dates if any date is provided
    if (startDate || endDate) {
      // Check if both dates are provided
      if (!startDate || !endDate) {
        setError('Debe proporcionar tanto la fecha de inicio como la fecha de fin para filtrar por disponibilidad.');
        return;
      }

      // Check chronological order
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        setError('La fecha de inicio debe ser anterior o igual a la fecha de fin.');
        return;
      }
    }

    // Mark that filters have been applied
    setHasAppliedFilters(true);

    // Filter resources by name and type only
    let filteredResources = allResources.filter(resource => {
      const nameMatches = searchName === '' || 
        resource.recu_NOMBRE.toLowerCase().includes(searchName.toLowerCase());
      const typeMatches = selectedTypeId === 0 || resource.tireid === selectedTypeId;
      
      return nameMatches && typeMatches;
    });

    // Apply availability filter only if both dates are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredResources = findAvailableResources(searchName, selectedTypeId, start, end);
    }

    setAvailableResources(filteredResources);
  };

  return (
    <div className="container mt-4">
      <h2>Integración con TroyaDevClub</h2>
      <p className="text-muted">
        Consulta los recursos disponibles en el sistema de gestión de recursos de TroyaDevClub. 
        Puedes filtrar por nombre, tipo de recurso y verificar disponibilidad en fechas específicas.
      </p>
      
      <div className="row">
        {/* Filter Panel */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Filtros</h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-sm" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <small>{error}</small>
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="searchName" className="form-label">Nombre del Recurso</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="searchName"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Buscar por nombre..."
                />
              </div>

              <div className="mb-3">
                <label htmlFor="resourceType" className="form-label">Tipo de Recurso</label>
                <select
                  className="form-select form-select-sm"
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

              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">Fecha Inicio</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">Fecha Fin</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <button 
                type="button" 
                className="btn btn-primary btn-sm w-100 mb-2"
                onClick={handleSearch}
              >
                Aplicar filtros
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm w-100"
                onClick={() => {
                  setSearchName('');
                  setSelectedTypeId(0);
                  setStartDate('');
                  setEndDate('');
                  setError('');
                  setHasAppliedFilters(false);
                  setAvailableResources(allResources);
                }}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="col-md-9">
          <div className="tab-pane fade show active">
            <h2 className="text-secondary">
              {(hasAppliedFilters && startDate && endDate) 
                ? `Recursos Disponibles (${availableResources.length})` 
                : `Todos los Recursos (${availableResources.length})`
              }
            </h2>

            {availableResources.length > 0 ? (
              <ul className="list-group">
                {availableResources.map((resource) => (
                  <li
                    key={resource.recu_ID}
                    className="list-group-item"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{resource.recu_NOMBRE}</strong> ({getResourceTypeName(resource.tireid)})
                        <br />
                        <small className="text-muted">
                          ID: {resource.recu_ID} | 
                          Registro: {new Date(resource.recu_FECHA_REGISTRO).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">
                  {(searchName || selectedTypeId > 0 || (startDate && endDate)) && !error
                    ? "No se encontraron recursos que coincidan con los criterios de búsqueda especificados."
                    : "Cargando recursos..."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TroyaDev;
