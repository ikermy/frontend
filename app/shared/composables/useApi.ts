/**
 * API Composable
 * Centralized API client with configuration
 */

import { apiConfig } from "~/shared/config/api.config";

export function useApi() {
  const config = useRuntimeConfig();
  
  /**
   * Get full API URL
   */
  const getApiUrl = (endpoint: string): string => {
    const baseURL = config.public.apiBaseUrl || apiConfig.baseURL;
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    return `${baseURL}/${cleanEndpoint}`;
  };

  /**
   * Make API request
   */
  const apiRequest = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = getApiUrl(endpoint);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  };

  /**
   * GET request
   */
  const get = <T = any>(endpoint: string): Promise<T> => {
    return apiRequest<T>(endpoint, { method: "GET" });
  };

  /**
   * POST request
   */
  const post = <T = any>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  /**
   * PUT request
   */
  const put = <T = any>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  /**
   * PATCH request
   */
  const patch = <T = any>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  /**
   * DELETE request
   */
  const del = <T = any>(endpoint: string): Promise<T> => {
    return apiRequest<T>(endpoint, { method: "DELETE" });
  };

  return {
    getApiUrl,
    apiRequest,
    get,
    post,
    put,
    patch,
    delete: del,
    endpoints: apiConfig.endpoints,
  };
}

