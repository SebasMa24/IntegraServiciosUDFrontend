import { getToken } from './auth';

/**
 * Request mapping for space operation queries.
 * 
 * @author Nicolás Sabogal
 */
const GET_REQUEST_MAPPING =
    (import.meta.env.VITE_QUERY_API_URL || 'http://localhost:8082') +
    '/' + (import.meta.env.VITE_OPERATION_QUERIES_REQUEST_MAPPING || 'api/operations') +
    '/space';

/**
 * Interface for request options when fetching space data.
 * This interface defines the parameters that can be used to filter and paginate the results.
 * 
 * @author Nicolás Sabogal
 */
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

/**
 * Fetches the history of reserved spaces.
 * 
 * @param options - Optional parameters to filter and paginate the results. See {@link RequestOptions} for details.
 * @returns A promise that resolves to the reserved space history data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
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

/**
 * Fetches the available spaces.
 * 
 * @param options - Optional parameters to filter and paginate the results. See {@link RequestOptions} for details.
 * @returns A promise that resolves to the available spaces data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
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

/**
 * Fetches the details of a reserved space by its ID.
 * 
 * @param spaceId - The ID of the reserved space to fetch details for.
 * @returns A promise that resolves to the reserved space details data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
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
