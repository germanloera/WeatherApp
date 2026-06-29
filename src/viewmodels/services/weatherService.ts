// ---------------------------------------------------------------------------
// WeatherService
//
// Orchestrates the multi-step API flow for a given location:
//   1. Resolve lat/lon → NWS grid point  (PointsApi)
//   2. Fetch forecasts & observations      (GridpointsApi, ObservationsApi)
//   3. Fetch alerts                        (AlertsApi)
//
// Each method returns typed data or throws. The hooks layer below handles
// loading/error state wrapping.
//
// Usage:
//   const svc = new WeatherService();
//   const result = await svc.getCurrentWeather(39.74, -97.08);
// ---------------------------------------------------------------------------

import { PointsApi } from '../../api/endpoints/points';
import { GridpointsApi } from '../../api/endpoints/gridpoints';
import { ObservationsApi } from '../../api/endpoints/observations';
import { AlertsApi } from '../../api/endpoints/alerts';
import { httpClient } from '../../api/client/httpClient';

import type { Point, PointGeoJson } from '../../api/types/models';
import type {
  Gridpoint12hForecast,
  GridpointHourlyForecast,
  Gridpoint,
  Observation,
  ObservationStation,
  AlertCollectionGeoJson,
} from '../../api/types/models';
import { p } from '@/src/constants/debug';

// =========================================================================
// Resolved location — the result of /points lookup + nearest station
// =========================================================================

export interface ResolvedLocation {
  /** Raw Point properties from the API. */
  point: Point;
  /** Nearest observation station identifier (e.g. "KTOP"). */
  nearestStationId: string;
  /** Nearest observation station metadata. */
  nearestStation: ObservationStation;
}

// =========================================================================
// Aggregated result bundles
// =========================================================================

export interface CurrentWeatherBundle {
  location: PointGeoJson;
  forecast12h: Gridpoint12hForecast;
  forecastHourly: GridpointHourlyForecast;
  latestObservation: Observation | null;
  activeAlerts: AlertCollectionGeoJson | null;
}

export interface DetailWeatherBundle {
  location: PointGeoJson;
  gridData: Gridpoint;
  latestObservation: Observation | null;
  activeAlerts: AlertCollectionGeoJson | null;
}

export interface HourlyForecastBundle {
  location: PointGeoJson;
  forecastHourly: GridpointHourlyForecast;
}

// =========================================================================
// Service class
// =========================================================================

export class WeatherService {
  private readonly pointsApi: PointsApi;
  private readonly gridpointsApi: GridpointsApi;
  private readonly observationsApi: ObservationsApi;
  private readonly alertsApi: AlertsApi;

  constructor() {
    // All endpoint classes share the same pre-configured Axios instance.
    this.pointsApi = new PointsApi(httpClient);
    this.gridpointsApi = new GridpointsApi(httpClient);
    this.observationsApi = new ObservationsApi(httpClient);
    this.alertsApi = new AlertsApi(httpClient);
  }

  /**
   * Step 1 — Resolve a coordinate to its NWS grid + nearest station.
   *
   * Every subsequent API call depends on this resolution.
   *
   * @param lat - Latitude in decimal degrees.
   * @param lon - Longitude in decimal degrees.
   *
   * @example
   *   const loc = await svc.resolveLocation(39.7456, -97.0892);
   *   // loc.point.gridId → "TOP"
   *   // loc.nearestStationId → "KTOP"
   */
  async resolveLocation(lat: number, lon: number): Promise<PointGeoJson> {
    const pointGeo = await this.pointsApi.getPoint(lat, lon);

    // Fetch the nearest station from the /points/{lat},{lon}/stations endpoint
    // The observationStations URI returns a FeatureCollection sorted by distance.
    
    /*const stationsGeo = await this.observationsApi.listStations({
      center: { latitude: lat, longitude: lon, radius: 50 },
      limit: 1,
    });

    const nearestStation = stationsGeo.features[0]?.properties;
    if (!nearestStation) {
      throw new Error(`No observation station found near ${lat}, ${lon}`);
    }
    */

    return pointGeo;
  }

