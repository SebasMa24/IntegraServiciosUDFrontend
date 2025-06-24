import { getToken } from './auth';

const GET_REQUEST_MAPPING =
    (import.meta.env.VITE_QUERY_API_URL || 'http://localhost:8082') +
    '/' + (import.meta.env.VITE_OPERATION_QUERIES_REQUEST_MAPPING || 'api/operations') +
    '/space';

interface RequestOptions {
    email?: string;
    nameLike?: string;
    type?: string;
    capacity?: number;
    building?: number;
    startDate?: string;
    endDate?: string;
    getAll?: boolean;
    qSize?: number;
    qPage?: number;
    orderBy?: string;
    ascOrder?: boolean;
}

export async function getReservedSpaceHistory(options: RequestOptions = {}): Promise<any> {
    // Construct the parameters for the request
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options)) {
        if (value !== undefined) {
            params.append(key, value.toString());
        }
    }

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

    // Check for errors in the response
    if (!response.ok) {
        throw new Error(`Error fetching reserved space history: ${response.statusText}`);
    }

    // Parse and return the JSON response
    return response.json();
}

export async function getAvailableSpaces(options: RequestOptions = {}): Promise<any> {
    // Construct the parameters for the request
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options)) {
        if (value !== undefined) {
            params.append(key, value.toString());
        }
    }

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

    // Check for errors in the response
    if (!response.ok) {
        throw new Error(`Error fetching available spaces: ${response.statusText}`);
    }

    // Parse and return the JSON response
    return response.json();
}

export async function getReservedSpaceDetails(spaceId: bigint): Promise<any> {
    // Make the GET request to the API
    const REQUEST_URL = `${GET_REQUEST_MAPPING}/${spaceId}`;
    const response = await fetch(
            REQUEST_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getToken()}`,
                },
            }
        );

    // Check for errors in the response
    if (!response.ok) {
        throw new Error(`Error fetching reserved space details: ${response.statusText}`);
    }

    // Parse and return the JSON response
    return response.json();
}
