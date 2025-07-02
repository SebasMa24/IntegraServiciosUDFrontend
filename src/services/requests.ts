import { getToken } from './auth';

/**
 * Request options interface for user, operation, query, and resource management.
 * This interface defines the structure of the options that can be passed to the request functions.
 * The requestName is an optional string that can be used to identify the request in error messages or logs.
 * The endpoint specifies the API endpoint to call (ignore the host part, which is defined in the request functions).
 * The method specifies the HTTP method to use (GET, POST, PUT, DELETE).
 * The params object can be used to pass query parameters to the request as a key-value pair object.
 * The body object can be used to pass the request body as a key-value pair object.
 * 
 * @author Nicolás Sabogal
 */
interface RequestOptions {
    requestName?: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: Record<string, any>;
    body?: Record<string, any>;
};

/**
 * Makes a request to the user management API.
 * 
 * @param options - The options for the request. See {@link RequestOptions} for details.
 * @returns Whatever the API endpoint returns, parsed as JSON if the response is of type application/json, else returns the response as text.
 * @throws {Error} If the request fails or if the response cannot be parsed as JSON.
 * @author Nicolás Sabogal
 */
export async function userMgmtRequest(
    options: RequestOptions
): Promise<any> {
    const baseUrl = import.meta.env.VITE_USER_API_URL || 'http://localhost:8080';
    return request(baseUrl, options);
};

/**
 * Makes a request to the operation management API.
 * 
 * @param options - The options for the request. See {@link RequestOptions} for details.
 * @returns Whatever the API endpoint returns, parsed as JSON if the response is of type application/json, else returns the response as text.
 * @throws {Error} If the request fails or if the response cannot be parsed as JSON.
 * @author Nicolás Sabogal
 */
export async function operationMgmtRequest(
    options: RequestOptions
): Promise<any> {
    const baseUrl = import.meta.env.VITE_OPERATION_API_URL || 'http://localhost:8081';
    return request(baseUrl, options);
};

/**
 * Makes a request to the queries management API.
 * 
 * @param options - The options for the request. See {@link RequestOptions} for details.
 * @returns Whatever the API endpoint returns, parsed as JSON if the response is of type application/json, else returns the response as text.
 * @throws {Error} If the request fails or if the response cannot be parsed as JSON.
 * @author Nicolás Sabogal
 */
export async function queriesMgmtRequest(
    options: RequestOptions
): Promise<any> {
    const baseUrl = import.meta.env.VITE_QUERY_API_URL || 'http://localhost:8082'
    return request(baseUrl, options);
};

/**
 * Makes a request to the resource management API.
 * 
 * @param options - The options for the request. See {@link RequestOptions} for details.
 * @returns Whatever the API endpoint returns, parsed as JSON if the response is of type application/json, else returns the response as text.
 * @throws {Error} If the request fails or if the response cannot be parsed as JSON.
 * @author Nicolás Sabogal
 */
export async function resourceMgmtRequest(
    options: RequestOptions
): Promise<any> {
    const baseUrl = import.meta.env.VITE_RESOURCE_API_URL || 'http://localhost:8083';
    return request(baseUrl, options);
};

/**
 * Makes a generic request to the specified base URL with the given options.
 * 
 * @param baseUrl - The base URL of the API to call.
 * @param options - The options for the request. See {@link RequestOptions} for details.
 * @returns Whatever the API endpoint returns, parsed as JSON if the response is of type application/json, else returns the response as text.
 * @throws {Error} If the request fails or if the response cannot be parsed as JSON.
 * @author Nicolás Sabogal
 */
async function request(
    baseUrl: string,
    options: RequestOptions
): Promise<any> {
    // Construct the full URL with parameters.
    let url: string = `${baseUrl}${options.endpoint}`;
    if (options.params && Object.keys(options.params).length > 0) {
        // Filter out undefined and null values
        const filteredParams = Object.fromEntries(
            Object.entries(options.params).filter(([_, value]) => value !== undefined && value !== null)
        );
        if (Object.keys(filteredParams).length > 0) {
            url += '?' + new URLSearchParams(filteredParams).toString();
        }
    }

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
        const errorText = await response.text();
        throw new Error(`Error in request ${options.requestName}: (${response.status})${response.statusText} ${errorText}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
        try {
            const text = await response.text();
            // Handle empty response body
            if (!text || text.trim() === '') {
                return null;
            }
            return JSON.parse(text);
        } catch (error) {
            throw new Error(`Error parsing JSON response in request ${options.requestName}: ${error}`);
        }
    }
    
    // For non-JSON responses, return as text
    const textResponse = await response.text();
    return textResponse || null;
};
