import React, { useEffect, useCallback } from 'react';
import { getAvailableHardware } from '../../../services/hardwareService';
import { getHardwareTypesDomain, getBuildingsDomain } from '../../../services/domainService';
import { createISOStringFromDateTime, getDateFromISO, getTimeFromISO } from '../../../utils/dateUtils';
import type { RequestOptions as HardwareRequestOptions } from '../../../services/hardwareService';
import { useNavigate } from 'react-router-dom';

const AvailableHardwareTab: React.FC = () => {
  const navigate = useNavigate();
  const [availableHardware, setAvailableHardware] = React.useState<any[]>([]);
  const [availableHardwareFiltersForm, setAvailableHardwareFiltersForm] = React.useState<HardwareRequestOptions>({});
  const [availableHardwareFilters, setAvailableHardwareFilters] = React.useState<HardwareRequestOptions>({getAll: true});
  const [searchDebounceTimeout, setSearchDebounceTimeout] = React.useState<NodeJS.Timeout | null>(null);
  const [nameSearchValue, setNameSearchValue] = React.useState<string>('');
  const [hardwareTypesDomain, setHardwareTypesDomain] = React.useState<string[]>([]);
  const [buildingsDomain, setBuildingsDomain] = React.useState<Array<{code: number, name: string}>>([]);

  // Fetch hardware types and buildings domain data
  React.useEffect(() => {
    const fetchDomains = async () => {
      try {
        const hardwareTypes = await getHardwareTypesDomain();
        setHardwareTypesDomain(hardwareTypes);
        const buildings = await getBuildingsDomain();
        setBuildingsDomain(buildings);
      } catch (error) {
        console.error('Error fetching domains:', error);
      }
    };
    fetchDomains();
  }, []); 

  // Fetch available hardware
  useEffect(() => {
    const fetchAvailableHardware = async () => {
      const response = await getAvailableHardware(availableHardwareFilters);
      if (response) {
        setAvailableHardware(response);
      }
    };

    fetchAvailableHardware();
  }, [availableHardwareFilters]);

  const handleNameSearch = useCallback((searchValue: string) => {
    setNameSearchValue(searchValue);

    // Clear existing timeout
    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }

    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      // Update the availableHardwareFilters with the nameLike filter.
      setAvailableHardwareFilters((prev) => ({
        ...prev,
        nameLike: searchValue,
      }));
    }, 500); // 500ms delay

    setSearchDebounceTimeout(newTimeout);
  }, [searchDebounceTimeout]);

  const handleFilterFormChange = (key: keyof HardwareRequestOptions, value: any) => {
    let filters = {...availableHardwareFiltersForm, [key]: value };

    // Set getAll based on date availability
    if (!filters.startDate && !filters.endDate) {
      filters.getAll = true;
    } else {
      filters.getAll = false;
    }

    setAvailableHardwareFiltersForm(filters);
  };

  const handleDateChange = (date: string) => {
    const startTime = getTimeFromISO(availableHardwareFiltersForm.startDate) || '00:00';
    const endTime = getTimeFromISO(availableHardwareFiltersForm.endDate) || '23:59';
    
    const filters = {
      ...availableHardwareFiltersForm,
      startDate: date ? createISOStringFromDateTime(date, startTime) : undefined,
      endDate: date ? createISOStringFromDateTime(date, endTime) : undefined,
    };

    setAvailableHardwareFiltersForm(filters);
  };

  const handleTimeChange = (timeKey: 'startTime' | 'endTime', time: string) => {
    const date = getSelectedDate();
    if (!date) return;

    const targetKey = timeKey === 'startTime' ? 'startDate' : 'endDate';
    
    const filters = {
      ...availableHardwareFiltersForm,
      [targetKey]: time ? createISOStringFromDateTime(date, time) : undefined,
    };

    // garantee that both startDate and endDate are set
    if (filters.startDate && !filters.endDate) {
      filters.endDate = createISOStringFromDateTime(date, '23:59');
    } else if (!filters.startDate && filters.endDate) {
      filters.startDate = createISOStringFromDateTime(date, '00:00');
    }

    // garantee that startDate is before endDate
    if (filters.startDate && filters.endDate && new Date(filters.startDate) > new Date(filters.endDate)) {
      filters.endDate = new Date(filters.startDate).toISOString();
    }

    setAvailableHardwareFiltersForm(filters);
  };

  const getSelectedDate = () => {
    return getDateFromISO(availableHardwareFiltersForm.startDate) || getDateFromISO(availableHardwareFiltersForm.endDate);
  };

  const applyFilters = () => {
    setAvailableHardwareFilters(availableHardwareFiltersForm);
  }

  const clearFilters = () => {
    setAvailableHardwareFilters({getAll: true});
    setAvailableHardwareFiltersForm({});
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
                value={availableHardwareFiltersForm.type || ''}
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
                value={availableHardwareFiltersForm.building || ''}
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
                value={getTimeFromISO(availableHardwareFiltersForm.startDate)}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="endTime" className="form-label">Hora fin</label>
              <input
                type="time"
                className="form-control form-control-sm"
                id="endTime"
                value={getTimeFromISO(availableHardwareFiltersForm.endDate)}
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
                  "code_building": 5,
                  "code_warehouse": 2,
                  "code_storedhw": 2,
                  "name_building": "Edificio 5",
                  "name_hardware": "Hardware 2",
                  "type_hardware": "Tipo Hardware 6"
              }
            */}
            {availableHardware.map((shw) => (
              <li
                key={`${shw.code_building}-${shw.code_warehouse}-${shw.code_storedhw}`}
                className="list-group-item list-group-item-action"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/availability/details/hardware/${shw.code_building}-${shw.code_warehouse}-${shw.code_storedhw}`)}
              >
                <strong>{shw.name_hardware}</strong> ({shw.type_hardware}) - {shw.name_building}, almacén {shw.code_warehouse}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvailableHardwareTab;
