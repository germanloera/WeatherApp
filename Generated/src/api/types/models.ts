// ---------------------------------------------------------------------------
// weather.gov API — Data Models (TypeScript interfaces)
//
// These types mirror the official OpenAPI specification at:
//   https://api.weather.gov/openapi.json
//
// Usage:
//   import type { Point, ForecastPeriod, Observation, Alert } from '../types';
// ---------------------------------------------------------------------------

import type {
  WindDirection,
  TemperatureUnit,
  TemperatureTrend,
  AlertSeverity,
  AlertUrgency,
  AlertCertainty,
  AlertStatus,
  AlertMessageType,
  AlertCategory,
  AlertResponse,
  AlertScope,
  QualityControlFlag,
  MetarSkyCoverage,
  WeatherPhenomenon,
  WeatherCoverage,
  WeatherIntensity,
  WeatherAttribute,
  PointType,
  ISO8601Duration,
  NWSZoneType,
} from './enums';

// ---------------------------------------------------------------------------
// Common / Primitive Types
// ---------------------------------------------------------------------------

/**
 * A structured measurement with unit-of-measure.
 * Slightly modified version of schema.org/QuantitativeValue.
 *
 * Example:
 *   { value: 72.5, unitCode: "wmoUnit:degF", qualityControl: "Z" }
 *
 * @see https://schema.org/QuantitativeValue
 */
export interface QuantitativeValue {
  /** Measured value (null when the sensor did not report). */
  value: number | null;
  /** Upper bound of a range (e.g. temperature range). */
  maxValue?: number | null;
  /** Lower bound of a range. */
  minValue?: number | null;
  /** Unit of measure code (e.g. "wmoUnit:degF", "wmoUnit:km_h-1"). */
  unitCode: string;
  /** MADIS quality-control flag (only present in observation records). */
  qualityControl?: QualityControlFlag | null;
}

/**
 * Pagination cursor for endpoints that return large collections.
 * If `next` is null there are no more pages.
 *
 * Example: { next: "https://api.weather.gov/stations?cursor=..." }
 */
export interface PaginationInfo {
  /** URI to the next page of results, or null if on the last page. */
  next: string | null;
}

/**
 * RFC 7807 Problem Details — the standard error body for the API.
 *
 * Example:
 * {
 *   type: "urn:noaa:nws:api:UnexpectedProblem",
 *   title: "Unexpected Problem",
 *   status: 500,
 *   detail: "An unexpected problem has occurred.",
 *   instance: "urn:noaa:nws:api:request:493c3a1d-...",
 *   correlationId: "493c3a1d-..."
 * }
 */
