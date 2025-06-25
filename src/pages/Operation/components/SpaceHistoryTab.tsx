import React, { useEffect } from "react";
import { getReservedSpaceHistory } from "../../../services/spaceService";
import type { RequestOptions as SpaceRequestOptions } from "../../../services/spaceService";

const SpaceHistoryTab: React.FC = () => {
  const [reservedSpaces, setReservedSpaces] = React.useState<any[]>([]);
  const [reservedSpaceFilters, setReservedSpaceFilters] = React.useState<SpaceRequestOptions>({
  });

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

  return (
    <div className="tab-pane fade show active">
      <h2 className="text-secondary">Espacios Reservados</h2>
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

export default SpaceHistoryTab;
