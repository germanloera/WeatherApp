// ---------------------------------------------------------------------------
// useHourlyForecast — Hourly screen view-model
//
// Fetches the 7‑day hourly forecast and groups periods by calendar day so
// the UI can render DayDivider + HourRow sections.
//
// Usage:
//   const { data, isLoading, error, refresh } = useHourlyForecast(38.88, -77.03);
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback, useRef } from 'react';
import { weatherService } from '../services/weatherService';
import type { HourlyScreenData, DayGroup, HourlyRowData, DataSourceData } from '../types/ui';
import type { WeatherCondition } from '../../../components/ui/home/WeatherIcon';
import type { GridpointHourlyForecastPeriod } from '../api/types/models';
import { p, useCurrentLocationStore } from '@/src/constants/debug';

// =========================================================================
// View-model return type
// =========================================================================

export interface HourlyForecastViewModel {
  data: HourlyScreenData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  isRefreshing: boolean;
}

// =========================================================================
// Mapping helpers
// =========================================================================

/**
 * Map short-forecast text to WeatherCondition icon type.
 */
function mapCondition(text: string): WeatherCondition {
  const lower = text.toLowerCase();
  if (lower.includes('sunny') || lower.includes('clear')) return 'sunny';
  if (lower.includes('partly') || lower.includes('mostly cloudy')) return 'partly-cloudy';
  if (lower.includes('cloudy') || lower.includes('overcast')) return 'cloudy';
  if (lower.includes('thunderstorm') || lower.includes('tstorm')) return 'stormy';
  if (lower.includes('rain') || lower.includes('shower') || lower.includes('drizzle')) return 'rainy';
  if (lower.includes('snow') || lower.includes('blizzard')) return 'snowy';
  if (lower.includes('fog') || lower.includes('haze') || lower.includes('mist')) return 'foggy';
  if (lower.includes('wind')) return 'windy';
  return 'partly-cloudy';
}

/**
 * Format an ISO-8601 datetime to a short time label.
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
 * Format an ISO-8601 datetime to a day label for DayDivider.
 * Example: "2026-06-26T13:00:00+00:00" → "Friday June 26"
 */
function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Format a date range for the header greeting.
 * Example: periods from Jun 26 to Jun 27 → "Fri Jun 26 · Sat Jun 27"
 */
function formatHeaderGreeting(
  periods: GridpointHourlyForecastPeriod[],
): string {
  if (periods.length === 0) return '';
  const first = new Date(periods[0].startTime);
  const last = new Date(periods[periods.length - 1].endTime);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fmt = (d: Date) =>
    `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;

  const firstStr = fmt(first);
  const lastStr = fmt(last);

  // If same day, just show one.
  if (firstStr === lastStr) return firstStr;
  return `${firstStr} · ${lastStr}`;
}

/**
 * Group hourly forecast periods by calendar day.
 */
function groupByDay(
  periods: GridpointHourlyForecastPeriod[],
): DayGroup[] {
  const groups = new Map<string, GridpointHourlyForecastPeriod[]>();

  for (const period of periods) {
    const dayKey = period.startTime.slice(0, 10); // "2026-06-26"
    const existing = groups.get(dayKey) ?? [];
    existing.push(period);
    groups.set(dayKey, existing);
  }

  const dayGroups: DayGroup[] = [];
  for (const [dayKey, groupPeriods] of groups) {
    const dayLabel = formatDayLabel(groupPeriods[0].startTime);
    const hours: HourlyRowData[] = groupPeriods.map((p) => {
      // Build subtitle from humidity + wind.
      const humidity = (p as typeof p & { relativeHumidity?: { value?: number } }).relativeHumidity;
      const humidityStr = humidity?.value != null ? `${Math.round(humidity.value)}%` : '--';
      const windStr = typeof p.windSpeed === 'string'
        ? p.windSpeed
        : `${(p.windSpeed as { value: number | null })?.value ?? 0} mph`;

      return {
        time: formatHour(p.startTime),
        condition: mapCondition(p.shortForecast),
        conditionText: p.shortForecast,
        subtitle: `Humidity: ${humidityStr} · Wind: ${p.windDirection} ${windStr}`,
        temp: typeof p.temperature === 'object'
          ? `${(p.temperature as { value: number | null }).value ?? '--'}°`
          : `${p.temperature}°`,
        precip: p.probabilityOfPrecipitation.value != null
          ? `${p.probabilityOfPrecipitation.value}%`
          : undefined,
      };
    });

    dayGroups.push({ label: dayLabel, hours });
  }

  return dayGroups;
}

// =========================================================================
// Hook
// =========================================================================

export function useHourlyForecast(
  unit: 'us' | 'si' = 'us',
): HourlyForecastViewModel {
  const [data, setData] = useState<HourlyScreenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fetchIdRef = useRef(0);
  const gridX = useCurrentLocationStore((state) => state.pointX)
  const gridY = useCurrentLocationStore((state) => state.pointY)
  const wfo = useCurrentLocationStore((state) => state.wfo)

  const fetchWeather = useCallback(
    async (isRefresh = false) => {
      const id = ++fetchIdRef.current;

      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      try {
        const bundle = await weatherService.getHourlyForecast(gridX, gridY, wfo,   unit);
        if (id !== fetchIdRef.current) return;

        const periods = bundle.forecastHourly.periods;

        const screenData: HourlyScreenData = {
          header: {
            greeting: formatHeaderGreeting(periods),
            title: 'Next 48 Hours',
          },
          days: groupByDay(periods),
          dataSource: {
            station: `weather.gov `,
            updated: new Date(bundle.forecastHourly.generatedAt).toLocaleString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            source: 'weather.gov',
          },
        };

        p(data?.days)
        setData(screenData);
      } catch (err) {
        if (id !== fetchIdRef.current) return;
        const message =
          err instanceof Error ? err.message : 'Failed to fetch hourly forecast';
        setError(message);
      } finally {
        if (id === fetchIdRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [ unit],
  );

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const refresh = useCallback(() => {
    fetchWeather(true);
  }, [fetchWeather]);

  return { data, isLoading, error, refresh, isRefreshing };
}

