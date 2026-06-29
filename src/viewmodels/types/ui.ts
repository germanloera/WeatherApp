// ---------------------------------------------------------------------------
// UI Bridge Types
//
// Maps raw API models (from src/api/types) into the shape the UI components
// expect. Each screen has its own "formatted" interface.
//
// Usage:
//   import type { HomeScreenData, HourlyRowData, CitySearchResult } from './types/ui';
// ---------------------------------------------------------------------------

import type { WeatherCondition } from '../../../components/ui/home/WeatherIcon';

// =========================================================================
// Shared primitives
// =========================================================================

/** Temperature display unit. */
export type TemperatureUnit = 'F' | 'C';

/** Barometric pressure trend. */
export type PressureTrend = 'rising' | 'falling' | 'stable';

// =========================================================================
// Home screen (index.tsx)
// =========================================================================

/** Formatted data for the HeroWeatherCard component. */
export interface HeroWeatherData {
  temperature: number;
  unit: TemperatureUnit;
  condition: string;
  conditionIcon: WeatherCondition;
  feelsLike: number;
  precipitation: number;
  windSpeed: string;
  windDir: string;
  humidity: number;
  lastObs: string;
}

/** Formatted data for a single MetricCard on the home screen. */
export interface MetricCardData {
  label: string;
  value: string;
  sub?: string;
  barValue?: number;
  barColor?: string;
}

/** Formatted data for one item in the HourlyStrip horizontal scroll. */
export interface HourlyStripItem {
  time: string;
  condition: WeatherCondition;
  temp: string;
  precip?: string;
}

/** Formatted data for the DataSourceCard component. */
export interface DataSourceData {
  station: string;
  updated: string;
  source: string;
}

/** Aggregated state for the home screen. */
export interface HomeScreenData {
  header: {
    greeting: string;
    title: string;
  };
  hero: HeroWeatherData;
  metrics: MetricCardData[];
  hourly: HourlyStripItem[];
  dataSource: DataSourceData;
}

// =========================================================================
// Detail screen (detail.tsx)
// =========================================================================

/** Formatted data for a single DetailCard on the detail screen. */
export interface DetailMetricData {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  subColor?: string;
  /** Optional bar fill percentage (0–100). */
  barValue?: number;
}

/** Formatted data for the SparklineChart (temperature trend). */
export interface TemperatureTrendData {
  values: number[];
  leftLabel: string;
  centerLabel: string;
  rightLabel: string;
}

/** Formatted data for the WindCard component. */
export interface WindData {
  speed: number;
  unit: string;
  direction: string;
  degrees: number;
  gusts: number;
}

/** Formatted data for the SunTimesCard component. */
export interface SunTimesData {
  sunrise: string;
  sunset: string;
  dayDuration: string;
  nextSunrise?: string;
}

/** Formatted data for the PressureCard component. */
export interface PressureData {
  current: number;
  unit: string;
  trend: PressureTrend;
  history: number[];
  interpretation: string;
}

/** Aggregated state for the detail screen. */
export interface DetailScreenData {
  header: {
    title: string;
    subtitle: string;
  };
  metrics: DetailMetricData[];
  temperatureTrend: TemperatureTrendData;
  wind: WindData;
  sunTimes: SunTimesData;
  pressure: PressureData;
  dataSource: DataSourceData;
}

// =========================================================================
// Hourly screen (hourly.tsx)
// =========================================================================

/** Formatted data for one hour in the HourRow component. */
export interface HourlyRowData {
  time: string;
  condition: WeatherCondition;
  conditionText: string;
  subtitle: string;
  temp: string;
  precip?: string;
}

/** A group of hours sharing the same day label. */
export interface DayGroup {
  label: string;
  hours: HourlyRowData[];
}

/** Aggregated state for the hourly screen. */
export interface HourlyScreenData {
  header: {
    greeting: string;
    title: string;
  };
  days: DayGroup[];
  dataSource: DataSourceData;
}

// =========================================================================
// Search screen (search.tsx)
// =========================================================================

/** Formatted city result for CityRow component. */
export interface CitySearchResult {
  id: string;
  name: string;
  state: string;
  temp: number;
  lat: number;
  lon: number;
  icon: 'sunny' | 'partlyCloudy' | 'cloudy' | 'rainy';
}

/** Filter option for FilterRow component. */
export interface FilterOption {
  key: string;
  label: string;
}
