// ---------------------------------------------------------------------------
// useCurrentWeather — Home screen view-model
//
// Fetches all data needed by the index.tsx screen:
//   - HeroWeatherCard (temp, feels-like, condition, wind, humidity, precip)
//   - MetricCards (precip, wind, humidity, UV)
//   - HourlyStrip (next ~24 hours)
//   - DataSourceCard (station name, update time)
//
// Returns loading / error / data states so the screen can delegate to
// StateManager or render the content directly.
//
// Usage:
//   const { data, isLoading, error, refresh } = useCurrentWeather(38.88, -77.03);
//
//   if (isLoading) return <Skeleton />;
//   if (error) return <ErrorCard onRetry={refresh} />;
//   return <HomeScreen data={data} />;
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback, useRef } from 'react';
import { weatherService, type ResolvedLocation } from '../services/weatherService';
import type {
  HomeScreenData,
  HeroWeatherData,
  MetricCardData,
  HourlyStripItem,
  DataSourceData,
} from '../types/ui';
import type { WeatherCondition } from '../../../components/ui/home/WeatherIcon';
import type {
  Gridpoint12hForecast,
  GridpointHourlyForecast,
  Observation,
} from '../api/types/models';

// =========================================================================
// View-model return type
// =========================================================================

export interface CurrentWeatherViewModel {
  /** Formatted data ready for the UI components. */
  data: HomeScreenData | null;
  /** True while the initial request is in flight. */
  isLoading: boolean;
  /** Error message (null when no error). */
  error: string | null;
  /** Re-fetch from the API. */
  refresh: () => void;
  /** Whether a background refresh is currently happening. */
  isRefreshing: boolean;
}

// =========================================================================
// Mapping helpers
// =========================================================================

/**
 * Map a raw API weather string to the app's WeatherCondition icon type.
 *
 * Heuristic based on the NWS short-forecast text.
 */
function mapCondition(shortForecast: string): WeatherCondition {
  const lower = shortForecast.toLowerCase();
  if (lower.includes('sunny') || lower.includes('clear')) return 'sunny';
  if (lower.includes('partly') || lower.includes('mostly cloudy')) return 'partly-cloudy';
  if (lower.includes('cloudy') || lower.includes('overcast')) return 'cloudy';
  if (lower.includes('thunderstorm') || lower.includes('tstorm')) return 'stormy';
  if (lower.includes('rain') || lower.includes('shower') || lower.includes('drizzle')) return 'rainy';
  if (lower.includes('snow') || lower.includes('blizzard') || lower.includes('flurries')) return 'snowy';
  if (lower.includes('fog') || lower.includes('haze') || lower.includes('mist')) return 'foggy';
  if (lower.includes('wind')) return 'windy';
  return 'partly-cloudy';
}

/**
 * Format a time string (ISO-8601) to a short hour label.
 * Example: "2026-06-26T13:00:00+00:00" → "1 PM"
 */
