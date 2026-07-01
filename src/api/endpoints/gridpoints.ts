// ---------------------------------------------------------------------------
// Gridpoints Endpoint
//
// Fetches forecast data for a specific NWS grid cell (2.5 km resolution).
// You typically obtain `wfo`, `gridX`, and `gridY` from the /points endpoint.
//
// Endpoints:
//   GET /gridpoints/{wfo}/{x},{y}               (raw data layers)
//   GET /gridpoints/{wfo}/{x},{y}/forecast       (12-hour periods, ~7 days)
//   GET /gridpoints/{wfo}/{x},{y}/forecast/hourly (hourly periods, ~7 days)
//
// Examples:
//   https://api.weather.gov/gridpoints/TOP/31,80/forecast
//   https://api.weather.gov/gridpoints/TOP/31,80/forecast/hourly
//   https://api.weather.gov/gridpoints/TOP/31,80
//
// Usage:
//   const gridpointsApi = new GridpointsApi(httpClient);
//
//   // 12-hour forecast
//   const forecast = await gridpointsApi.getForecast('TOP', 31, 80);
//   for (const period of forecast.properties.periods) {
//     console.log(period.name, period.temperature, period.shortForecast);
//   }
//
//   // Hourly forecast
//   const hourly = await gridpointsApi.getHourlyForecast('TOP', 31, 80);
//
//   // Raw grid data (all layers)
//   const raw = await gridpointsApi.getGridData('TOP', 31, 80);
//   console.log(raw.properties.temperature?.values);
// ---------------------------------------------------------------------------

import type { AxiosInstance } from 'axios';
import type {
  Gridpoint,
  GeoJsonFeature,
  Gridpoint12hForecastGeoJson,
  GridpointHourlyForecastGeoJson,
} from '../types/models';
import { p } from '@/src/constants/debug';

/** GeoJSON wrapper for the raw Gridpoint data. */
type GridpointGeoJson = GeoJsonFeature<Gridpoint>;

export class GridpointsApi {
  constructor(private readonly client: AxiosInstance) {}

  /**
   * Build the URL path for a grid endpoint.
   * @internal
   */
  private gridPath(
    wfo: string,
    gridX: number,
    gridY: number,
    suffix: string = '',
  ): string {
    return `/gridpoints/${wfo.toUpperCase()}/${gridX},${gridY}${suffix}`;
  }

  /**
   * Fetch the full raw grid data (all data layers).
   *
   * Response contains all available layers — temperature, dewpoint, wind,
   * precipitation, weather phenomena, hazards, etc. Some layers may be
   * absent in certain geographic areas.
   *
   * @param wfo   - NWS Forecast Office ID (e.g. "TOP", "OKX").
   * @param gridX - Grid X coordinate (from /points).
   * @param gridY - Grid Y coordinate (from /points).
   *
   * @example
   *   const raw = await api.getGridData('TOP', 31, 80);
   *   const temps = raw.properties.temperature?.values;
   *   // temps → [{ validTime: "2025-06-28T12:00:00+00:00/PT1H", value: 72.3 }, ...]
   */
  async getGridData(wfo: string, gridX: number, gridY: number): Promise<GridpointGeoJson> {
    const { data } = await this.client.get<GridpointGeoJson>(
      this.gridPath(wfo, gridX, gridY),
    );
    return data;
  }

  /**
   * Fetch the 12-hour (day/night) forecast for the next 7 days.
   *
   * @param wfo   - NWS Forecast Office ID (e.g. "TOP").
   * @param gridX - Grid X coordinate.
   * @param gridY - Grid Y coordinate.
   * @param units - Unit system — "us" (Fahrenheit, mph) or "si" (Celsius, km/h).
   *                Defaults to "us".
   *
   * @example
   *   const f = await api.getForecast('TOP', 31, 80, 'si');
   *   f.properties.periods[0].temperature // QuantitativeValue with unitCode "wmoUnit:degC"
   */
  async getForecast(
    wfo: string,
    gridX: number,
    gridY: number,
    units?: 'us' | 'si',
  ): Promise<Gridpoint12hForecastGeoJson> {
    const { data } = await this.client.get<Gridpoint12hForecastGeoJson>(
      this.gridPath(wfo, gridX, gridY, '/forecast'),
      { params: units ? { units } : undefined },
    );
  
    return data;
  }

  /**
   * Fetch the hourly forecast for the next 7 days.
   *
   * @param wfo   - NWS Forecast Office ID.
   * @param gridX - Grid X coordinate.
   * @param gridY - Grid Y coordinate.
   * @param units - Unit system — "us" (default) or "si".
   *
   * @example
   *   const h = await api.getHourlyForecast('TOP', 31, 80);
   *   // Each period includes dewpoint, relativeHumidity, and all base fields
   */
  async getHourlyForecast(
    wfo: string,
    gridX: number,
    gridY: number,
    units?: 'us' | 'si',
  ): Promise<GridpointHourlyForecastGeoJson> {
    const { data } = await this.client.get<GridpointHourlyForecastGeoJson>(
      this.gridPath(wfo, gridX, gridY, '/forecast/hourly'),
      { params: units ? { units } : undefined },
    );
    return data;
  }
}
