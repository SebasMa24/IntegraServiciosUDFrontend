import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid, getToken } from "../services/auth";
import { getReservedHardwareHistory } from "../services/hardwareService";
import type { RequestOptions as HardwareRequestOptions } from "../services/hardwareService"
import { getReservedSpaceHistory } from "../services/spaceService";
import type { RequestOptions as SpaceRequestOptions } from "../services/spaceService";

const Operation: React.FC = () => {

  const [reservedHardware, setReservedHardware] = React.useState<any[]>([]);
  const [reservedHardwareFilters, setReservedHardwareFilters] = React.useState<HardwareRequestOptions>({
  });

  const [reservedSpaces, setReservedSpaces] = React.useState<any[]>([]);
  const [reservedSpaceFilters, setReservedSpaceFilters] = React.useState<SpaceRequestOptions>({
  });

  const navigate = useNavigate();
  useEffect(() => {
      const token = getToken();
      
      if (!token || !isTokenValid(token)) {
        // Si no hay token o el token ha expirado, redirigir al login
        navigate("/login");
      }
  }, [navigate]);  

  // Efect to fetch reserved hardware history.
  useEffect(() => {
    const fetchReservedHardware = async () => {
      const response = await getReservedHardwareHistory(reservedHardwareFilters);
      if (response) {
        setReservedHardware(response);
      }
    };

    fetchReservedHardware();
  }, [reservedHardwareFilters]);

  // Efect to fetch reserved spaces history.
  useEffect(() => {
    const fetchReservedSpaces = async () => {
      const response = await getReservedSpaceHistory(reservedSpaceFilters);
      if (response) {
        setReservedSpaces(response);
      }
    };

    fetchReservedSpaces();
  }, [reservedSpaceFilters]);
  
  return (
      <div className="container mt-4">
        <h1 className="text-primary">Reservas</h1>
        <h2 className="text-secondary">Hardware Reservado</h2>
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
        <h2 className="text-secondary mt-4">Espacios Reservados</h2>
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
    );
  };

export default Operation;
