// ---------------------------------------------------------------------------
// weather.gov API — Clean Architecture Entry Point
//
// This barrel file re-exports everything you need to consume the API:
//   - HttpClient + factory
//   - All endpoint classes
//   - All TypeScript types & enums
//
// Usage:
//   import { httpClient, PointsApi, GridpointsApi } from './src';
//
//   const pointsApi = new PointsApi(httpClient);
//   const point    = await pointsApi.getPoint(39.7456, -97.0892);
//   const { gridId, gridX, gridY } = point.properties;
//
//   const gridpointsApi = new GridpointsApi(httpClient);
//   const forecast = await gridpointsApi.getForecast(gridId, gridX, gridY);
//
// Migration guide → see AGENTS.md or CLAUDE.md
// ---------------------------------------------------------------------------

export { createHttpClient, httpClient, WeatherApiError } from './api/client/httpClient';
export type { AxiosInstance } from 'axios';

export { PointsApi, GridpointsApi, ObservationsApi, AlertsApi, ZonesApi } from './api/endpoints';

export type * from './api/types';
