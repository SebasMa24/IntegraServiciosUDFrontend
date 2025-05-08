import { jwtDecode } from 'jwt-decode';

// Función para verificar si el token es válido
export function isTokenValid(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000; // En segundos
    return decoded.exp && decoded.exp > now;
  } catch (error) {
    // Si el token no se puede decodificar o no tiene expiración
    return false;
  }
}

// Función para obtener el token del localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};

export function isLoggedIn(): boolean {
  const token = getToken();
  return token != null && isTokenValid(token);
}

// Función para eliminar el token (logout)
export const logout = (): void => {
  localStorage.removeItem("authToken");
};