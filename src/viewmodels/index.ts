// ---------------------------------------------------------------------------
// ViewModels — barrel export
//
// Import everything you need from a single path:
//   import { useCurrentWeather, useLocation, weatherService } from '../viewmodels';
// ---------------------------------------------------------------------------

// Services
export { WeatherService, weatherService } from './services/weatherService';
export type {
  ResolvedLocation,
  CurrentWeatherBundle,
  DetailWeatherBundle,
  HourlyForecastBundle,
} from './services/weatherService';

// Hooks (screen view-models)
export { useLocation } from './hooks/useLocation';
export type { LocationInfo, LocationState } from './hooks/useLocation';

export { useCurrentWeather } from './hooks/useCurrentWeather';
export type { CurrentWeatherViewModel } from './hooks/useCurrentWeather';

export { useDetailWeather } from './hooks/useDetailWeather';
export type { DetailWeatherViewModel } from './hooks/useDetailWeather';

export { useHourlyForecast } from './hooks/useHourlyForecast';
export type { HourlyForecastViewModel } from './hooks/useHourlyForecast';

export { useSearch } from './hooks/useSearch';
export type { SearchViewModel } from './hooks/useSearch';
export { BUILT_IN_CITIES } from './hooks/useSearch';
export type { CitySearchResult } from './hooks/useSearch';

// UI-specific bridge types
export type {
  HomeScreenData,
  DetailScreenData,
  HourlyScreenData,
  HourlyRowData,
  DayGroup,
  CitySearchResult as CitySearchResultType,
  FilterOption,
  HeroWeatherData,
  MetricCardData,
  HourlyStripItem,
  DetailMetricData,
  TemperatureTrendData,
  WindData,
  SunTimesData,
  PressureData,
  DataSourceData,
} from './types/ui';