export interface ProblemDetail {
  /** URI identifier for the problem type (not necessarily resolvable). */
  type: string;
  /** Short human-readable summary. */
  title: string;
  /** HTTP status code. */
  status: number;
  /** Human-readable explanation specific to this occurrence. */
  detail: string;
  /** URI identifying this specific occurrence. */
  instance: string;
  /** NWS debugging ID — include when reporting issues. */
  correlationId: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Relative Location
// ---------------------------------------------------------------------------

/**
 * Human-readable city/state with distance and bearing from the requested point.
 *
 * Example:
 *   { city: "Topeka", state: "KS", distance: { value: 5.2, unitCode: "wmoUnit:km" }, bearing: { value: 315, unitCode: "wmoUnit:degree_(angle)" } }
 */
export interface RelativeLocation {
  /** City name. */
  city: string;
  /** Two-letter state/territory code. */
  state: string;
  /** Distance from the requested coordinate. */
  distance: QuantitativeValue;
  /** Compass bearing from the requested coordinate. */
  bearing: QuantitativeValue;
}

// ---------------------------------------------------------------------------
// Point (lat/lon → grid mapping)
// Endpoint: GET /points/{latitude},{longitude}
// Example:  https://api.weather.gov/points/39.7456,-97.0892
// ---------------------------------------------------------------------------

/**
 * Response from the /points endpoint — converts a geographic coordinate
 * into the NWS grid system (office + gridX + gridY).
 *
 * All forecast/observation URLs can be discovered from this object
 * so you rarely need to construct them manually.
 */
export interface Point {
  /** JSON-LD context URL. */
  '@context'?: string | Record<string, unknown>;
  /** GeoJSON geometry (the requested coordinate as a Point). */
  geometry?: string;
  /** Canonical URI for this resource. */
  '@id'?: string;
  '@type'?: 'wx:Point';
  /** NWS Forecast Office ID (e.g. "TOP"). */
  cwa: string;
  /** Whether the point is on land or marine. */
  type: PointType;
  /** URI for the forecast office resource. */
  forecastOffice: string;
  /** NWS grid identifier (usually same as cwa). */
  gridId: string;
  /** Grid X coordinate (column). */
  gridX: number;
  /** Grid Y coordinate (row). */
  gridY: number;
  /** URI to the 12-hour forecast endpoint. */
  forecast: string;
  /** URI to the hourly forecast endpoint. */
  forecastHourly: string;
  /** URI to the raw grid data endpoint. */
  forecastGridData: string;
  /** URI to the observation stations collection for this point. */
  observationStations: string;
  /** Human-readable city/state location. */
  relativeLocation: RelativeLocation;
  /** URI to the public forecast zone. */
  forecastZone: string;
  /** URI to the county zone. */
  county: string;
  /** URI to the fire weather zone. */
  fireWeatherZone: string;
  /** IANA time-zone identifier (e.g. "America/Chicago"). */
  timeZone: string;
  /** Nearest WSR-88D radar station ID (e.g. "KTWX"). */
  radarStation: string | null;
  /** URI to astronomical data endpoint. */
  astronomicalData?: string;
}

// ---------------------------------------------------------------------------
// Gridpoint — Raw forecast data layers
// Endpoint: GET /gridpoints/{wfo}/{x},{y}
// Example:  https://api.weather.gov/gridpoints/TOP/31,80
// ---------------------------------------------------------------------------

/**
 * A time-stamped numeric value in a gridpoint data layer.
 */
export interface GridpointValue {
  /** ISO-8601 interval this value is valid for. */
  validTime: ISO8601Duration;
  /** Numeric value (null = no data for this interval). */
  value: number | null;
}

/**
 * A named layer of quantitative values (e.g. temperature, windSpeed).
 * Each layer has a unit-of-measure and an array of (validTime, value) pairs.
 */
export interface GridpointQuantitativeValueLayer {
  /** Unit of measure code (e.g. "wmoUnit:degC"). */
  uom: string;
  /** Ordered time-series of values. */
  values: GridpointValue[];
}

/**
 * A parsed weather phenomenon object from the raw grid data.
 */
export interface GridpointWeatherValue {
  /** Areal coverage (e.g. "scattered", "widespread"). */
  coverage: WeatherCoverage | null;
  /** Weather phenomenon (e.g. "rain", "snow"). */
  weather: WeatherPhenomenon | null;
  /** Intensity qualifier. */
  intensity: WeatherIntensity | null;
  /** Visibility during this weather condition. */
  visibility?: QuantitativeValue;
  /** Hazard attributes. */
  attributes: WeatherAttribute[];
}

/**
 * A time-bound weather value in the raw grid data.
 */
export interface GridpointWeather {
  validTime: ISO8601Duration;
  value: GridpointWeatherValue[];
}

/**
 * A parsed hazard/watch/advisory object from the raw grid data.
 */
export interface GridpointHazardValue {
  /** P-VTEC phenomenon code (2 letters). */
  phenomenon: string;
  /** P-VTEC significance code (1 letter: "A" = watch, "Y" = advisory). */
  significance: string;
  /** Event number (null for local WFO products). */
  event_number: number | null;
}

/**
 * A time-bound hazard value.
 */
export interface GridpointHazard {
  validTime: ISO8601Duration;
  value: GridpointHazardValue[];
}

/**
 * Raw gridded-forecast data for a 2.5 km grid square.
 * Contains all data layers: temperature, dewpoint, wind, precipitation, etc.
 *
 * Some layers may not be present in all geographic areas.
 */
export interface Gridpoint {
  '@context'?: string | Record<string, unknown>;
  geometry?: string;
  '@id'?: string;
  '@type'?: 'wx:Gridpoint';
  /** Last time the grid data was updated. */
  updateTime: string;
  /** ISO-8601 interval covering all valid times in this response. */
  validTimes: string;
  /** Elevation of the grid cell centroid. */
  elevation: QuantitativeValue;
  /** URI to the forecast office. */
  forecastOffice: string;
  gridId: string;
  gridX: number;
  gridY: number;

