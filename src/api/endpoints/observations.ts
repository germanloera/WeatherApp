// ---------------------------------------------------------------------------
// Observations Endpoint
//
// Fetches current and historical weather observations from METAR stations.
// Station IDs are typically ICAO codes (e.g. "KTOP", "KLAX").
//
// Endpoints:
//   GET /stations/{stationId}/observations/latest      (most recent observation)
//   GET /stations/{stationId}/observations              (paginated history)
//   GET /stations/{stationId}/observations/{time}       (specific time)
//   GET /stations                                        (list stations)
//
// Examples:
//   https://api.weather.gov/stations/KTOP/observations/latest
//   https://api.weather.gov/stations/KTOP/observations?limit=10
//   https://api.weather.gov/stations?limit=100
//
// Usage:
//   const obsApi = new ObservationsApi(httpClient);
//   const latest = await obsApi.getLatestObservation('KTOP');
//   console.log(latest.properties.temperature.value); // e.g. 72.5
//
//   // Paginated history
//   const history = await obsApi.getObservations('KTOP', { limit: 25 });
//   for (const feature of history.features) {
//     console.log(feature.properties.timestamp, feature.properties.temperature.value);
//   }
// ---------------------------------------------------------------------------

import type { AxiosInstance } from 'axios';

import type {
  ObservationGeoJson,
  ObservationCollectionGeoJson,
  ObservationStationGeoJson,
  ObservationStationCollectionGeoJson,
} from '../types/models';

import { p } from '@/src/constants/debug';
/**
 * Filters for the /stations endpoint.
 */
export interface StationFilter {
  /** Only return stations within this bounding box (west, south, east, north). */
  bbox?: [number, number, number, number];
  /** Only return stations within this radius (km) of a point. */
  center?: {
    latitude: number;
    longitude: number;
    radius?: number;
  };
  /** Maximum records to return. */
  limit?: number;
  /** Pagination cursor from a previous response. */
  cursor?: string;
  /** Station ID(s) filter. */
  ids?: string[];
  /** Station name search. */
  name?: string;
  /** State/territory filter (2-letter code). */
  state?: string;
}

/**
 * Filters for the /stations/{id}/observations endpoint.
 */
export interface ObservationFilter {
  /** Maximum records to return (default 50, max 500). */
  limit?: number;
  /** Pagination cursor from a previous response. */
  cursor?: string;
  /** Start of time range (exclusive). */
  start?: string;
  /** End of time range (inclusive). */
  end?: string;
}

export class ObservationsApi {
  constructor(private readonly client: AxiosInstance) {}

  /**
   * List all observation stations (paginated).
   *
   * @param filter - Optional filters (bounding box, state, limit, etc.)
   *
   * @example
   *   // Find stations in Kansas
   *   const stations = await api.listStations({ state: 'KS', limit: 50 });
   *
   *   // Find stations near a coordinate
   *   const nearby = await api.listStations({
   *     center: { latitude: 39.74, longitude: -97.08, radius: 50 },
   *   });
   */
  async listStations(
    filter?: StationFilter,
  ): Promise<ObservationStationCollectionGeoJson> {
    const params: Record<string, string | number | undefined> = {};

    if (filter?.bbox) {
      params.bbox = filter.bbox.join(',');
    }
    if (filter?.center) {
      params.center = `${filter.center.latitude},${filter.center.longitude}`;
      if (filter.center.radius) params.radius = filter.center.radius;
    }
    if (filter?.limit) params.limit = filter.limit;
    if (filter?.cursor) params.cursor = filter.cursor;
    if (filter?.ids) params.id = filter.ids.join(',');
    if (filter?.name) params.name = filter.name;
    if (filter?.state) params.state = filter.state;

    const { data } = await this.client.get<ObservationStationCollectionGeoJson>(
      '/stations',
      { params },
    );
    
    p(data)
    return data;
  }

  /**
   * Get metadata for a single observation station.
   *
   * @param stationId - Station ICAO code (e.g. "KTOP").
   *
   * @example
   *   const station = await api.getStation('KTOP');
   *   console.log(station.properties.name); // "Philip Billard Muni, Topeka"
   */
  async getStation(stationId: string): Promise<ObservationStationGeoJson> {
    const { data } = await this.client.get<ObservationStationGeoJson>(
      `/stations/${stationId.toUpperCase()}`,
    );
    return data;
  }

  /**
   * Get the latest observation from a station.
   *
   * @param stationId - Station ICAO code.
   *
   * @example
   *   const obs = await api.getLatestObservation('KTOP');
   *   const t = obs.properties.temperature;
   *   if (t) {
   *     console.log(`${t.value}°${t.unitCode.includes('degF') ? 'F' : 'C'}`);
   *   }
   */
  async getLatestObservation(
    stationId: string,
  ): Promise<ObservationGeoJson> {
    const { data } = await this.client.get<ObservationGeoJson>(
      `/stations/${stationId.toUpperCase()}/observations/latest`,
    );
    return data;
  }

  /**
   * Get paginated historical observations from a station.
   *
   * @param stationId - Station ICAO code.
   * @param filter    - Optional time range, limit, and cursor.
   *
   * @example
   *   // Get last 24 hours of observations
   *   const now = new Date().toISOString();
   *   const yesterday = new Date(Date.now() - 86_400_000).toISOString();
   *   const obs = await api.getObservations('KTOP', {
   *     start: yesterday,
   *     end: now,
   *     limit: 100,
   *   });
   */
  async getObservations(
    stationId: string,
    filter?: ObservationFilter,
  ): Promise<ObservationCollectionGeoJson> {
    const params: Record<string, string | number | undefined> = {};

    if (filter?.limit) params.limit = filter.limit;
    if (filter?.cursor) params.cursor = filter.cursor;
    if (filter?.start) params.start = filter.start;
    if (filter?.end) params.end = filter.end;

    const { data } = await this.client.get<ObservationCollectionGeoJson>(
      `/stations/${stationId.toUpperCase()}/observations`,
      { params },
    );
    return data;
  }
}
