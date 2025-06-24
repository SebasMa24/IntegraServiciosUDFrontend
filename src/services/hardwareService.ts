import { getToken } from "./auth";

/**
 * Request mapping for hardware operation queries.
 * 
 * @author Nicolás Sabogal
 */
const GET_REQUEST_MAPPING =
    (import.meta.env.VITE_QUERY_API_URL || 'http://localhost:8082') +
    '/' + (import.meta.env.VITE_OPERATION_QUERIES_REQUEST_MAPPING || 'api/operations') +
    '/hardware';

/**
 * Interface for request options when fetching hardware data.
 * This interface defines the parameters that can be used to filter and paginate the results.
 * 
 * @author Nicolás Sabogal
 */
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

/**
 * Fetches the history of reserved hardware.
 * 
 * @param options - Optional parameters to filter and paginate the results. See {@link RequestOptions} for details.
 * @returns A promise that resolves to the reserved hardware history data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getReservedHardwareHistory(options: RequestOptions = {}): Promise<any> {
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

/**
 * Fetches the available hardware.
 * 
 * @param options - Optional parameters to filter and paginate the results. See {@link RequestOptions} for details.
 * @returns A promise that resolves to the available hardware data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getAvailableHardware(options: RequestOptions = {}): Promise<any> {
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

/**
 * Fetches the details of a reserved hardware item by its ID.
 * 
 * @param hardwareId - The ID of the reserved hardware item.
 * @returns A promise that resolves to the details of the reserved hardware.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
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
