// ---------------------------------------------------------------------------
// Zones Endpoint
//
// NWS divides the US into public forecast zones, county zones, and
// fire-weather zones. Each zone has a textual forecast product (ZFP).
//
// Endpoints:
//   GET /zones/{type}                        (list zones of a type)
//   GET /zones/{type}/{zoneId}               (single zone details)
//   GET /zones/forecast/{zoneId}/forecast    (textual zone forecast)
//   GET /zones/forecast/{zoneId}/observations (observations within zone)
//   GET /zones/forecast/{zoneId}/stations    (stations within zone)
//
// Examples:
//   https://api.weather.gov/zones/forecast/KSZ026
//   https://api.weather.gov/zones/forecast/KSZ026/forecast
//   https://api.weather.gov/zones/county
//
// Usage:
//   const zonesApi = new ZonesApi(httpClient);
//   const zone = await zonesApi.getZone('forecast', 'KSZ026');
//   const forecast = await zonesApi.getZoneForecast('KSZ026');
//   forecast.properties.periods.forEach(p => {
//     console.log(p.name, p.detailedForecast);
//   });
// ---------------------------------------------------------------------------

import type { AxiosInstance } from 'axios';
import type {
  ZoneCollectionGeoJson,
  ZoneGeoJson,
  ZoneForecastGeoJson,
  ObservationStationCollectionGeoJson,
  ObservationCollectionGeoJson,
} from '../types/models';

export class ZonesApi {
  constructor(private readonly client: AxiosInstance) {}

  /**
   * List all zones of a given type.
   *
   * @param type  - Zone type: "forecast", "county", "fire", "land", "marine".
   * @param limit - Max records to return.
   * @param cursor - Pagination cursor.
   *
   * @example
   *   const countyZones = await api.listZones('county');
   *   const fireZones = await api.listZones('fire');
   */
  async listZones(
    type: string,
    limit?: number,
    cursor?: string,
  ): Promise<ZoneCollectionGeoJson> {
    const params: Record<string, string | number> = {};
    if (limit) params.limit = limit;
    if (cursor) params.cursor = cursor;
    const { data } = await this.client.get<ZoneCollectionGeoJson>(
      `/zones/${type}`,
      { params },
    );
    return data;
  }

  /**
   * Get metadata for a single NWS zone.
   *
   * @param type   - Zone type (e.g. "forecast", "county").
   * @param zoneId - Zone identifier (e.g. "KSZ026").
   *
   * @example
   *   const zone = await api.getZone('forecast', 'KSZ026');
   *   console.log(zone.properties.name); // "Shawnee"
   */
  async getZone(type: string, zoneId: string): Promise<ZoneGeoJson> {
    const { data } = await this.client.get<ZoneGeoJson>(
      `/zones/${type}/${zoneId.toUpperCase()}`,
    );
    return data;
  }

  /**
   * Get the textual area forecast for a public forecast zone.
   * This is the "Zone Forecast Product" (ZFP) — a human-readable multi-day
   * forecast with periods like "Today", "Tonight", "Tuesday", etc.
   *
   * @param zoneId - Public forecast zone ID (e.g. "KSZ026").
   *
   * @example
   *   const zf = await api.getZoneForecast('KSZ026');
   *   for (const p of zf.properties.periods) {
   *     console.log(`${p.name}: ${p.detailedForecast}`);
   *   }
   */
  async getZoneForecast(zoneId: string): Promise<ZoneForecastGeoJson> {
    const { data } = await this.client.get<ZoneForecastGeoJson>(
      `/zones/forecast/${zoneId.toUpperCase()}/forecast`,
    );
    return data;
  }

  /**
   * List observation stations within a zone.
   *
   * @param zoneId - Public forecast zone ID.
   *
   * @example
   *   const stations = await api.getZoneStations('KSZ026');
   *   stations.features.forEach(s => {
   *     console.log(s.properties.name, s.properties.stationIdentifier);
   *   });
   */
  async getZoneStations(
    zoneId: string,
  ): Promise<ObservationStationCollectionGeoJson> {
    const { data } = await this.client.get<ObservationStationCollectionGeoJson>(
      `/zones/forecast/${zoneId.toUpperCase()}/stations`,
    );
    return data;
  }

  /**
   * List observations within a zone (from all stations in the zone).
   *
   * @param zoneId - Public forecast zone ID.
   * @param limit  - Max records.
   * @param cursor - Pagination cursor.
   *
   * @example
   *   const obs = await api.getZoneObservations('KSZ026', 10);
   */
  async getZoneObservations(
    zoneId: string,
    limit?: number,
    cursor?: string,
  ): Promise<ObservationCollectionGeoJson> {
    const params: Record<string, string | number> = {};
    if (limit) params.limit = limit;
    if (cursor) params.cursor = cursor;
    const { data } = await this.client.get<ObservationCollectionGeoJson>(
      `/zones/forecast/${zoneId.toUpperCase()}/observations`,
      { params },
    );
    return data;
  }
}
