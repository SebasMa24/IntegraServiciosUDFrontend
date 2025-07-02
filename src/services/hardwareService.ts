import { queriesMgmtRequest } from "./requests";

/**
 * Request mapping for hardware operation queries.
 * 
 * @author Nicolás Sabogal
 */
const GET_OPERATIONS_REQUEST_MAPPING =
    '/' + (import.meta.env.VITE_OPERATION_QUERIES_REQUEST_MAPPING || 'api/operations') +
    '/hardware';

/**
 * Request mapping for resource queries related to hardware.
 * 
 * @author Nicolás Sabogal
 */
const GET_RESOURCES_REQUEST_MAPPING =
    '/' + (import.meta.env.VITE_RESOURCE_QUERIES_REQUEST_MAPPING || 'api/resources') +
    '/hardware';

/**
 * Interface for request options when fetching hardware data.
 * This interface defines the parameters that can be used to filter and paginate the results.
 * 
 * @author Nicolás Sabogal
 */
export interface RequestOptions {
    email?: string;         // Only for reserved hardware history
    nameLike?: string;
    type?: string;
    building?: number;
    startDate?: string;
    endDate?: string;
    getAll?: boolean;       // Only for available hardware
    isHandedOver?: boolean; // Only for reserved hardware history
    isReturned?: boolean;   // Only for reserved hardware history
    qSize?: number;
    qPage?: number;
    orderBy?: string;
    ascOrder?: boolean;
}

/**
 * Fetches the history of reserved hardware.
 * 
 * @param params - Optional parameters to filter and paginate the results. See {@link RequestOptions} for details.
 * @returns A promise that resolves to the reserved hardware history data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getReservedHardwareHistory(params: RequestOptions = {}): Promise<any> {
    const REQUEST_URL = GET_OPERATIONS_REQUEST_MAPPING;
    return queriesMgmtRequest({
        requestName: "getReservedHardwareHistory",
        endpoint: REQUEST_URL,
        method: "GET",
        params
    });
}

/**
 * Fetches the available hardware.
 * 
 * @param params - Optional parameters to filter and paginate the results. See {@link RequestOptions} for details.
 * @returns A promise that resolves to the available hardware data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getAvailableHardware(params: RequestOptions = {}): Promise<any> {
    const REQUEST_URL = `${GET_OPERATIONS_REQUEST_MAPPING}/availability`;
    return queriesMgmtRequest({
        requestName: "getAvailableHardware",
        endpoint: REQUEST_URL,
        method: "GET",
        params
    });
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
    const REQUEST_URL = `${GET_OPERATIONS_REQUEST_MAPPING}/${hardwareId}`;
    return queriesMgmtRequest({
        requestName: "getReservedHardwareDetails",
        endpoint: REQUEST_URL,
        method: "GET"
    });
}

/**
 * Fetches the stored hardware details for a specific building and warehouse.
 * 
 * @param buildingId - The ID of the building.
 * @param warehouseId - The ID of the warehouse.
 * @param hardwareId - The ID of the hardware.
 * @returns A promise that resolves to the stored hardware details.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getStoredHardwareDetails(buildingId: number, warehouseId: number, hardwareId: number): Promise<any> {
    const REQUEST_URL = `${GET_RESOURCES_REQUEST_MAPPING}/${buildingId}-${warehouseId}-${hardwareId}`;
    return queriesMgmtRequest({
        requestName: "getStoredHardwareDetails",
        endpoint: REQUEST_URL,
        method: "GET"
    });
}
