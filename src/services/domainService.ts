import { queriesMgmtRequest } from "./requests";

/**
 * Request mapping for the domain queries.
 * 
 * @author Nicolás Sabogal
 */
const GET_REQUEST_MAPPING =
    '/' + (import.meta.env.VITE_DOMAIN_QUERIES_REQUEST_MAPPING || 'api/domains');

/**
 * Fetches the list of buildings with code and name.
 * 
 * @return A promise that resolves to the buildings data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getBuildingsDomain(): Promise<any> {
    const REQUEST_URL = `${GET_REQUEST_MAPPING}/buildings`;
    return queriesMgmtRequest({
        requestName: "getBuildingsDomain",
        endpoint: REQUEST_URL,
        method: "GET"
    });
}

/**
 * Fetches the list of hardware types.
 * 
 * @return A promise that resolves to the hardware types data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getHardwareTypesDomain(): Promise<any> {
    const REQUEST_URL = `${GET_REQUEST_MAPPING}/hardware-types`;
    return queriesMgmtRequest({
        requestName: "getHardwareTypesDomain",
        endpoint: REQUEST_URL,
        method: "GET"
    });
}

/**
 * Fetches the list of space types.
 * 
 * @return A promise that resolves to the space types data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getSpaceTypesDomain(): Promise<any> {
    const REQUEST_URL = `${GET_REQUEST_MAPPING}/space-types`;
    return queriesMgmtRequest({
        requestName: "getSpaceTypesDomain",
        endpoint: REQUEST_URL,
        method: "GET"
    });
}
