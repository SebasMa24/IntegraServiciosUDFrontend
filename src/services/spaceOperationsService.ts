export interface SpaceReservation {
  id?: string;
  building: number;
  resourceCode: number;
  requester: string;
  manager: string;
  start: string;
  end: string;
}

export interface ReturnData {
  conditionRate: number;
  serviceRate: number;
}

const API_BASE_URL = 'https://operationmanagement.onrender.com/api/operations/space';

class SpaceOperationsService {
  
  // GET /api/operations/space/availability
  async getAvailability(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/availability`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching space availability:', error);
      throw error;
    }
  }

  // GET /api/operations/space (obtener todas las reservas de espacios)
  async getReservations(): Promise<SpaceReservation[]> {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching space reservations:', error);
      throw error;
    }
  }

  // POST /api/operations/space (crear reserva de espacio)
  async createReservation(reservation: Omit<SpaceReservation, 'id'>): Promise<SpaceReservation> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating space reservation:', error);
      throw error;
    }
  }

  // DELETE /api/operations/space/{reservationid}
  async deleteReservation(reservationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${reservationId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting space reservation:', error);
      throw error;
    }
  }

  // POST /api/operations/space/{reservationid}/handOver
  async handOverSpace(reservationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${reservationId}/handOver`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in space handover:', error);
      throw error;
    }
  }

  // POST /api/operations/space/{reservationid}/return
  async returnSpace(reservationId: string, returnData: ReturnData): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${reservationId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(returnData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error returning space:', error);
      throw error;
    }
  }
}

// Exportar una instancia del servicio
export const spaceOperationsService = new SpaceOperationsService();
export default spaceOperationsService;