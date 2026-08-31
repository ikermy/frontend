/**
 * API Client
 * Centralized API client with mock/real API switching
 */

import { apiConfig, serviceURLs } from '~/shared/config/api.config';
import type { ApiMode, ApiResponse, ApiError } from './types';

// Целевые сервисы, к которым фронт ходит напрямую (кроме auth → BFF)
export type ApiService =
  | 'bff'        // BFF (baseURL = /api/v1)
  | 'barcodegen'
  | 'billing'
  | 'ai'
  | 'history';

export class ApiClient {
  private mode: ApiMode;
  private baseURL: string;

  constructor(mode?: ApiMode) {
    const config = useRuntimeConfig();
    // В Nuxt читаем из runtimeConfig.public (публичные env-переменные), а не process.env.
    this.mode = mode || (config.public.apiMode as ApiMode) || 'mock';
    this.baseURL = config.public.apiBaseUrl || apiConfig.baseURL;
  }

  /**
   * Get base URL for a target service
   */
  private getBaseURL(service: ApiService = 'bff'): string {
    if (service === 'bff') {
      return this.baseURL; // /api/v1
    }
    return serviceURLs[service];
  }

  /**
   * Get full API URL for a service
   */
  private getApiUrl(endpoint: string, service: ApiService = 'bff'): string {
    const base = this.getBaseURL(service);
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${base}/${cleanEndpoint}`;
  }

  /**
   * Make API request
   */
  async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    service: ApiService = 'bff'
  ): Promise<ApiResponse<T>> {
    if (this.mode === 'mock') {
      // In mock mode, we'll use mock handlers
      // This will be handled by individual services
      throw new Error('Mock mode should be handled by service layer');
    }

    const url = this.getApiUrl(endpoint, service);

    // Добавляем JWT (Authorization Bearer) из cookie, если есть.
    // Читаем через document.cookie (работает вне setup-контекста).
    const token = readCookie("auth_token");
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // Пытаемся извлечь человекочитаемое сообщение из JSON-тела BFF ({ code, message }).
        let message = response.statusText;
        let code = `HTTP_${response.status}`;
        try {
          const body = await response.json();
          if (body?.message) message = body.message;
          if (body?.code) code = body.code;
        } catch {
          // тело не JSON — оставляем statusText
        }
        const error: ApiError = { message, code };
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
  async get<T = any>(endpoint: string, service?: ApiService): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, service);
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any, service?: ApiService): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, service);
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any, service?: ApiService): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, service);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, service?: ApiService): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, service);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, service?: ApiService): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, service);
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
    apiClientInstance = new ApiClient();
  }
  return apiClientInstance;
}

// Чтение cookie через document.cookie (работает вне setup-контекста).
function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