  /** Temperature at 2 m above ground. */
  temperature?: GridpointQuantitativeValueLayer;
  /** Dewpoint temperature at 2 m above ground. */
  dewpoint?: GridpointQuantitativeValueLayer;
  /** Daily maximum temperature. */
  maxTemperature?: GridpointQuantitativeValueLayer;
  /** Daily minimum temperature. */
  minTemperature?: GridpointQuantitativeValueLayer;
  /** Relative humidity at 2 m above ground. */
  relativeHumidity?: GridpointQuantitativeValueLayer;
  /** Apparent (feels-like) temperature. */
  apparentTemperature?: GridpointQuantitativeValueLayer;
  /** Heat index. */
  heatIndex?: GridpointQuantitativeValueLayer;
  /** Wind chill. */
  windChill?: GridpointQuantitativeValueLayer;
  /** Wet-bulb globe temperature. */
  wetBulbGlobeTemperature?: GridpointQuantitativeValueLayer;
  /** Sky cover (0–100 %). */
  skyCover?: GridpointQuantitativeValueLayer;
  /** Wind direction (degrees). */
  windDirection?: GridpointQuantitativeValueLayer;
  /** Wind speed. */
  windSpeed?: GridpointQuantitativeValueLayer;
  /** Wind gust speed. */
  windGust?: GridpointQuantitativeValueLayer;
  /** Weather phenomena. */
  weather?: { values: GridpointWeather[] };
  /** Watch/advisory products in effect. */
  hazards?: { values: GridpointHazard[] };
  /** Probability of precipitation (0–100 %). */
  probabilityOfPrecipitation?: GridpointQuantitativeValueLayer;
  /** Quantitative precipitation amount. */
  quantitativePrecipitation?: GridpointQuantitativeValueLayer;
  /** Ice accumulation. */
  iceAccumulation?: GridpointQuantitativeValueLayer;
  /** Snowfall amount. */
  snowfallAmount?: GridpointQuantitativeValueLayer;
  /** Snow level. */
  snowLevel?: GridpointQuantitativeValueLayer;
  /** Ceiling height. */
  ceilingHeight?: GridpointQuantitativeValueLayer;
  /** Visibility. */
  visibility?: GridpointQuantitativeValueLayer;
  /** Barometric pressure. */
  pressure?: GridpointQuantitativeValueLayer;
  /** Probability of thunder (0–100 %). */
  probabilityOfThunder?: GridpointQuantitativeValueLayer;
  /** Lightning activity level (1–6). */
  lightningActivityLevel?: GridpointQuantitativeValueLayer;
  /** Haines index (wildfire potential). */
  hainesIndex?: GridpointQuantitativeValueLayer;
  /** Red-flag threat index. */
  redFlagThreatIndex?: GridpointQuantitativeValueLayer;
  /** Stability (e.g. "unstable", "stable"). */
  stability?: GridpointQuantitativeValueLayer;

