// services/operationsService.ts

const API_BASE_URL = 'http://localhost:8080/api/operations';

// Tipos TypeScript para los datos
export interface HardwareReservation {
  building: number;
  resourceCode: number;
  storedResourceCode: number;
  requester: string;
  manager: string;
  start: string;
  end: string;
}

export interface SpaceReservation {
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

// Interfaz para respuestas de error estandarizadas
export interface ApiErrorResponse {
  message: string;
  status: number;
  timestamp?: string;
  path?: string;
}

class OperationsService {
  // Método helper para manejar respuestas y errores
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData: ApiErrorResponse = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const textError = await response.text();
          if (textError) {
            errorMessage = textError;
          }
        }
      } catch (parseError) {
        // Si no se puede parsear el error, usar el mensaje por defecto
        console.warn('No se pudo parsear el error de la respuesta:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    // Si la respuesta es exitosa pero no tiene contenido
    if (response.status === 204 || !contentType) {
      return {} as T;
    }

    try {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text() as unknown as T;
      }
    } catch (parseError) {
      throw new Error('Error al procesar la respuesta del servidor');
    }
  }

  // Método helper para realizar peticiones con timeout y retry
  private async fetchWithTimeout(
    url: string, 
    options: RequestInit, 
    timeout: number = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('La solicitud ha tardado demasiado tiempo. Verifique su conexión a internet.');
        }
        if (error.message.includes('fetch')) {
          throw new Error('No se pudo conectar con el servidor. Verifique que el servidor esté ejecutándose.');
        }
      }
      
      throw error;
    }
  }

  // Crear reserva de hardware
  async createHardwareReservation(data: HardwareReservation) {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/hardware`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear reserva de hardware: ${error.message}`);
      }
      throw new Error('Error desconocido al crear reserva de hardware');
    }
  }

  // Crear reserva de espacio
  async createSpaceReservation(data: SpaceReservation) {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/space`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear reserva de espacio: ${error.message}`);
      }
      throw new Error('Error desconocido al crear reserva de espacio');
    }
  }

  // Eliminar reserva de hardware
  async deleteHardwareReservation(reservationId: string) {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/hardware/${encodeURIComponent(reservationId)}`, 
        {
          method: 'DELETE',
        }
      );
      
      await this.handleResponse(response);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al eliminar reserva de hardware: ${error.message}`);
      }
      throw new Error('Error desconocido al eliminar reserva de hardware');
    }
  }

  // Eliminar reserva de espacio
  async deleteSpaceReservation(reservationId: string) {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/space/${encodeURIComponent(reservationId)}`, 
        {
          method: 'DELETE',
        }
      );
      
      await this.handleResponse(response);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al eliminar reserva de espacio: ${error.message}`);
      }
      throw new Error('Error desconocido al eliminar reserva de espacio');
    }
  }

  // Entrega de hardware
  async handOverHardware(reservationId: string) {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/hardware/${encodeURIComponent(reservationId)}/handOver`, 
        {
          method: 'POST',
        }
      );
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al entregar hardware: ${error.message}`);
      }
      throw new Error('Error desconocido al entregar hardware');
    }
  }

  // Entrega de espacio
  async handOverSpace(reservationId: string) {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/space/${encodeURIComponent(reservationId)}/handOver`, 
        {
          method: 'POST',
        }
      );
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al entregar espacio: ${error.message}`);
      }
      throw new Error('Error desconocido al entregar espacio');
    }
  }

  // Devolución de hardware
  async returnHardware(reservationId: string, returnData: ReturnData) {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/hardware/${encodeURIComponent(reservationId)}/return`, 
        {
          method: 'POST',
          body: JSON.stringify(returnData),
        }
      );
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al devolver hardware: ${error.message}`);
      }
      throw new Error('Error desconocido al devolver hardware');
    }
  }

  // Devolución de espacio
  async returnSpace(reservationId: string, returnData: ReturnData) {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/space/${encodeURIComponent(reservationId)}/return`, 
        {
          method: 'POST',
          body: JSON.stringify(returnData),
        }
      );
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al devolver espacio: ${error.message}`);
      }
      throw new Error('Error desconocido al devolver espacio');
    }
  }

  // Método para verificar el estado del servidor
  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/health`, {
        method: 'GET',
      }, 5000);
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const operationsService = new OperationsService();