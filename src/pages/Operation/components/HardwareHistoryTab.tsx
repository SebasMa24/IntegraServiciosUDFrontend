import React, { useEffect } from "react";
import { getReservedHardwareHistory } from "../../../services/hardwareService";
import type { RequestOptions as HardwareRequestOptions } from "../../../services/hardwareService";

const HardwareHistoryTab: React.FC = () => {
  const [reservedHardware, setReservedHardware] = React.useState<any[]>([]);
  const [reservedHardwareFilters, setReservedHardwareFilters] = React.useState<HardwareRequestOptions>({
  });

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

  return (
    <div className="tab-pane fade show active">
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
    </div>
  );
};

export default HardwareHistoryTab;