  /** Additional unknown data layers fall through here. */
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Forecast Periods (12-hour & hourly)
// Endpoints:
//   GET /gridpoints/{wfo}/{x},{y}/forecast           (12-hour)
//   GET /gridpoints/{wfo}/{x},{y}/forecast/hourly     (1-hour)
// Examples:
//   https://api.weather.gov/gridpoints/TOP/31,80/forecast
//   https://api.weather.gov/gridpoints/TOP/31,80/forecast/hourly
// ---------------------------------------------------------------------------

/**
 * Base forecast period shared by both 12-hour and hourly forecasts.
 */
export interface ForecastPeriodBase {
  /** Sequential period number starting at 1. */
  number: number;
  /** Textual label (e.g. "Tuesday Night"). Null for hourly forecasts. */
  name: string | null;
  /** ISO-8601 start datetime. */
  startTime: string;
  /** ISO-8601 end datetime. */
  endTime: string;
  /** Whether this period falls in daytime. */
  isDaytime: boolean;
  /**
   * Temperature value.
   * NOTE: The API may return an integer (deprecated) or a QuantitativeValue.
   * Set the "forecast_temperature_qv" feature flag for the object form.
   */
  temperature: number | QuantitativeValue;
  /**
   * Temperature unit (deprecated in favor of QuantitativeValue).
   */
  temperatureUnit?: TemperatureUnit;
  /** Non-diurnal temperature trend (null = normal diurnal pattern). */
  temperatureTrend: TemperatureTrend;
  /** Probability of precipitation (0–100 %). */
  probabilityOfPrecipitation: QuantitativeValue;
  /**
   * Wind speed.
   * NOTE: The API may return a string (deprecated) or a QuantitativeValue.
   * Set the "forecast_wind_speed_qv" feature flag for the object form.
   */
  windSpeed: string | QuantitativeValue;
  /**
   * Peak wind gust.
   * NOTE: May be a string, QuantitativeValue, or null.
   */
  windGust: string | QuantitativeValue | null;
  /** 16-point compass wind direction. */
  windDirection: WindDirection;
  /** URI to weather icon (deprecated — may be removed in future versions). */
  icon?: string;
  /** Brief textual forecast summary (e.g. "Mostly Sunny"). */
  shortForecast: string;
  /** Detailed textual forecast description. */
  detailedForecast: string | null;
}

/**
 * A 12-hour forecast period (daytime / nighttime).
 */
export interface Forecast12hPeriod extends ForecastPeriodBase {}

/**
 * An hourly forecast period with additional fields.
 */
export interface ForecastHourlyPeriod extends ForecastPeriodBase {
  /** Dewpoint temperature. */
  dewpoint: QuantitativeValue;
  /** Relative humidity (0–100 %). */
  relativeHumidity: QuantitativeValue;
}

/**
 * The units used throughout a forecast response.
 * Example: "us" (US customary) or "si" (metric).
 */
export type GridpointForecastUnits = 'us' | 'si';

/**
 * 12-hour (day/night) forecast for the next 7 days.
 *
 * Example:
 *   GET /gridpoints/TOP/31,80/forecast
 */
export interface Gridpoint12hForecast {
  '@context'?: string | Record<string, unknown>;
  geometry?: string;
  /** Unit system used in the response ("us" or "si"). */
  units: GridpointForecastUnits;
  /** Internal NWS forecast generator class name (debugging only). */
  forecastGenerator: string;
  /** Timestamp this forecast was generated. */
  generatedAt: string;
  /** Timestamp of the underlying data's last update. */
  updateTime: string;
  /** ISO-8601 interval covering all valid times. */
  validTimes: string;
  /** Elevation of the grid cell. */
  elevation: QuantitativeValue;
  /** Ordered array of forecast periods. */
  periods: Forecast12hPeriod[];
}

/**
 * Hourly forecast for the next 7 days.
 *
 * Example:
 *   GET /gridpoints/TOP/31,80/forecast/hourly
 */
export interface GridpointHourlyForecast {
  '@context'?: string | Record<string, unknown>;
  geometry?: string;
  units: GridpointForecastUnits;
  forecastGenerator: string;
  generatedAt: string;
  updateTime: string;
  validTimes: string;
  elevation: QuantitativeValue;
  periods: ForecastHourlyPeriod[];
}

// ---------------------------------------------------------------------------
// Observation Station
// Endpoint: GET /stations, GET /stations/{stationId}
// Example:  https://api.weather.gov/stations/KTOP
// ---------------------------------------------------------------------------

/**
 * A weather observation station (ASOS, AWOS, MesoWest, RAWS, etc.).
 */
export interface ObservationStation {
  '@context'?: string | Record<string, unknown>;
  geometry?: string;
  '@id'?: string;
  '@type'?: 'wx:ObservationStation';
  /** Elevation of the station. */
  elevation: QuantitativeValue;
  /** Station identifier (ICAO code, e.g. "KTOP"). */
  stationIdentifier: string;
  /** Human-readable station name. */
  name: string;
  /** IANA time-zone identifier. */
  timeZone: string;
  /** Data provider (e.g. "ASOS", "MesoWest"). */
  provider?: string | null;
  /** Sub-provider (e.g. "FAA", "DOT"). */
  subProvider?: string | null;
  /** URI to the public forecast zone containing this station. */
  forecast?: string;
  /** URI to the county zone. */
  county?: string;
  /** URI to the fire weather zone. */
  fireWeatherZone?: string;
  /** Distance from a requested coordinate (only in collection responses). */
  distance?: QuantitativeValue;
  /** Bearing from a requested coordinate. */
  bearing?: QuantitativeValue;
}

// ---------------------------------------------------------------------------
// Observation (current conditions)
// Endpoints:
//   GET /stations/{stationId}/observations/latest
//   GET /stations/{stationId}/observations
//   GET /stations/{stationId}/observations/{time}
// Example:
//   https://api.weather.gov/stations/KTOP/observations/latest
// ---------------------------------------------------------------------------

/**
 * A parsed METAR phenomenon (present weather).
 */
export interface MetarPhenomenon {
  intensity?: string | null;
  modifier?: string | null;
  weather?: string | null;
  rawString?: string;
  inVicinity?: boolean;
}

/**
 * A cloud layer reported by the station.
 */
export interface CloudLayer {
  /** Cloud-base height AGL. */
  base: QuantitativeValue;
  /** Sky coverage code (e.g. "FEW", "SCT", "BKN", "OVC"). */
  amount: MetarSkyCoverage;
}

/**
 * A single observation record from a station.
 */
export interface Observation {
  '@context'?: string | Record<string, unknown>;
  geometry?: string;
  '@id'?: string;
  '@type'?: 'wx:ObservationStation';
  /** Elevation of the station. */
  elevation: QuantitativeValue;
  /** URI to the station resource. */
  station: string;
  /** Station identifier (ICAO, e.g. "KTOP"). */
  stationId: string;
  /** Human-readable station name. */
  stationName?: string;
  /** ISO-8601 timestamp of the observation. */
  timestamp: string;
  /** Raw METAR string (may be null for non-ASOS stations). */
  rawMessage: string | null;
  /** Human-readable weather description. */
  textDescription: string | null;
  /** URI to weather icon (deprecated). */
  icon?: string | null;
  /** Parsed present-weather phenomenona. */
  presentWeather: MetarPhenomenon[] | null;
  /** Air temperature at 2 m. */
  temperature: QuantitativeValue | null;
  /** Dewpoint temperature at 2 m. */
  dewpoint: QuantitativeValue | null;
  /** Wind direction (degrees true). */
  windDirection: QuantitativeValue | null;
  /** Wind speed. */
  windSpeed: QuantitativeValue | null;
  /** Wind gust speed (null if no gust). */
  windGust: QuantitativeValue | null;
  /** Barometric pressure (ALTIMETER setting). */
  barometricPressure: QuantitativeValue | null;
  /** Sea-level pressure (reduced). */
  seaLevelPressure: QuantitativeValue | null;
  /** Horizontal visibility. */
  visibility: QuantitativeValue | null;
  /** Max temperature in the last 24 hours (may be null outside Central time zone). */
  maxTemperatureLast24Hours: QuantitativeValue | null;
  /** Min temperature in the last 24 hours. */
  minTemperatureLast24Hours: QuantitativeValue | null;
  /** Precipitation in the last hour. */
  precipitationLastHour: QuantitativeValue | null;
  /** Precipitation in the last 3 hours. */
  precipitationLast3Hours: QuantitativeValue | null;
  /** Precipitation in the last 6 hours. */
  precipitationLast6Hours: QuantitativeValue | null;
  /** Relative humidity (0–100 %). */
  relativeHumidity: QuantitativeValue | null;
  /** Wind chill temperature. */
  windChill: QuantitativeValue | null;
  /** Heat index temperature. */
  heatIndex: QuantitativeValue | null;
  /** Cloud layers (null = no cloud data / clear skies). */
  cloudLayers: CloudLayer[] | null;
}

// ---------------------------------------------------------------------------
// Alerts
// Endpoints:
//   GET /alerts/active
//   GET /alerts/active/area/{area}
//   GET /alerts/active/zone/{zoneId}
//   GET /alerts/{id}
// Examples:
//   https://api.weather.gov/alerts/active?area=KS
//   https://api.weather.gov/alerts/active
// ---------------------------------------------------------------------------

/**
 * Geocode information for an alert (NWS zones + SAME codes).
 */
export interface AlertGeocode {
  /** NWS public zone or county identifiers. */
  UGC?: string[];
  /** SAME (Specific Area Message Encoding) 6-digit codes. */
  SAME?: string[];
}

/**
 * A reference to a prior alert that this alert updates or replaces.
 */
export interface AlertReference {
  '@id'?: string;
  identifier?: string;
  sender?: string;
  sent?: string;
}

/**
 * A public alert message (CAP v1.2 / IPAWS).
 *
 * Unless otherwise noted, fields follow the NWS CAP v1.2 specification:
 *   http://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html
 */
export interface Alert {
  /** Unique alert identifier (e.g. "urn:oid:2.49.0.1.840.0.…"). */
  id: string;
  /** Textual description of the affected area. */
  areaDesc: string;
  /** NWS zone and SAME codes for the affected area. */
  geocode: AlertGeocode;
  /** API links for all affected zones. */
  affectedZones: string[];
  /** Prior alerts that this alert updates or replaces. */
  references: AlertReference[] | null;
  /** Time the alert was originally sent. */
  sent: string;
  /** Time the alert becomes effective. */
  effective: string;
  /** Expected onset time of the event (null = immediate). */
  onset: string | null;
  /** Time the alert expires. */
  expires: string;
  /** Expected end time of the event (null = no known end). */
  ends: string | null;
  /** Alert status. */
  status: AlertStatus;
  /** Message type. */
  messageType: AlertMessageType;
  /** Category of the subject event. */
  category: AlertCategory;
  /** Severity level. */
  severity: AlertSeverity;
  /** Certainty of the event. */
  certainty: AlertCertainty;
  /** Urgency of the event. */
  urgency: AlertUrgency;
  /** Event type text (e.g. "Severe Thunderstorm Warning"). */
  event: string;
  /** Email address of the NWS webmaster. */
  sender: string;
  /** Human-readable originator name (e.g. "NWS Topeka KS"). */
  senderName: string | null;
  /** Alert headline (null for some message types). */
  headline: string | null;
  /** Full description of the event. */
  description: string;
  /** Recommended action instructions (null when not applicable). */
  instruction: string | null;
  /** Accompanying note (only present for "Test" status alerts). */
  note: string | null;
  /** Recommended response type. */
  response: AlertResponse;
  /** System-specific additional parameters. */
  parameters: Record<string, unknown[]> | null;
  /** Intended distribution scope. */
  scope: AlertScope;
  /** Special handling code. */
  code: string;
  /** Language code (e.g. "en-US"). */
  language: string;
  /** Hyperlink to additional information. */
  web: string;
  /** System-specific event codes. */
  eventCode: Record<string, unknown[]> | null;
}

// ---------------------------------------------------------------------------
// Zone & Zone Forecast
// Endpoints:
//   GET /zones/{type}
//   GET /zones/{type}/{zoneId}
//   GET /zones/forecast/{zoneId}/forecast
// Examples:
//   https://api.weather.gov/zones/forecast/KSZ026
//   https://api.weather.gov/zones/forecast/KSZ026/forecast
// ---------------------------------------------------------------------------

/**
 * An NWS zone (forecast, county, or fire-weather zone).
 */
export interface Zone {
  '@context'?: string | Record<string, unknown>;
  geometry?: string;
  '@id'?: string;
  '@type'?: 'wx:Zone';
  /** Zone identifier (e.g. "KSZ026"). */
  id: string;
  /** Zone type (e.g. "forecast", "county", "fire"). */
  type: NWSZoneType;
  /** Human-readable zone name. */
  name: string;
  /** Date the zone definition became effective. */
  effectiveDate: string;
  /** Date the zone definition expires. */
  expirationDate: string;
  /** Two-letter state/territory code (null for multi-state zones). */
  state: string | null;
  /** URI to the responsible forecast office. */
  forecastOffice: string;
  /** NWS grid identifier. */
  gridIdentifier?: string | null;
  /** AWIPS location identifier. */
  awipsLocationIdentifier?: string | null;
  /** IANA time-zone identifiers that cover this zone. */
  timeZone: string[];
  /** URIs to observation stations within the zone. */
  observationStations: string[];
  /** Nearest WSR-88D radar station (null for some zones). */
  radarStation: string | null;
}

/**
 * A textual period in a zone forecast.
 */
export interface ZoneForecastPeriod {
  /** Sequential identifier number. */
  number: number;
  /** Textual period name (e.g. "This Afternoon", "Tonight"). */
  name: string;
  /** Detailed textual forecast for the period. */
  detailedForecast: string;
}

/**
 * A zone-area textual forecast (from the Zone Forecast Product — ZFP).
 *
 * Example:
 *   GET https://api.weather.gov/zones/forecast/KSZ026/forecast
 */
export interface ZoneForecast {
  '@context'?: string | Record<string, unknown>;
  geometry?: string;
  /** URI to the zone this forecast applies to. */
  zone: string;
  /** Time this product was published. */
  updated: string;
  /** Ordered array of forecast periods. */
  periods: ZoneForecastPeriod[];
}

// ---------------------------------------------------------------------------
// Office
// Endpoint: GET /offices/{officeId}
// Example:  https://api.weather.gov/offices/TOP
// ---------------------------------------------------------------------------

/**
 * A postal address for an NWS office.
 */
export interface PostalAddress {
  '@type'?: 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
}

/**
 * An NWS Weather Forecast Office (WFO).
 */
export interface Office {
  '@context'?: string | Record<string, unknown>;
  '@type'?: 'GovernmentOrganization';
  '@id'?: string;
  /** Office ID (e.g. "TOP"). */
  id: string;
  /** Full office name (e.g. "National Weather Service Topeka KS"). */
  name: string;
  /** Physical address. */
  address: PostalAddress;
  /** Voice telephone number. */
  telephone: string;
  /** Fax number. */
  faxNumber: string;
  /** Contact email address. */
  email?: string;
  /** URL to the office's social-media or website. */
  sameAs?: string;
  /** NWS region (e.g. "Central"). */
  nwsRegion: string;
  /** URI to parent organization (NWS HQ). */
  parentOrganization: string;
  /** URIs to counties this office is responsible for. */
  responsibleCounties: string[];
  /** URIs to public forecast zones. */
  responsibleForecastZones: string[];
  /** URIs to fire weather zones. */
  responsibleFireZones: string[];
  /** URIs to observation stations approved by this office. */
  approvedObservationStations: string[];
}

// ---------------------------------------------------------------------------
// GeoJSON Wrappers (returned by most list endpoints)
// ---------------------------------------------------------------------------

/**
 * Generic GeoJSON Feature.
 */
export interface GeoJsonFeature<T = Record<string, unknown>> {
  '@context'?: string | Record<string, unknown>;
  id?: string;
  type: 'Feature';
  geometry: unknown;
  properties: T;
}

/**
 * Generic GeoJSON Feature Collection with optional pagination.
 */
export interface GeoJsonFeatureCollection<T = Record<string, unknown>> {
  '@context'?: string | Record<string, unknown>;
  type: 'FeatureCollection';
  features: GeoJsonFeature<T>[];
  pagination?: PaginationInfo;
  title?: string;
  updated?: string;
}

// Convenience aliases for common GeoJSON wrappers
export type PointGeoJson = GeoJsonFeature<Point>;
export type Gridpoint12hForecastGeoJson = GeoJsonFeature<Gridpoint12hForecast>;
export type GridpointHourlyForecastGeoJson = GeoJsonFeature<GridpointHourlyForecast>;
export type ZoneForecastGeoJson = GeoJsonFeature<ZoneForecast>;
export type ObservationGeoJson = GeoJsonFeature<Observation>;
export type ObservationStationGeoJson = GeoJsonFeature<ObservationStation>;
export type AlertGeoJson = GeoJsonFeature<Alert>;
export type ZoneGeoJson = GeoJsonFeature<Zone>;

export type ObservationCollectionGeoJson = GeoJsonFeatureCollection<Observation>;
export type ObservationStationCollectionGeoJson = GeoJsonFeatureCollection<ObservationStation>;
export type AlertCollectionGeoJson = GeoJsonFeatureCollection<Alert>;
export type ZoneCollectionGeoJson = GeoJsonFeatureCollection<Zone>;
