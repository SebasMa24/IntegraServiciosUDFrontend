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

/**
 * Obtiene los roles del usuario desde el token JWT almacenado en localStorage.
 *
 * @returns Los roles del usuario desde el token JWT almacenado en localStorage o null si no hay token o no se puede decodificar.
 * @author Nicolás Sabogal
 */
export const getRoles = (): string[] | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.roles || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getSub = (): string | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.sub || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export function isLoggedIn(): boolean {
  const token = getToken();
  return token != null && isTokenValid(token);
}

// Función para eliminar el token (logout)
export const logout = (): void => {
  localStorage.removeItem("authToken");
};