  /**
   * Get all data needed for the home screen.
   *
   * Fetches: 12‑hour forecast, hourly forecast, latest observation, active alerts.
   *
   * @param lat - Latitude.
   * @param lon - Longitude.
   * @param units - "us" (default) or "si".
   *
   * @example
   *   const data = await svc.getCurrentWeather(40.7128, -74.0060);
   *   data.forecast12h.periods[0].temperature // current temp
   *   data.latestObservation?.temperature     // observed temp
   */
  async getCurrentWeather(
    lat: number,
    lon: number,
    units: 'us' | 'si' = 'us',
  ): Promise<CurrentWeatherBundle> {
    const location = await this.resolveLocation(lat, lon);
    const { gridId, gridX, gridY } = location.properties;

    // Run independent requests in parallel for performance.
    //  const [forecast12h, forecastHourly, latestObs, activeAlerts] =
    const [forecast12h, forecastHourly,  activeAlerts] =
      await Promise.all([
        this.gridpointsApi.getForecast(gridId, gridX, gridY, units),
        this.gridpointsApi.getHourlyForecast(gridId, gridX, gridY, units),
        
        //this.observationsApi
        //  .getLatestObservation(location.nearestStationId)
        //  .catch(() => null), // observation can be null if station is down
        this.alertsApi
          .getActiveAlerts({ point: { latitude: lat, longitude: lon } })
          .catch(() => null), // alerts are optional
      ]);

    p(forecast12h)
    return {
     location,
      forecast12h: forecast12h.properties,
      forecastHourly: forecastHourly.properties,
     latestObservation: null, 
      activeAlerts,
    };
  }

  /**
   * Get all data needed for the detail screen.
   *
   * Fetches: raw gridded data (all layers), latest observation, alerts.
   *
   * @param lat - Latitude.
   * @param lon - Longitude.
   *
   * @example
   *   const detail = await svc.getDetailWeather(40.7128, -74.0060);
   *   detail.gridData.temperature?.values   // temp time series
   *   detail.gridData.pressure?.values       // pressure time series
   */
  async getDetailWeather(
    lat: number,
    lon: number,
  ): Promise<DetailWeatherBundle> {
    const location = await this.resolveLocation(lat, lon);
    const { gridId, gridX, gridY } = location.properties;

    const [gridData, activeAlerts] = await Promise.all([
      this.gridpointsApi.getGridData(gridId, gridX, gridY),
     // this.observationsApi
     ///   .getLatestObservation(location.nearestStationId)
     //   .catch(() => null),
      this.alertsApi
        .getActiveAlerts({ point: { latitude: lat, longitude: lon }, limit: 5 })
        .catch(() => null),
    ]);

    return {
      location,
      gridData: gridData.properties,
      latestObservation:  null,
      activeAlerts,
    };
  }

  /**
   * Get the hourly forecast for the hourly screen.
   *
   * @param lat - Latitude.
   * @param lon - Longitude.
   * @param units - "us" (default) or "si".
   *
   * @example
   *   const hourly = await svc.getHourlyForecast(40.7128, -74.0060);
   *   hourly.forecastHourly.periods.length // ~168 (7 days × 24 h)
   */
  async getHourlyForecast(
    lat: number,
    lon: number,
    units: 'us' | 'si' = 'us',
  ): Promise<HourlyForecastBundle> {
    const location = await this.resolveLocation(lat, lon);
    const { gridId, gridX, gridY } = location.properties;

    const forecastHourly = await this.gridpointsApi.getHourlyForecast(
      gridId,
      gridX,
      gridY,
      units,
    );

    return {
      location,
      forecastHourly: forecastHourly.properties,
    };
  }
}

/** Singleton instance for convenience — import and use directly. */
export const weatherService = new WeatherService();
