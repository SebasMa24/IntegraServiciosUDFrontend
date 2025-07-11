export interface Reservation {
  id?: string;
  building: number;
  resourceCode: number;
  storedResourceCode: number;
  requester: string;
  manager: string;
  start: string;
  end: string;
}

export interface ReturnData {
  conditionRate: number;
  serviceRate: number;
}

const API_BASE_URL = 'https://operationmanagement.onrender.com/api/operations/hardware';

class OperationsService {
  
  // GET /api/operations/hardware/availability
  async getAvailability(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/availability`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  }

  // GET /api/operations/hardware/email
  async getReservations(): Promise<Reservation[]> {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  }

  // POST /api/operations/hardware (crear reserva)
  async createReservation(reservation: Omit<Reservation, 'id'>): Promise<Reservation> {
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
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  // DELETE /api/operations/hardware/{reservationid}
  async deleteReservation(reservationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${reservationId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  }

  // POST /api/operations/hardware/{reservationid}/handOver
  async handOverHardware(reservationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${reservationId}/handOver`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in handover:', error);
      throw error;
    }
  }

  // POST /api/operations/hardware/{reservationid}/return
  async returnHardware(reservationId: string, returnData: ReturnData): Promise<void> {
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
      console.error('Error returning hardware:', error);
      throw error;
    }
  }
}

// Exportar una instancia del servicio
export const operationsService = new OperationsService();
export default operationsService;