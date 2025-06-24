import { queriesMgmtRequest } from './requests';

/**
 * Request mapping for space operation queries.
 * 
 * @author Nicolás Sabogal
 */
const GET_REQUEST_MAPPING =
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
 * @param params - Optional parameters to filter and paginate the results. See {@link RequestOptions} for details.
 * @returns A promise that resolves to the reserved space history data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getReservedSpaceHistory(params: RequestOptions = {}): Promise<any> {
    const REQUEST_URL = GET_REQUEST_MAPPING;
    return queriesMgmtRequest({
        requestName: "getReservedSpaceHistory",
        endpoint: REQUEST_URL,
        method: "GET",
        params
    });
}

/**
 * Fetches the available spaces.
 * 
 * @param params - Optional parameters to filter and paginate the results. See {@link RequestOptions} for details.
 * @returns A promise that resolves to the available spaces data.
 * @throws An error if the request fails or if the response cannot be parsed.
 * @author Nicolás Sabogal
 */
export async function getAvailableSpaces(params: RequestOptions = {}): Promise<any> {
    const REQUEST_URL = `${GET_REQUEST_MAPPING}/availability`;
    return queriesMgmtRequest({
        requestName: "getAvailableSpaces",
        endpoint: REQUEST_URL,
        method: "GET",
        params
    });
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
    const REQUEST_URL = `${GET_REQUEST_MAPPING}/${spaceId}`;
    return queriesMgmtRequest({
        requestName: "getReservedSpaceDetails",
        endpoint: REQUEST_URL,
        method: "GET"
    });
}
