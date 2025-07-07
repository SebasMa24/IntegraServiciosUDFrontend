import { troyaDevRequest } from "./requests";

/**
 * Timeout duration for TroyaDev login sessions in milliseconds (60 minutes).
 * After this time, the stored token will be considered expired and a new login will be required.
 * 
 * @author Nicolás Sabogal
 */
const LOGIN_TIMEOUT = 60 * 60 * 1000; // 60 minutes

/**
 * Interface representing a TroyaDev resource.
 * Contains information about resources available in the TroyaDev system.
 * 
 * @interface TroyaDevResource
 * @author Nicolás Sabogal
 */
export interface TroyaDevResource {
    /** Registration date of the resource */
    "recu_FECHA_REGISTRO": Date;
    /** Unique identifier for the resource */
    "recu_ID": number;
    /** Type identifier for the resource */
    "tireid": number;
    /** Name of the resource */
    "recu_NOMBRE": string;
};

/**
 * Interface representing a TroyaDev resource type.
 * Contains information about the different types of resources available in the TroyaDev system.
 * 
 * @interface TroyaDevResourceType
 * @author Nicolás Sabogal
 */
export interface TroyaDevResourceType {
    /** Unique identifier for the resource type */
    "tire_ID": number,
    /** Description of the resource type */
    "tire_DESCRIPCION": string,
    /** Registration date of the resource type */
    "tire_FECHA_REGISTRO": Date,
    /** Name of the resource type */
    "tire_NOMBRE": string
}

/**
 * Interface representing a TroyaDev booking.
 * Contains information about bookings made in the TroyaDev system, including user and reservation details.
 * 
 * @interface TroyaDevBooking
 * @author Nicolás Sabogal
 */
export interface TroyaDevBooking {
    /** First name(s) of the user who made the booking */
    "usua_NOMBRES": string,
    /** Last name(s) of the user who made the booking */
    "usua_APELLIDOS": string,
    /** Email address of the user who made the booking */
    "usua_CORREO": string,
    /** Unique identifier for the reservation */
    "rese_ID": number,
    /** Name of the reserved resource */
    "recu_NOMBRE": string,
    /** Current status of the reservation */
    "rese_ESTADO": string,
    /** Client identifier for the user */
    "usua_CLIENTE": number,
    /** Rating given to the reservation (if any) */
    "rese_CALIFICACION": number,
    /** Registration date of the reservation */
    "rese_FECHA_REGISTRO": Date
}

/**
 * Performs authentication with the TroyaDev API and stores the received token in localStorage.
 * Uses environment variables for login credentials and handles the login process automatically.
 * 
 * @returns {Promise<void>} A promise that resolves when login is successful.
 * @throws {Error} If the login response does not contain a token.
 * @author Nicolás Sabogal
 */
async function logging(): Promise<void> {
    const LOGIN_URL = '/' + (import.meta.env.VITE_TROYA_DEV_LOGIN_URL || 'auth/login');
    const response = await troyaDevRequest({
        requestName: "login",
        endpoint: LOGIN_URL,
        method: "POST",
        body: {
            email: import.meta.env.VITE_TROYA_DEV_USERNAME,
            password: import.meta.env.VITE_TROYA_DEV_PASSWORD
        }
    });

    const data = response.data;
    const token = data.token;

    if (!token) {
        throw new Error("Login response does not contain a token");
    }

    localStorage.setItem("troyaDevToken", token);
}

/**
 * Retrieves a valid TroyaDev authentication token.
 * Checks if a stored token exists and is still valid (not expired).
 * If no valid token exists, performs a new login and returns the new token.
 * 
 * @returns {Promise<string | null>} A promise that resolves to the authentication token, or null if login fails.
 * @throws {Error} If the login process fails to retrieve a token.
 * @author Nicolás Sabogal
 */
async function getTroyaDevToken(): Promise<string | null> {
    const token = localStorage.getItem("troyaDevToken");
    const loginTime = localStorage.getItem("troyaDevLoginTime");

    if (token && loginTime && Date.now() - parseInt(loginTime) < LOGIN_TIMEOUT) {
        return token;
    }
    else {
        localStorage.removeItem("troyaDevToken");
        localStorage.removeItem("troyaDevLoginTime");
    }

    await logging();
    if (!localStorage.getItem("troyaDevToken")) {
        throw new Error("Failed to retrieve TroyaDev token after logging in");
    }

    localStorage.setItem("troyaDevLoginTime", Date.now().toString());
    return localStorage.getItem("troyaDevToken");
}

/**
 * Retrieves all available resources from the TroyaDev API.
 * Automatically handles authentication by obtaining a valid token before making the request.
 * 
 * @returns {Promise<TroyaDevResource[]>} A promise that resolves to an array of TroyaDev resources. See {@link TroyaDevResource}.
 * @throws {Error} If the request fails or authentication cannot be completed.
 * @author Nicolás Sabogal
 */
export async function getAllResources(): Promise<TroyaDevResource[]> {
    const endpoint = '/' + import.meta.env.VITE_TROYA_DEV_RESOURCE_ENDPOINT || '/resource/all';
    const token = await getTroyaDevToken();

    const response = await troyaDevRequest(
        {
            requestName: "getAllResources",
            endpoint: endpoint,
            method: "GET",
        },
        token
    );

    return response.data;
}

/**
 * Retrieves all bookings from the TroyaDev API.
 * Automatically handles authentication by obtaining a valid token before making the request.
 * 
 * @returns {Promise<TroyaDevBooking[]>} A promise that resolves to an array of TroyaDev bookings. See {@link TroyaDevBooking}.
 * @throws {Error} If the request fails or authentication cannot be completed.
 * @author Nicolás Sabogal
 */
export async function getAllBookings(): Promise<TroyaDevBooking[]> {
    const endpoint = '/' + import.meta.env.VITE_TROYA_DEV_BOOKING_ENDPOINT || '/booking/all';
    const token = await getTroyaDevToken();

    const response = await troyaDevRequest(
        {
            requestName: "getAllBookings",
            endpoint: endpoint,
            method: "GET",
        },
        token
    );

    return response.data;
}

/**
 * Retrieves all available resource types from the TroyaDev API.
 * Automatically handles authentication by obtaining a valid token before making the request.
 * 
 * @returns {Promise<TroyaDevResourceType[]>} A promise that resolves to an array of TroyaDev resource types. See {@link TroyaDevResourceType}.
 * @throws {Error} If the request fails or authentication cannot be completed.
 * @author Nicolás Sabogal
 */
export async function getAllResourceTypes(): Promise<TroyaDevResourceType[]> {
    const endpoint = '/' + import.meta.env.VITE_TROYA_DEV_RESOURCE_TYPE_ENDPOINT || '/resource/type/all';
    const token = await getTroyaDevToken();

    const response = await troyaDevRequest(
        {
            requestName: "getAllResourceTypes",
            endpoint: endpoint,
            method: "GET",
        },
        token
    );

    return response.data;
}
