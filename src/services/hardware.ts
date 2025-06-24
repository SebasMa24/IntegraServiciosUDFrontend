import { getToken } from "./auth";

const REQUEST_MAPPING =
    (import.meta.env.VITE_QUERY_API_URL || 'http://localhost:8082') +
    '/' + (import.meta.env.VITE_OPERATION_QUERIES_REQUEST_MAPPING || 'api/operations') +
    '/hardware';

export async function getHardwareHistory(
    email: string | undefined = undefined,
    nameLike: string | undefined = undefined,
    type: string | undefined = undefined,
    building: number | undefined = undefined,
    startDate: string | undefined = undefined,
    endDate: string | undefined = undefined,
    qSize: number | undefined = undefined,
    qPage: number | undefined = undefined,
    orderBy: string | undefined = undefined,
    ascOrder: boolean | undefined = undefined
): Promise<any> {
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
    const REQUEST_URL = `${REQUEST_MAPPING}?${params.toString()}`;
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
