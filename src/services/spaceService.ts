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
    // Extract options with default values
    const {
        email,
        nameLike,
        type,
        capacity,
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
    if (capacity !== undefined) params.append("capacity", capacity.toString());
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

    // Check for errors in the response
    if (!response.ok) {
        throw new Error(`Error fetching reserved space history: ${response.statusText}`);
    }

    // Parse and return the JSON response
    return response.json();
}

export async function getAvailableSpaces(options: RequestOptions = {}): Promise<any> {
    // Extract options with default values
    const {
        email,
        nameLike,
        type,
        capacity,
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
    if (email) params.append("email", email);
    if (nameLike) params.append("nameLike", nameLike);
    if (type) params.append("type", type);
    if (capacity !== undefined) params.append("capacity", capacity.toString());
    if (building !== undefined) params.append("building", building.toString());
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (getAll) params.append("getAll", "true");
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
