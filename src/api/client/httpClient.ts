// ---------------------------------------------------------------------------
// Axios HTTP Client — weather.gov API
//
// This module creates a pre-configured Axios instance with:
//   - Base URL pointing to https://api.weather.gov
//   - Required User-Agent header
//   - Feature-flag headers for modern response formats
//   - Response interceptor for standardized error handling
//
// Usage:
//   import { httpClient } from './client/httpClient';
//
//   const points = await httpClient.get('/points/39.7456,-97.0892');
//
// Rate limit: generous but NOT public. If you receive a 429, wait ~5 s.
// Proxies and high-frequency polling are more likely to hit the limit.
// ---------------------------------------------------------------------------

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import type { ProblemDetail } from '../types/models';

import curlirize from 'axios-curlirize'
import { log } from '@/src/constants/debug';


// ---------------------------------------------------------------------------
// Configuration constants
// ---------------------------------------------------------------------------

/** Base URL for all weather.gov API requests. */
const BASE_URL = 'https://api.weather.gov';

/**
 * Default User-Agent.
 * Replace with your own app name and contact info so NWS can reach you
 * if your traffic is associated with a security event.
 */
const DEFAULT_USER_AGENT = '(american_weather, gloera.adeve@gmail.com)';

/**
 * Feature flags requested via HTTP headers.
 * Using these returns modern QuantitativeValue objects instead of
 * deprecated plain-string/integer representations.
 */
const FEATURE_FLAGS = [
  'forecast_temperature_qv',
  'forecast_wind_speed_qv',
];

/**
 * Request timeout in milliseconds.
 * The API can be slow for large grid queries — 15 s is a safe default.
 */
const REQUEST_TIMEOUT_MS = 15_000;

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

/**
 * Wraps a weather.gov API error with structured ProblemDetail info.
 *
 * Example:
 *   try {
 *     await pointsEndpoint.getPoint(39.74, -97.08);
 *   } catch (err) {
 *     if (err instanceof WeatherApiError) {
 *       console.error(err.correlationId, err.detail);
 *     }
 *   }
 */
export class WeatherApiError extends Error {
  /** HTTP status code returned by the API. */
  public status: number;
  /** NWS correlation ID (include in bug reports). */
  public correlationId: string;
  /** ProblemDetail object from the API response body. */
  public problemDetail: ProblemDetail;

  constructor(problem: ProblemDetail, status: number) {
    super(problem.detail || problem.title || 'Unknown API error');
    this.name = 'WeatherApiError';
    this.status = status;
    this.correlationId = problem.correlationId;
    this.problemDetail = problem;
  }
}

// ---------------------------------------------------------------------------
// Client factory
// ---------------------------------------------------------------------------



/**
 * Creates and returns a configured Axios instance for the weather.gov API.
 *
 * @param userAgent - Custom User-Agent string identifying your application.
 *                    Defaults to `DEFAULT_USER_AGENT`.
 * @param timeout   - Request timeout in ms. Defaults to `REQUEST_TIMEOUT_MS`.
 *
 * Example:
 *   const client = createHttpClient('(MyApp/1.0, my@email.com)');
 *   const { data } = await client.get('/points/38.9,-77.0');
 */
export function createHttpClient(
  userAgent: string = DEFAULT_USER_AGENT,
  timeout: number = REQUEST_TIMEOUT_MS,
): AxiosInstance {
  const client: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout,
    headers: {
      Accept: 'application/geo+json',
      'User-Agent': userAgent,
      'Feature-Flags': FEATURE_FLAGS.join(','),
    },
  });

  // -----------------------------------------------------------------------
  // Request interceptor
  // -----------------------------------------------------------------------
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => config,
    (error: AxiosError) => Promise.reject(error),
  );

  // -----------------------------------------------------------------------
  // Response interceptor — transforms 4xx/5xx into WeatherApiError
  // -----------------------------------------------------------------------
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ProblemDetail>) => {
      if (error.response?.data) {
        const problem = error.response.data as ProblemDetail;
        const status = error.response.status;
        return Promise.reject(
          new WeatherApiError(problem, status),
        );
      }
      // Network errors, timeouts, etc. without a response body
      return Promise.reject(error);
    },
  );

  curlirize(client, (result, err) => {
    const { command } = result;

    if (err) {
      // Route errors to a separate file, stream, or logging tool
      console.log()
      console.error(err);
      console.log()

    } else {
     // Route the generated curl command to your custom log stream 
        log(command);
     
      
    }
  });


  return client;
}

/**
 * Pre-built singleton client ready for import.
 * Create a custom one via `createHttpClient()` if you need a custom
 * User-Agent or timeout.
 */
export const httpClient: AxiosInstance = createHttpClient();
