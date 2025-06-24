/**
 * Request mapping for the domain queries.
 * 
 * @author Nicolás Sabogal
 */
const GET_REQUEST_MAPPING =
    (import.meta.env.VITE_QUERY_API_URL || 'http://localhost:8082') +
    '/' + (import.meta.env.VITE_DOMAIN_QUERIES_REQUEST_MAPPING || 'api/domains');

/**
 * Fetches the list of buildings with code and name.
 * 
 * @return A promise that resolves to the buildings data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getBuildingsDomain(): Promise<any> {
    // Make the GET request to the API
    const REQUEST_URL = `${GET_REQUEST_MAPPING}/buildings`;
    const response = await fetch(
        REQUEST_URL, {
            method: "GET"
        }
    );

    // If the response is not ok, throw an error.
    if (!response.ok) {
        throw new Error(`Error fetching buildings: ${response.statusText}`);
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
 * Fetches the list of hardware types.
 * 
 * @return A promise that resolves to the hardware types data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getHardwareTypesDomain(): Promise<any> {
    // Make the GET request to the API
    const REQUEST_URL = `${GET_REQUEST_MAPPING}/hardware-types`;
    const response = await fetch(
        REQUEST_URL, {
            method: "GET"
        }
    );

    // If the response is not ok, throw an error.
    if (!response.ok) {
        throw new Error(`Error fetching hardware types: ${response.statusText}`);
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
 * Fetches the list of space types.
 * 
 * @return A promise that resolves to the space types data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getSpaceTypesDomain(): Promise<any> {
    // Make the GET request to the API
    const REQUEST_URL = `${GET_REQUEST_MAPPING}/space-types`;
    const response = await fetch(
        REQUEST_URL, {
            method: "GET"
        }
    );

    // If the response is not ok, throw an error.
    if (!response.ok) {
        throw new Error(`Error fetching space types: ${response.statusText}`);
    }

    // Parse the JSON response and return it
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error parsing JSON response: ${error}`);
    }
}
