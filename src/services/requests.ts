import { getToken } from './auth';

interface RequestOptions {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: Record<string, any>;
    body?: Record<string, any>;
    requestName?: string;
};

export async function userMgmtRequest(
    options: RequestOptions
): Promise<any> {
    const baseUrl = import.meta.env.VITE_USER_API_URL || 'http://localhost:8080';
    return request(baseUrl, options);
};

export async function operationMgmtRequest(
    options: RequestOptions
): Promise<any> {
    const baseUrl = import.meta.env.VITE_OPERATION_API_URL || 'http://localhost:8081';
    return request(baseUrl, options);
};

export async function queriesMgmtRequest(
    options: RequestOptions
): Promise<any> {
    const baseUrl = import.meta.env.VITE_QUERY_API_URL || 'http://localhost:8082'
    return request(baseUrl, options);
};

export async function resourceMgmtRequest(
    options: RequestOptions
): Promise<any> {
    const baseUrl = import.meta.env.VITE_RESOURCE_API_URL || 'http://localhost:8083';
    return request(baseUrl, options);
};

async function request(
    baseUrl: string,
    options: RequestOptions
): Promise<any> {
    // Construct the full URL with parameters.
    let url: string = `${baseUrl}${options.endpoint}`;
    if (options.params && Object.keys(options.params).length > 0)
        url += '?' + new URLSearchParams(options.params).toString();

    // Set up headers for the request.
    let headers: Record<string, string> = {};
    if (getToken())
        headers['Authorization'] = `Bearer ${getToken()}`;
    if (options.body && Object.keys(options.body).length > 0)
        headers['Content-Type'] = 'application/json';

    // Make the fetch request.
    const response = await fetch(
        url, {
            method: options.method,
            headers,
            body: JSON.stringify(options.body),
        }
    );

    // If the response is not ok, throw an error.
    if (!response.ok) {
        throw new Error(`Error in request ${options.requestName}: ${response.statusText}`);
    }

    // Parse the JSON response and return it.
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error parsing JSON response in request ${options.requestName}: ${error}`);
    }
};
