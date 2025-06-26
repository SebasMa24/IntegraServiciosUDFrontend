import React, { useEffect, useCallback } from "react";
import { getRoles } from "../../../services/auth";
import { getReservedSpaceHistory } from "../../../services/spaceService";
import { getSpaceTypesDomain, getBuildingsDomain } from "../../../services/domainService";
import { createISOStringFromDateTime, createISOStringFromDate, getDateFromISO, getTimeFromISO } from "../../../utils/dateUtils";
import type { RequestOptions as SpaceRequestOptions } from "../../../services/spaceService";

const SpaceHistoryTab: React.FC = () => {
  const [reservedSpaces, setReservedSpaces] = React.useState<any[]>([]);
  const [reservedSpaceFiltersForm, setReservedSpaceFiltersForm] = React.useState<SpaceRequestOptions>({});
  const [reservedSpaceFilters, setReservedSpaceFilters] = React.useState<SpaceRequestOptions>({});
  const [searchDebounceTimeout, setSearchDebounceTimeout] = React.useState<NodeJS.Timeout | null>(null);
  const [nameSearchValue, setNameSearchValue] = React.useState<string>('');
  const [spaceTypesDomain, setSpaceTypesDomain] = React.useState<string[]>([]);
  const [buildingsDomain, setBuildingsDomain] = React.useState<Array<{code: number, name: string}>>([]);

  // Fetch space types and buildings domain data on mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const [spaceTypes, buildings] = await Promise.all([
          getSpaceTypesDomain(),
          getBuildingsDomain()
        ]);
        setSpaceTypesDomain(spaceTypes);
        setBuildingsDomain(buildings);
      } catch (error) {
        console.error("Error fetching domain data:", error);
      }
    };

    fetchDomains();
  }, []);

  // Effect to fetch reserved spaces history.
  useEffect(() => {
    const fetchReservedSpaces = async () => {
      const response = await getReservedSpaceHistory(reservedSpaceFilters);
      if (response) {
        setReservedSpaces(response);
      }
    };

    fetchReservedSpaces();
  }, [reservedSpaceFilters]);

  const handleNameSearch = useCallback((searchValue: string) => {
    setNameSearchValue(searchValue);
    
    // Clear existing timeout
    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }

    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      // Update the reservedSpaceFilters with the nameLike filter.
      setReservedSpaceFilters(prev => ({
        ...prev,
        nameLike: searchValue === '' ? undefined : searchValue
      }));
    }, 500); // 500ms delay

    setSearchDebounceTimeout(newTimeout);
  }, [searchDebounceTimeout]);

  const handleFilterFormChange = (key: keyof SpaceRequestOptions, value: any) => {
    setReservedSpaceFiltersForm(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  const handleDateTimeChange = (isStartDate: boolean, date: string, time: string) => {
    if (date && time) {
      const isoString = createISOStringFromDateTime(date, time);
      handleFilterFormChange(isStartDate ? 'startDate' : 'endDate', isoString);
    } else if (date) {
      const isoString = createISOStringFromDate(date, isStartDate);
      handleFilterFormChange(isStartDate ? 'startDate' : 'endDate', isoString);
    } else {
      handleFilterFormChange(isStartDate ? 'startDate' : 'endDate', undefined);
    }
  };

  const applyFilters = () => {
    setReservedSpaceFilters(reservedSpaceFiltersForm);
  }

  const clearFilters = () => {
    setReservedSpaceFilters({});
    setReservedSpaceFiltersForm({});
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
            {getRoles()?.includes('ROLE_ADMIN') && (
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  id="email"
                  value={reservedSpaceFiltersForm.email || ''}
                  onChange={(e) => handleFilterFormChange('email', e.target.value)}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="type" className="form-label">Tipo</label>
              <select
                className="form-select form-select-sm"
                id="type"
                value={reservedSpaceFiltersForm.type || ''}
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
                value={reservedSpaceFiltersForm.capacity || ''}
                onChange={(e) => handleFilterFormChange('capacity', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Capacidad mínima"
                min="1"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="building" className="form-label">Edificio</label>
              <select
                className="form-select form-select-sm"
                id="building"
                value={reservedSpaceFiltersForm.building || ''}
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
              <label htmlFor="startDate" className="form-label">Fecha inicio</label>
              <div className="row g-1">
                <div className="col-7">
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    id="startDate"
                    value={getDateFromISO(reservedSpaceFiltersForm.startDate)}
                    onChange={(e) => handleDateTimeChange(true, e.target.value, getTimeFromISO(reservedSpaceFiltersForm.startDate))}
                  />
                </div>
                <div className="col-5">
                  <input
                    type="time"
                    className="form-control form-control-sm"
                    value={getTimeFromISO(reservedSpaceFiltersForm.startDate)}
                    onChange={(e) => handleDateTimeChange(true, getDateFromISO(reservedSpaceFiltersForm.startDate), e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">Fecha fin</label>
              <div className="row g-1">
                <div className="col-7">
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    id="endDate"
                    value={getDateFromISO(reservedSpaceFiltersForm.endDate)}
                    onChange={(e) => handleDateTimeChange(false, e.target.value, getTimeFromISO(reservedSpaceFiltersForm.endDate))}
                  />
                </div>
                <div className="col-5">
                  <input
                    type="time"
                    className="form-control form-control-sm"
                    value={getTimeFromISO(reservedSpaceFiltersForm.endDate)}
                    onChange={(e) => handleDateTimeChange(false, getDateFromISO(reservedSpaceFiltersForm.endDate), e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="isHandedOver" className="form-label">Estado de entrega</label>
              <select
                className="form-select form-select-sm"
                id="isHandedOver"
                value={
                  reservedSpaceFiltersForm.isHandedOver === undefined 
                    ? '' 
                    : reservedSpaceFiltersForm.isHandedOver 
                      ? 'true' 
                      : 'false'
                }
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterFormChange('isHandedOver', 
                    value === '' ? undefined : value === 'true'
                  );
                }}
              >
                <option value="">Ambos</option>
                <option value="false">No entregado</option>
                <option value="true">Entregado</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="isReturned" className="form-label">Estado de retorno</label>
              <select
                className="form-select form-select-sm"
                id="isReturned"
                value={
                  reservedSpaceFiltersForm.isReturned === undefined 
                    ? '' 
                    : reservedSpaceFiltersForm.isReturned 
                      ? 'true' 
                      : 'false'
                }
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterFormChange('isReturned', 
                    value === '' ? undefined : value === 'true'
                  );
                }}
              >
                <option value="">Ambos</option>
                <option value="false">No devuelto</option>
                <option value="true">Devuelto</option>
              </select>
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
          <h2 className="text-secondary">Espacios Reservados</h2>
          
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
            {/*
              {
                "code_resspace": 22,
                "name_building": "Edificio 2",
                "code_space": 9,
                "name_space": "Espacio 2-9",
                "type_space": "SALON",
                "capacity_space": 13,
                "day_resspace": "2025-03-10"
              }
            */}
            {reservedSpaces.map((resspace) => (
              <li key={resspace.code_resspace} className="list-group-item">
                {resspace.day_resspace} - <strong>[{resspace.code_space}] {resspace.name_space}</strong> ({resspace.type_space}, capacidad: {resspace.capacity_space}) - {resspace.name_building}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpaceHistoryTab;
