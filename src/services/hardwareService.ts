import { getToken } from "./auth";

const GET_REQUEST_MAPPING =
    (import.meta.env.VITE_QUERY_API_URL || 'http://localhost:8082') +
    '/' + (import.meta.env.VITE_OPERATION_QUERIES_REQUEST_MAPPING || 'api/operations') +
    '/hardware';

interface RequestOptions {
    email?: string;
    nameLike?: string;
    type?: string;
    building?: number;
    startDate?: string;
    endDate?: string;
    getAll?: boolean;
    qSize?: number;
    qPage?: number;
    orderBy?: string;
    ascOrder?: boolean;
}

export async function getReservedHardwareHistory(options: RequestOptions = {}): Promise<any> {
    // Extract options with default values
    const {
        email,
        nameLike,
        type,
        building,
        startDate,
        endDate,
        qSize,
        qPage,
        orderBy,
        ascOrder
    } = options;

    // Construct the parameters for the request
    const params = new URLSearchParams();
    if (email) params.append("email", email);
    if (nameLike) params.append("nameLike", nameLike);
    if (type) params.append("type", type);
    if (building !== undefined) params.append("building", building.toString());
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (qSize !== undefined) params.append("qSize", qSize.toString());
    if (qPage !== undefined) params.append("qPage", qPage.toString());
    if (orderBy) params.append("orderBy", orderBy);
    if (ascOrder !== undefined) params.append("ascOrder", ascOrder.toString());

    // Make the GET request to the API
    const REQUEST_URL = `${GET_REQUEST_MAPPING}?${params.toString()}`;
    const response = await fetch(
            REQUEST_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getToken()}`,
                },
            }
        );

    // If the response is not ok, throw an error.
    if (!response.ok) {
        throw new Error(`Error fetching hardware history: ${response.statusText}`);
    }

    // Parse the JSON response and return it
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error parsing JSON response: ${error}`);
    }
}

export async function getAvailableHardware(options: RequestOptions = {}): Promise<any> {
    // Extract options with default values
    const {
        nameLike,
        type,
        building,
        startDate,
        endDate,
        getAll,
        qSize,
        qPage,
        orderBy,
        ascOrder
    } = options;

    // Construct the parameters for the request
    const params = new URLSearchParams();
    if (nameLike) params.append("nameLike", nameLike);
    if (type) params.append("type", type);
    if (building !== undefined) params.append("building", building.toString());
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (getAll !== undefined) params.append("getAll", getAll.toString());
    if (qSize !== undefined) params.append("qSize", qSize.toString());
    if (qPage !== undefined) params.append("qPage", qPage.toString());
    if (orderBy) params.append("orderBy", orderBy);
    if (ascOrder !== undefined) params.append("ascOrder", ascOrder.toString());

    // Make the GET request to the API
    const REQUEST_URL = `${GET_REQUEST_MAPPING}/availability?${params.toString()}`;
    const response = await fetch(
            REQUEST_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getToken()}`,
                },
            }
        );

    // If the response is not ok, throw an error.
    if (!response.ok) {
        throw new Error(`Error fetching available hardware: ${response.statusText}`);
    }

    // Parse the JSON response and return it
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error parsing JSON response: ${error}`);
    }
}

export async function getReservedHardwareDetails(hardwareId: bigint): Promise<any> {
    // Make the GET request to the API
    const REQUEST_URL = `${GET_REQUEST_MAPPING}/${hardwareId}`;
    const response = await fetch(
            REQUEST_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getToken()}`,
                },
            }
        );

    // If the response is not ok, throw an error.
    if (!response.ok) {
        throw new Error(`Error fetching reserved hardware details: ${response.statusText}`);
    }

    // Parse the JSON response and return it
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error parsing JSON response: ${error}`);
    }
}
