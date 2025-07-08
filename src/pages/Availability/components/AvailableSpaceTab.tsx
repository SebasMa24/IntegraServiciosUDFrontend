import React, { useEffect, useCallback } from 'react';
import { getAvailableSpaces } from '../../../services/spaceService';
import { getSpaceTypesDomain, getBuildingsDomain } from '../../../services/domainService';
import { createISOStringFromDateTime, getDateFromISO, getTimeFromISO } from '../../../utils/dateUtils';
import type { RequestOptions as SpaceRequestOptions } from '../../../services/spaceService';
import { useNavigate } from 'react-router-dom';

const AvailableSpacesTab: React.FC = () => {
  const navigate = useNavigate();
  const [availableSpaces, setAvailableSpaces] = React.useState<any[]>([]);
  const [availableSpacesFiltersForm, setAvailableSpacesFiltersForm] = React.useState<SpaceRequestOptions>({});
  const [availableSpacesFilters, setAvailableSpacesFilters] = React.useState<SpaceRequestOptions>({getAll: true});
  const [searchDebounceTimeout, setSearchDebounceTimeout] = React.useState<NodeJS.Timeout | null>(null);
  const [nameSearchValue, setNameSearchValue] = React.useState<string>('');
  const [spaceTypesDomain, setSpaceTypesDomain] = React.useState<string[]>([]);
  const [buildingsDomain, setBuildingsDomain] = React.useState<Array<{code: number, name: string}>>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Fetch space types and buildings domain data
  React.useEffect(() => {
    const fetchDomains = async () => {
      try {
        const spaceTypes = await getSpaceTypesDomain();
        setSpaceTypesDomain(spaceTypes);
        const buildings = await getBuildingsDomain();
        setBuildingsDomain(buildings);
      } catch (error) {
        console.error('Error fetching domains:', error);
      }
    };
    fetchDomains();
  }, []); 

  // Fetch available spaces
  useEffect(() => {
    const fetchAvailableSpaces = async () => {
      setIsLoading(true);
      try {
        const response = await getAvailableSpaces(availableSpacesFilters);
        if (response) {
          setAvailableSpaces(response);
        }
      } catch (error) {
        console.error('Error fetching available spaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSpaces();
  }, [availableSpacesFilters]);

  const handleNameSearch = useCallback((searchValue: string) => {
    setNameSearchValue(searchValue);

    // Clear existing timeout
    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }

    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      // Update the availableSpacesFilters with the nameLike filter.
      setAvailableSpacesFilters((prev) => ({
        ...prev,
        nameLike: searchValue,
      }));
    }, 500); // 500ms delay

    setSearchDebounceTimeout(newTimeout);
  }, [searchDebounceTimeout]);

  const handleFilterFormChange = (key: keyof SpaceRequestOptions, value: any) => {
    let filters = {
      ...availableSpacesFiltersForm,
      [key]: value === '' ? undefined : value
    };

    // Set getAll based on date availability
    if (!filters.startDate && !filters.endDate) {
      filters.getAll = true;
    } else {
      filters.getAll = false;
    }

    setAvailableSpacesFiltersForm(filters);
  };

  const handleDateChange = (date: string) => {
    const startTime = getTimeFromISO(availableSpacesFiltersForm.startDate) || '07:00';
    const endTime = getTimeFromISO(availableSpacesFiltersForm.endDate) || '18:59';
    
    const filters = {
      ...availableSpacesFiltersForm,
      startDate: date ? createISOStringFromDateTime(date, startTime) : undefined,
      endDate: date ? createISOStringFromDateTime(date, endTime) : undefined,
    };

    setAvailableSpacesFiltersForm(filters);
  };

  const handleTimeChange = (timeKey: 'startTime' | 'endTime', time: string) => {
    const date = getSelectedDate();
    if (!date) return;

    const targetKey = timeKey === 'startTime' ? 'startDate' : 'endDate';
    
    const filters = {
      ...availableSpacesFiltersForm,
      [targetKey]: time ? createISOStringFromDateTime(date, time) : undefined,
    };

    // garantee that both startDate and endDate are set
    if (filters.startDate && !filters.endDate) {
      filters.endDate = createISOStringFromDateTime(date, '18:59');
    } else if (!filters.startDate && filters.endDate) {
      filters.startDate = createISOStringFromDateTime(date, '07:00');
    }

    // ensure that startDate is within the allowed time range
    if (filters.startDate) {
      if (filters.startDate < createISOStringFromDateTime(date, '07:00'))
        filters.startDate = createISOStringFromDateTime(date, '07:00');
      if (filters.startDate >= createISOStringFromDateTime(date, '19:00'))
        filters.startDate = createISOStringFromDateTime(date, '18:59');
    }

    // ensure that endDate is within the allowed time range
    if (filters.endDate) {
      if (filters.endDate < createISOStringFromDateTime(date, '07:00'))
        filters.endDate = createISOStringFromDateTime(date, '07:00');
      if (filters.endDate >= createISOStringFromDateTime(date, '19:00'))
        filters.endDate = createISOStringFromDateTime(date, '18:59');
    }

    // garantee that startDate is before endDate
    if (filters.startDate && filters.endDate && new Date(filters.startDate) > new Date(filters.endDate)) {
      filters.endDate = new Date(filters.startDate).toISOString();
    }

    setAvailableSpacesFiltersForm(filters);
  };

  const getSelectedDate = () => {
    return getDateFromISO(availableSpacesFiltersForm.startDate) || getDateFromISO(availableSpacesFiltersForm.endDate);
  };

  const applyFilters = () => {
    setAvailableSpacesFilters(availableSpacesFiltersForm);
  }

  const clearFilters = () => {
    setAvailableSpacesFilters({getAll: true});
    setAvailableSpacesFiltersForm({});
    setNameSearchValue('');
  };

  return (
    <div className="row">
      {/* Filter Panel */}
      <div className="col-md-3">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Filtros</h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="type" className="form-label">Tipo</label>
              <select
                className="form-select form-select-sm"
                id="type"
                value={availableSpacesFiltersForm.type || ''}
                onChange={(e) => handleFilterFormChange('type', e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {spaceTypesDomain.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="capacity" className="form-label">Capacidad mínima</label>
              <input
                type="number"
                className="form-control form-control-sm"
                id="capacity"
                value={availableSpacesFiltersForm.capacity || ''}
                onChange={(e) => handleFilterFormChange('capacity', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Ej: 10"
                min="1"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="building" className="form-label">Edificio</label>
              <select
                className="form-select form-select-sm"
                id="building"
                value={availableSpacesFiltersForm.building || ''}
                onChange={(e) => handleFilterFormChange('building', e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <option value="">Todos los edificios</option>
                {buildingsDomain.map((building) => (
                  <option key={building.code} value={building.code}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="reservationDate" className="form-label">Fecha de reserva</label>
              <input
                type="date"
                className="form-control form-control-sm"
                id="reservationDate"
                value={getSelectedDate()}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="startTime" className="form-label">Hora inicio</label>
              <input
                type="time"
                className="form-control form-control-sm"
                id="startTime"
                value={getTimeFromISO(availableSpacesFiltersForm.startDate)}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="endTime" className="form-label">Hora fin</label>
              <input
                type="time"
                className="form-control form-control-sm"
                id="endTime"
                value={getTimeFromISO(availableSpacesFiltersForm.endDate)}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
              />
            </div>

            <button 
              type="button" 
              className="btn btn-primary btn-sm w-100 mb-2"
              onClick={applyFilters}
            >
              Aplicar filtros
            </button>

            <button 
              type="button" 
              className="btn btn-secondary btn-sm w-100"
              onClick={clearFilters}
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
            {availableSpacesFilters.getAll 
              ? `Todos los Espacios (${availableSpaces.length})` 
              : `Espacios Disponibles (${availableSpaces.length})`
            }
          </h2>
          
          <div className="mb-3">
            <label htmlFor="nameLike" className="form-label">Buscar por nombre</label>
            <input
              type="text"
              className="form-control"
              id="nameLike"
              value={nameSearchValue}
              onChange={(e) => handleNameSearch(e.target.value)}
              placeholder="Buscar por nombre del espacio..."
            />
          </div>

          <ul className="list-group">
            {isLoading ? (
              <li className="list-group-item text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted mt-2 mb-0">Cargando espacios...</p>
              </li>
            ) : availableSpaces.length > 0 ? (
              availableSpaces.map((space) => (
                <li
                  key={`${space.code_space}-${space.code_building}`}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/availability/details/space/${space.code_building}-${space.code_space}`)}
                >
                  <strong>{space.name_space}</strong> ({space.type_space}) - {space.name_building}, Capacidad: {space.capacity_space}
                </li>
              ))
            ) : (
              <li className="list-group-item text-center py-4">
                <p className="text-muted mb-0">No se encontraron espacios que coincidan con los criterios de búsqueda.</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvailableSpacesTab;
