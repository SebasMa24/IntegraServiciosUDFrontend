// {
//     "id": {
//         "building": {
//             "code": 1,
//             "faculty": {
//                 "name": "Medicina",
//                 "description": "Facultad de Medicina"
//             },
//             "name": "Edificio 1",
//             "phone": 6000001,
//             "address": "Dirección Edificio 1",
//             "email": "edificio1@example.com"
//         },
//         "code": 1
//     },
//     "type": {
//         "name": "LABORATORIO",
//         "description": "Laboratorio especializado"
//     },
//     "state": {
//         "name": "DISPONIBLE",
//         "description": "Recurso disponible para reserva"
//     },
//     "name": "Espacio 1-1",
//     "capacity": 24,
//     "schedule": [
//         {
//             "day": "TUESDAY",
//             "start": "18:00:00",
//             "end": "21:00:00"
//         },
//         {
//             "day": "MONDAY",
//             "start": "16:00:00",
//             "end": "19:00:00"
//         },
//         {
//             "day": "SATURDAY",
//             "start": "19:00:00",
//             "end": "21:00:00"
//         }
//     ],
//     "description": "Descripción del espacio 1-1"
// }

import React from 'react';

const SpaceDetails: React.FC = () => {
  return (
    <div className="container mt-4">
      <h1 className="text-primary">Detalles del Espacio</h1>
      <p>Aquí se mostrarán los detalles del espacio seleccionado.</p>
      {/* Aquí puedes agregar más detalles específicos del espacio */}
    </div>
  );
}

export default SpaceDetails;
