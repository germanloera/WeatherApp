// ---------------------------------------------------------------------------
// Alerts Endpoint
//
// Fetches active and historical NWS alerts (watches, warnings, advisories).
// Alerts follow the CAP v1.2 / IPAWS specification.
//
// Endpoints:
//   GET /alerts/active                        (all active alerts)
//   GET /alerts/active/area/{area}            (by state/territory code)
//   GET /alerts/active/zone/{zoneId}          (by NWS zone ID)
//   GET /alerts/active/count                  (active alert counts)
//   GET /alerts/types                         (list of alert types)
//   GET /alerts/{id}                          (by alert ID)
//
// Examples:
//   https://api.weather.gov/alerts/active
//   https://api.weather.gov/alerts/active?area=KS
//   https://api.weather.gov/alerts/active/area/KS
//   https://api.weather.gov/alerts/active/zone/KSZ026
//
// Usage:
//   const alertsApi = new AlertsApi(httpClient);
//
//   // All active alerts in Kansas
//   const ksAlerts = await alertsApi.getActiveAlerts({ area: 'KS' });
//   for (const feature of ksAlerts.features) {
//     console.log(feature.properties.event, feature.properties.severity);
//   }
//
//   // Active alerts for a specific zone
//   const zoneAlerts = await alertsApi.getActiveAlertsByZone('KSZ026');
// ---------------------------------------------------------------------------

import type { AxiosInstance } from 'axios';
import type {
  AlertCollectionGeoJson,
  AlertGeoJson,
} from '../types/models';
import type {
  AlertStatus,
  AlertMessageType,
  AlertSeverity,
  AlertUrgency,
  AlertCertainty,
} from '../types/enums';

/**
 * Filters for querying alerts.
 */
export interface AlertFilter {
  /** Limit to active alerts only. */
  active?: boolean;
  /** Filter by alert status. */
  status?: AlertStatus;
  /** Filter by message type. */
  messageType?: AlertMessageType;
  /** Filter by event name (e.g. "Severe Thunderstorm Warning"). */
  event?: string;
  /** Filter by code (e.g. "SAME:020013"). */
  code?: string;
  /** Comma-delimited list of state/territory codes. */
  area?: string;
  /** Filter by point location (latitude,longitude). */
  point?: { latitude: number; longitude: number };
  /** Filter by NWS region (e.g. "AR"). */
  region?: string;
  /** Filter by region type (e.g. "public", "marine", "land"). */
  regionType?: string;
  /** Filter by zone ID (e.g. "KSZ026"). */
  zone?: string;
  /** Filter by urgency. */
  urgency?: AlertUrgency;
  /** Filter by severity. */
  severity?: AlertSeverity;
  /** Filter by certainty. */
  certainty?: AlertCertainty;
  /** Maximum records to return. */
  limit?: number;
  /** Pagination cursor. */
  cursor?: string;
}

export class AlertsApi {
  constructor(private readonly client: AxiosInstance) {}

  /**
   * Query active alerts with optional filters.
   *
   * @param filter - Optional filters (area, zone, severity, urgency, etc.)
   *
   * @example
   *   // All active tornado warnings
   *   const tornado = await api.getActiveAlerts({
   *     event: 'Tornado Warning',
   *     severity: 'Severe',
   *   });
   *
   *   // All active alerts near a point
   *   const nearby = await api.getActiveAlerts({
   *     point: { latitude: 39.74, longitude: -97.08 },
   *     limit: 10,
   *   });
   */
  async getActiveAlerts(
    filter?: AlertFilter,
  ): Promise<AlertCollectionGeoJson> {
    const params: Record<string, string | number | undefined> = {};

    if (filter?.active !== undefined) params.active = filter.active;
    if (filter?.status) params.status = filter.status;
    if (filter?.messageType) params.messageType = filter.messageType;
    if (filter?.event) params.event = filter.event;
    if (filter?.code) params.code = filter.code;
    if (filter?.area) params.area = filter.area;
    if (filter?.point) {
      params.point = `${filter.point.latitude},${filter.point.longitude}`;
    }
    if (filter?.region) params.region = filter.region;
    if (filter?.regionType) params.region_type = filter.regionType;
    if (filter?.zone) params.zone = filter.zone;
    if (filter?.urgency) params.urgency = filter.urgency;
    if (filter?.severity) params.severity = filter.severity;
    if (filter?.certainty) params.certainty = filter.certainty;
    if (filter?.limit) params.limit = filter.limit;
    if (filter?.cursor) params.cursor = filter.cursor;

    const { data } = await this.client.get<AlertCollectionGeoJson>(
      '/alerts/active',
      { params },
    );
    return data;
  }

  /**
   * Get all active alerts for a given state or territory.
   *
   * @param area - Two-letter state/territory code (e.g. "KS", "PR").
   *
   * @example
   *   const ksAlerts = await api.getActiveAlertsByArea('KS');
   */
  async getActiveAlertsByArea(area: string): Promise<AlertCollectionGeoJson> {
    const { data } = await this.client.get<AlertCollectionGeoJson>(
      `/alerts/active/area/${area.toUpperCase()}`,
    );
    return data;
  }

  /**
   * Get all active alerts for a specific NWS zone.
   *
   * @param zoneId - NWS zone ID (e.g. "KSZ026", "FLZ144").
   *
   * @example
   *   const zoneAlerts = await api.getActiveAlertsByZone('KSZ026');
   */
  async getActiveAlertsByZone(zoneId: string): Promise<AlertCollectionGeoJson> {
    const { data } = await this.client.get<AlertCollectionGeoJson>(
      `/alerts/active/zone/${zoneId.toUpperCase()}`,
    );
    return data;
  }

  /**
   * Get the count of active alerts, optionally grouped by severity, urgency, etc.
   *
   * @example
   *   const count = await api.getActiveAlertCount();
   *   // { total: { severe: 12, moderate: 45, ... }, ... }
   */
  async getActiveAlertCount(): Promise<Record<string, unknown>> {
    const { data } = await this.client.get('/alerts/active/count');
    return data;
  }

  /**
   * Get a single alert by its ID.
   *
   * @param id - Alert ID (e.g. "urn:oid:2.49.0.1.840.0.…").
   *
   * @example
   *   const alert = await api.getAlert('urn:oid:2.49.0.1.840.0....');
   *   console.log(alert.properties.headline);
   */
  async getAlert(id: string): Promise<AlertGeoJson> {
    const { data } = await this.client.get<AlertGeoJson>(`/alerts/${id}`);
    return data;
  }

  /**
   * List all recognized alert type names.
   *
   * @example
   *   const types = await api.getAlertTypes();
   *   // ["Severe Thunderstorm Warning", "Tornado Warning", "Flood Warning", ...]
   */
  async getAlertTypes(): Promise<string[]> {
    const { data } = await this.client.get<string[]>('/alerts/types');
    return data;
  }
}