function formatHour(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12} ${ampm}`;
}

/**
 * Format a full ISO-8601 date to a human-readable greeting.
 * Example: "2026-06-26T12:00:00+00:00" → "Friday · June 26"
 */
function formatGreeting(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${days[d.getDay()]} · ${months[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Build the HeroWeatherCard props from the 12‑hour forecast period
 * and the latest observation.
 */
function buildHeroData(
  period: Gridpoint12hForecast['periods'][0],
  obs: Observation | null,
  unit: string,
): HeroWeatherData {
  const tempVal = typeof period.temperature === 'object'
    ? (period.temperature as { value: number | null }).value ?? 0
    : (period.temperature as number);

  const feelsLike = obs?.temperature?.value ?? tempVal;

  return {
    temperature: tempVal,
    unit,
    condition: period.shortForecast,
    conditionIcon: mapCondition(period.shortForecast),
    feelsLike: Math.round(feelsLike),
    precipitation: period.probabilityOfPrecipitation?.value ?? 0,
    windSpeed: typeof period.windSpeed === 'string'
      ? period.windSpeed
      : `${(period.windSpeed as { value: number | null }).value ?? 0} ${unit === 'F' ? 'mph' : 'km/h'}`,
    windDir: period.windDirection,
    humidity: obs?.relativeHumidity?.value ?? 0,
    lastObs: obs?.timestamp ? formatHour(obs.timestamp) : 'N/A',
  };
}

/**
 * Build the array of MetricCard props for the home screen.
 */
function buildMetrics(
  period: Gridpoint12hForecast['periods'][0],
  obs: Observation | null,
): MetricCardData[] {
  const precipValue = period.probabilityOfPrecipitation?.value ?? 0;
  const humidityValue = obs?.relativeHumidity?.value ?? 0;
  const dewpoint = obs?.dewpoint?.value;
  const dewpointUnit = obs?.dewpoint?.unitCode?.includes('degF') ? '°F' : '°C';

  return [
    {
      label: 'Precipitation',
      value: `${precipValue}%`,
      sub: 'Chance of rain',
      barValue: precipValue,
    },
    {
      label: 'Wind',
      value: typeof period.windSpeed === 'string'
        ? period.windSpeed
        : `${(period.windSpeed as { value: number | null }).value ?? 0}`,
      sub: `Direction: ${period.windDirection}`,
    },
    {
      label: 'Humidity',
      value: `${Math.round(humidityValue)}%`,
      sub: dewpoint !== null && dewpoint !== undefined
        ? `Dew point: ${Math.round(dewpoint)}${dewpointUnit}`
        : undefined,
      barValue: Math.round(humidityValue),
    },
  ];
}

/**
 * Build the HourlyStrip items from the hourly forecast periods.
 * Takes the next 24 periods (roughly 24 hours).
 */
function buildHourlyStrip(
  hourlyForecast: GridpointHourlyForecast,
): HourlyStripItem[] {
  return hourlyForecast.periods.slice(0, 24).map((p) => ({
    time: formatHour(p.startTime),
    condition: mapCondition(p.shortForecast),
    temp: typeof p.temperature === 'object'
      ? `${(p.temperature as { value: number | null }).value ?? '--'}°`
      : `${p.temperature}°`,
    precip: p.probabilityOfPrecipitation.value != null
      ? `${p.probabilityOfPrecipitation.value}%`
      : undefined,
  }));
}

/**
 * Build the DataSourceCard props.
 */
function buildDataSource(
  location: ResolvedLocation,
  forecast: Gridpoint12hForecast,
): DataSourceData {
  return {
    station: `${location.nearestStation.name} (${location.nearestStationId})`,
    updated: new Date(forecast.updateTime).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    source: 'weather.gov',
  };
}

// =========================================================================
// Hook
// =========================================================================

export function useCurrentWeather(
  lat: number,
  lon: number,
  unit: 'us' | 'si' = 'us',
): CurrentWeatherViewModel {
  const [data, setData] = useState<HomeScreenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fetchIdRef = useRef(0);

  const fetchWeather = useCallback(
    async (isRefresh = false) => {
      const id = ++fetchIdRef.current;

      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const bundle = await weatherService.getCurrentWeather(lat, lon, unit);

        // Guard against stale responses from rapid re-fetches.
        if (id !== fetchIdRef.current) return;

        const currentPeriod = bundle.forecast12h.periods[0];
        if (!currentPeriod) {
          throw new Error('No forecast periods available');
        }

        const screenData: HomeScreenData = {
          header: {
            greeting: formatGreeting(bundle.forecast12h.generatedAt),
            title: `${bundle.location.point.relativeLocation.city}, ${bundle.location.point.relativeLocation.state}`,
          },
          hero: buildHeroData(currentPeriod, bundle.latestObservation, unit === 'us' ? 'F' : 'C'),
          metrics: buildMetrics(currentPeriod, bundle.latestObservation),
          hourly: buildHourlyStrip(bundle.forecastHourly),
          dataSource: buildDataSource(bundle.location, bundle.forecast12h),
        };

        setData(screenData);
      } catch (err) {
        if (id !== fetchIdRef.current) return;
        const message =
          err instanceof Error ? err.message : 'Failed to fetch weather data';
        setError(message);
      } finally {
        if (id === fetchIdRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [lat, lon, unit],
  );

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const refresh = useCallback(() => {
    fetchWeather(true);
  }, [fetchWeather]);

  return { data, isLoading, error, refresh, isRefreshing };
}
