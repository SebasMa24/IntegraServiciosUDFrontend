import { troyaDevRequest } from "./requests";

const LOGIN_TIMEOUT = 60 * 60 * 1000; // 60 minutes

export interface TroyaDevResource {
    "recu_FECHA_REGISTRO": Date;
    "recu_ID": number;
    "tireid": number;
    "recu_NOMBRE": string;
};

export interface TroyaDevResourceType {
    "tire_ID": number,
    "tire_DESCRIPCION": string,
    "tire_FECHA_REGISTRO": Date,
    "tire_NOMBRE": string
}

export interface TroyaDevBooking {
    "usua_NOMBRES": string,
    "usua_APELLIDOS": string,
    "usua_CORREO": string,
    "rese_ID": number,
    "recu_NOMBRE": string,
    "rese_ESTADO": string,
    "usua_CLIENTE": number,
    "rese_CALIFICACION": number,
    "rese_FECHA_REGISTRO": Date
}

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
