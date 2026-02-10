import { ApiError } from '@/errors';

/**
 * HTTP request methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * HTTP request options
 */
export interface HttpRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

/**
 * HTTP response wrapper
 */
export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

/**
 * HTTP provider for making API requests
 */
export class HttpProvider {
  private baseUrl?: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  /**
   * Create a new HTTP provider
   * @param baseUrl - Optional base URL for all requests
   * @param defaultHeaders - Default headers to include in all requests
   * @param timeout - Request timeout in milliseconds (default: 30000)
   */
  constructor(
    baseUrl?: string,
    defaultHeaders: Record<string, string> = {},
    timeout: number = 30000
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
    this.timeout = timeout;
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const base = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint;

    if (!params || Object.keys(params).length === 0) {
      return base;
    }

    const url = new URL(base);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    return url.toString();
  }

  /**
   * Make an HTTP request
   */
  async request<T = unknown>(
    endpoint: string,
    options: HttpRequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const { method = 'GET', headers = {}, body, params, timeout = this.timeout } = options;

    const url = this.buildUrl(endpoint, params);
    const mergedHeaders = { ...this.defaultHeaders, ...headers };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = (await response.json()) as T;
      } else {
        data = (await response.text()) as T;
      }

      // Check for HTTP errors
      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      // Extract headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return {
        data,
        status: response.status,
        headers: responseHeaders,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(`Request timeout after ${timeout}ms`, 408);
        }
        throw new ApiError(`Request failed: ${error.message}`);
      }

      throw new ApiError('Unknown error occurred during request');
    }
  }

  /**
   * Make a GET request
   */
  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params, headers });
  }

  /**
   * Make a POST request
   */
  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  /**
   * Make a PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  /**
   * Make a DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  /**
   * Make a PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers });
  }
}
