/**
 * API Client
 * Centralized API client with mock/real API switching
 */

import { apiConfig } from '~/shared/config/api.config';
import type { ApiMode, ApiResponse, ApiError } from './types';

export class ApiClient {
  private mode: ApiMode;
  private baseURL: string;

  constructor(mode: ApiMode = 'mock') {
    const config = useRuntimeConfig();
    this.mode = mode || (process.env.NUXT_PUBLIC_API_MODE as ApiMode) || 'mock';
    this.baseURL = config.public.apiBaseUrl || apiConfig.baseURL;
  }

  /**
   * Get full API URL
   */
  private getApiUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseURL}/${cleanEndpoint}`;
  }

  /**
   * Make API request
   */
  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    if (this.mode === 'mock') {
      // In mock mode, we'll use mock handlers
      // This will be handled by individual services
      throw new Error('Mock mode should be handled by service layer');
    }

    const url = this.getApiUrl(endpoint);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error: ApiError = {
          message: response.statusText,
          code: `HTTP_${response.status}`,
        };
        throw error;
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.message || 'API request failed',
        code: error.code || 'REQUEST_ERROR',
        details: error,
      };
      throw apiError;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Get current mode
   */
  getMode(): ApiMode {
    return this.mode;
  }

  /**
   * Set mode
   */
  setMode(mode: ApiMode): void {
    this.mode = mode;
  }
}

// Singleton instance
let apiClientInstance: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    const mode = (process.env.NUXT_PUBLIC_API_MODE as ApiMode) || 'mock';
    apiClientInstance = new ApiClient(mode);
  }
  return apiClientInstance;
}

