import React, { useEffect, useCallback } from "react";
import { getReservedHardwareHistory } from "../../../services/hardwareService";
import { getHardwareTypesDomain, getBuildingsDomain } from "../../../services/domainService";
import type { RequestOptions as HardwareRequestOptions } from "../../../services/hardwareService";

const HardwareHistoryTab: React.FC = () => {
  const [reservedHardware, setReservedHardware] = React.useState<any[]>([]);
  const [reservedHardwareFiltersForm, setReservedHardwareFiltersForm] = React.useState<HardwareRequestOptions>({});
  const [reservedHardwareFilters, setReservedHardwareFilters] = React.useState<HardwareRequestOptions>({});
  const [searchDebounceTimeout, setSearchDebounceTimeout] = React.useState<NodeJS.Timeout | null>(null);
  const [nameSearchValue, setNameSearchValue] = React.useState<string>('');
  const [hardwareTypesDomain, setHardwareTypesDomain] = React.useState<string[]>([]);
  const [buildingsDomain, setBuildingsDomain] = React.useState<Array<{code: number, name: string}>>([]);

  // Fetch hardware types and buildings domain data on mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const [hardwareTypes, buildings] = await Promise.all([
          getHardwareTypesDomain(),
          getBuildingsDomain()
        ]);
        setHardwareTypesDomain(hardwareTypes);
        setBuildingsDomain(buildings);
      } catch (error) {
        console.error("Error fetching domain data:", error);
      }
    };

    fetchDomains();
  }, []);

  // Effect to fetch reserved hardware history.
  useEffect(() => {
    const fetchReservedHardware = async () => {
      const response = await getReservedHardwareHistory(reservedHardwareFilters);
      if (response) {
        setReservedHardware(response);
      }
    };

    fetchReservedHardware();
  }, [reservedHardwareFilters]);

  const handleNameSearch = useCallback((searchValue: string) => {
    setNameSearchValue(searchValue);
    
    // Clear existing timeout
    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }

    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      // Update the reservedHardwareFilters with the nameLike filter.
      setReservedHardwareFilters(prev => ({
        ...prev,
        nameLike: searchValue === '' ? undefined : searchValue
      }));
    }, 500); // 500ms delay

    setSearchDebounceTimeout(newTimeout);
  }, [searchDebounceTimeout]);

  const handleFilterFormChange = (key: keyof HardwareRequestOptions, value: any) => {
    setReservedHardwareFiltersForm(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  const handleDateTimeChange = (dateKey: 'startDate' | 'endDate', date: string, time: string) => {
    if (date && time) {
      const isoString = new Date(`${date}T${time}`).toISOString();
      handleFilterFormChange(dateKey, isoString);
    } else if (date) {
      // If only date is provided, use start of day for startDate and end of day for endDate
      const timeDefault = dateKey === 'startDate' ? '00:00' : '23:59';
      const isoString = new Date(`${date}T${timeDefault}`).toISOString();
      handleFilterFormChange(dateKey, isoString);
    } else {
      handleFilterFormChange(dateKey, undefined);
    }
  };

  const getDateFromISO = (isoString?: string) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };

  const getTimeFromISO = (isoString?: string) => {
    if (!isoString) return '';
    return isoString.split('T')[1]?.substring(0, 5) || '';
  };

  const applyFilters = () => {
    setReservedHardwareFilters(reservedHardwareFiltersForm);
  }

  const clearFilters = () => {
    setReservedHardwareFilters({});
    setReservedHardwareFiltersForm({});
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
              {/* TODO: filter this field out if the user is not an admin. */}
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                id="email"
                value={reservedHardwareFiltersForm.email || ''}
                onChange={(e) => handleFilterFormChange('email', e.target.value)}
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="type" className="form-label">Tipo</label>
              <select
                className="form-select form-select-sm"
                id="type"
                value={reservedHardwareFiltersForm.type || ''}
                onChange={(e) => handleFilterFormChange('type', e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {hardwareTypesDomain.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="building" className="form-label">Edificio</label>
              <select
                className="form-select form-select-sm"
                id="building"
                value={reservedHardwareFiltersForm.building || ''}
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
                    value={getDateFromISO(reservedHardwareFiltersForm.startDate)}
                    onChange={(e) => handleDateTimeChange('startDate', e.target.value, getTimeFromISO(reservedHardwareFiltersForm.startDate))}
                  />
                </div>
                <div className="col-5">
                  <input
                    type="time"
                    className="form-control form-control-sm"
                    value={getTimeFromISO(reservedHardwareFiltersForm.startDate)}
                    onChange={(e) => handleDateTimeChange('startDate', getDateFromISO(reservedHardwareFiltersForm.startDate), e.target.value)}
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
                    value={getDateFromISO(reservedHardwareFiltersForm.endDate)}
                    onChange={(e) => handleDateTimeChange('endDate', e.target.value, getTimeFromISO(reservedHardwareFiltersForm.endDate))}
                  />
                </div>
                <div className="col-5">
                  <input
                    type="time"
                    className="form-control form-control-sm"
                    value={getTimeFromISO(reservedHardwareFiltersForm.endDate)}
                    onChange={(e) => handleDateTimeChange('endDate', getDateFromISO(reservedHardwareFiltersForm.endDate), e.target.value)}
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
                  reservedHardwareFiltersForm.isHandedOver === undefined 
                    ? '' 
                    : reservedHardwareFiltersForm.isHandedOver 
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
                  reservedHardwareFiltersForm.isReturned === undefined 
                    ? '' 
                    : reservedHardwareFiltersForm.isReturned 
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
          <h2 className="text-secondary">Hardware Reservado</h2>
          
          <div className="mb-3">
            <label htmlFor="nameLike" className="form-label">Buscar por nombre</label>
            <input
              type="text"
              className="form-control"
              id="nameLike"
              value={nameSearchValue}
              onChange={(e) => handleNameSearch(e.target.value)}
              placeholder="Buscar por nombre del hardware..."
            />
          </div>

          <ul className="list-group">
            {/*
              {
                "code_reshw": 39,
                "name_building": "Edificio 2",
                "code_warehouse": 2,
                "name_hardware": "Hardware 88",
                "type_hardware": "Tipo Hardware 4",
                "day_reshw": "2025-04-06"
              }
            */}
            {reservedHardware.map((reshw) => (
              <li key={reshw.code_reshw} className="list-group-item">
                {reshw.day_reshw} - <strong>{reshw.name_hardware}</strong> ({reshw.type_hardware}) - {reshw.name_building}, almacén {reshw.code_warehouse}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HardwareHistoryTab;
