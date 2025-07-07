import React, { useEffect, useState } from 'react';
import { getAllResources, getAllBookings, getAllResourceTypes } from '../services/TroyaDevService';
import type { TroyaDevResource, TroyaDevBooking, TroyaDevResourceType } from '../services/TroyaDevService';

const TroyaDev: React.FC = () => {
  const [allResources, setAllResources] = useState<TroyaDevResource[]>([]);
  const [resourceTypes, setResourceTypes] = useState<TroyaDevResourceType[]>([]);
  const [bookings, setBookings] = useState<TroyaDevBooking[]>([]);

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

  return (
    <div className="container mt-4">
      <h2>TroyaDev Tab</h2>
      <p> En esta pag va a salir lo de la integración. </p>
      
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
