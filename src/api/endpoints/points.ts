// ---------------------------------------------------------------------------
// Points Endpoint
//
// Converts a geographic coordinate (latitude, longitude) into the NWS grid
// system. Every other forecast/observation URL can be discovered from the
// Point response — you rarely need to construct URLs manually.
//
// Endpoint: GET /points/{latitude},{longitude}
// Example:  https://api.weather.gov/points/39.7456,-97.0892
//
// Usage:
//   const pointsApi = new PointsApi(httpClient);
//   const point = await pointsApi.getPoint(39.7456, -97.0892);
//   console.log(point.properties.relativeLocation.city); // "Topeka"
//
//   // Discover forecast URLs:
//   const forecastUrl = point.properties.forecast; // URI to /gridpoints/TOP/31,80/forecast
// ---------------------------------------------------------------------------

import type { AxiosInstance } from 'axios';
import type { PointGeoJson } from '../types/models';


export class PointsApi {
  constructor(private readonly client: AxiosInstance) {}

  /**
   * Resolve a geographic coordinate to an NWS grid point.
   *
   * @param latitude  - Latitude in decimal degrees (e.g. 39.7456).
   * @param longitude - Longitude in decimal degrees (e.g. -97.0892).
   *
   * @returns GeoJSON Feature whose `properties` contain the grid mapping,
   *          forecast URLs, observation station links, and relative location.
   *
   * @throws {WeatherApiError} On 4xx/5xx responses (invalid coords, etc.).
   *
   * @example
   *   const res = await api.getPoint(40.7128, -74.0060);
   *   // res.properties.gridId  → "OKX"
   *   // res.properties.gridX   → 147
   *   // res.properties.gridY   → 67
   *   // res.properties.forecast → "https://api.weather.gov/gridpoints/OKX/147,67/forecast"
   */
  async getPoint(latitude: number, longitude: number): Promise<PointGeoJson> {
    // Ensure the coordinate has enough decimal precision
    const lat = latitude.toFixed(4);
    const lon = longitude.toFixed(4);
    const { data } = await this.client.get<PointGeoJson>(
      `/points/${lat},${lon}`,
    );
    return data;
  }
}
