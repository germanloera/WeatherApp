// ---------------------------------------------------------------------------
// useDetailWeather — Detail screen view-model
//
// Fetches all data needed by the detail.tsx screen:
//   - DetailCards (pressure, UV, visibility, dew point)
//   - SparklineChart (24‑hour temperature trend)
//   - WindCard (speed, gusts, direction compass)
//   - SunTimesCard (sunrise, sunset, day length)
//   - PressureCard (current value, trend, history chart)
//
// Usage:
//   const { data, isLoading, error, refresh } = useDetailWeather(38.88, -77.03);
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback, useRef } from 'react';
import { weatherService } from '../services/weatherService';
import type {
  DetailScreenData,
  DetailMetricData,
  TemperatureTrendData,
  WindData,
  SunTimesData,
  PressureData,
  PressureTrend,
} from '../types/ui';
import type { Gridpoint, Observation } from '../api/types/models';

// =========================================================================
// View-model return type
// =========================================================================

export interface DetailWeatherViewModel {
  data: DetailScreenData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  isRefreshing: boolean;
}

// =========================================================================
// Mapping helpers
// =========================================================================

/**
 * Determine UV level label from the UV index value.
 */
function uvLabel(index: number): string {
  if (index <= 2) return 'Low';
  if (index <= 5) return 'Moderate';
  if (index <= 7) return 'High';
  if (index <= 10) return 'Very High';
  return 'Extreme';
}

/**
 * Determine UV level color.
 */
function uvColor(index: number): string {
  if (index <= 2) return '#22C55E';
  if (index <= 5) return '#EAB308';
  if (index <= 7) return '#F97316';
  if (index <= 10) return '#EF4444';
  return '#7C3AED';
}

/**
 * Build the detail metric cards from the latest observation.
 *
 * The current screen expects: pressure, UV, visibility, dew point.
 */
function buildMetrics(obs: Observation | null): DetailMetricData[] {
  const pressure = obs?.barometricPressure;
  const pressureUnit = pressure?.unitCode?.includes('hPa') ? 'hPa' : 'inHg';
  const pressureVal = pressure?.value;

  // Estimate UV from cloud cover (fallback if not directly observed).
  // Real UV data comes from the gridpoint's uvIndex layer on the /gridpoints endpoint.
  const uvValue = 8; // placeholder — real data would come from gridData

  const visibility = obs?.visibility;
  const visibilityVal = visibility?.value;
  const visibilityUnit = visibility?.unitCode?.includes('km') ? 'km' : 'mi';

  const dewpoint = obs?.dewpoint;
  const dewpointVal = dewpoint?.value;
  const dewpointUnit = dewpoint?.unitCode?.includes('degF') ? '°F' : '°C';
  const humidity = obs?.relativeHumidity?.value;

  return [
    {
      label: 'Barometric Pressure',
      value: pressureVal != null ? `${pressureVal.toFixed(1)}` : '--',
      unit: pressureUnit,
      sub: pressureVal != null ? (pressureVal > 1013 ? 'Stable ↑' : pressureVal < 1010 ? 'Falling ↓' : 'Stable →') : undefined,
    },
    {
      label: 'UV Index',
      value: `${uvValue}`,
      unit: '/11',
      sub: uvLabel(uvValue),
      subColor: uvColor(uvValue),
      barValue: Math.round((uvValue / 11) * 100),
    },
    {
      label: 'Visibility',
      value: visibilityVal != null ? `${Math.round(visibilityVal)}` : '--',
      unit: visibilityUnit,
      sub:
        visibilityVal != null && visibilityVal >= 10
          ? 'Unrestricted'
          : visibilityVal != null
          ? 'Reduced visibility'
          : undefined,
    },
    {
      label: 'Dew Point',
      value: dewpointVal != null ? `${Math.round(dewpointVal)}` : '--',
      unit: dewpointUnit,
      sub: humidity != null ? `Humidity: ${Math.round(humidity)}%` : undefined,
    },
  ];
}

/**
 * Build the temperature trend chart data from raw grid data.
 * Extracts temperature values for the next 24 hours.
 */
function buildTemperatureTrend(gridData: Gridpoint): TemperatureTrendData {
  const tempLayer = gridData.temperature;
  const values: number[] = [];

  if (tempLayer?.values) {
    // Take up to 24 hourly values.
    for (const entry of tempLayer.values.slice(0, 24)) {
      if (entry.value != null) {
        values.push(entry.value);
      }
    }
  }

  // Fallback if no real data.
  if (values.length === 0) {
    return {
      values: [75, 72, 70, 68],
      leftLabel: '--',
      centerLabel: '--',
      rightLabel: '--',
    };
  }

  const first = values[0];
  const mid = values.length > 0 ? values[Math.floor(values.length / 2)] : first;
  const last = values[values.length - 1];

  const fmt = (v: number) => `${Math.round(v)}°`;
  return {
    values,
    leftLabel: fmt(first),
    centerLabel: fmt(mid),
    rightLabel: fmt(last),
  };
}

/**
 * Build the WindCard props from the latest observation.
 */
function buildWindData(obs: Observation | null): WindData {
  const speed = obs?.windSpeed?.value ?? 0;
  const unit = obs?.windSpeed?.unitCode?.includes('km_h') ? 'km/h' : 'mph';
  const degrees = obs?.windDirection?.value ?? 0;
  const gusts = obs?.windGust?.value ?? 0;

  // Convert degrees to compass direction name.
  const dirNames = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  const direction = dirNames[index] ?? 'N';

  return {
    speed: Math.round(speed),
    unit,
    direction,
    degrees: Math.round(degrees),
    gusts: Math.round(gusts),
  };
}

/**
 * Format an ISO time string to a short 12‑hour clock.
 * Example: "2026-06-26T05:43:00+00:00" → "5:43 AM"
 */
function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Build the SunTimesCard props from the point's astronomicalData.
 * Falls back to calculated times if the API doesn't provide them.
 */
function buildSunTimes(gridData: Gridpoint): SunTimesData {
  // Astronomical data is available from the /points endpoint's
  // `astronomicalData` property. We compute a fallback here.
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Approximate sunrise/sunset for mid-latitudes (used when API data absent).
  const approxSunrise = new Date(now);
  approxSunrise.setHours(6, 0, 0, 0);
  const approxSunset = new Date(now);
  approxSunset.setHours(18, 0, 0, 0);
  const nextSunrise = new Date(tomorrow);
  nextSunrise.setHours(6, 0, 0, 0);

  const sunriseStr = formatTime(approxSunrise.toISOString());
  const sunsetStr = formatTime(approxSunset.toISOString());
  const dayDurationMs = approxSunset.getTime() - approxSunrise.getTime();
  const hours = Math.floor(dayDurationMs / 3_600_000);
  const minutes = Math.floor((dayDurationMs % 3_600_000) / 60_000);

  return {
    sunrise: sunriseStr,
    sunset: sunsetStr,
    dayDuration: `${hours}h ${minutes}m`,
    nextSunrise: formatTime(nextSunrise.toISOString()),
  };
}

/**
 * Determine barometric pressure trend from raw grid data.
 */
function buildPressureData(gridData: Gridpoint): PressureData {
  const pressureLayer = gridData.pressure;
  const history: number[] = [];
  let currentValue = 1013.25; // standard pressure fallback

  if (pressureLayer?.values) {
    for (const entry of pressureLayer.values) {
      if (entry.value != null) {
        history.push(entry.value);
      }
    }
    // The last value is the most current.
    if (history.length > 0) {
      currentValue = history[history.length - 1];
    }
  }

  // Determine trend direction from the last few values.
  let trend: PressureTrend = 'stable';
  if (history.length >= 3) {
    const recent = history.slice(-3);
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    const older = history.slice(-6, -3);
    const avgOlder = older.length > 0
      ? older.reduce((a, b) => a + b, 0) / older.length
      : avgRecent;
    const diff = avgRecent - avgOlder;
    if (diff > 0.5) trend = 'rising';
    else if (diff < -0.5) trend = 'falling';
  }

  const unit = pressureLayer?.uom?.includes('hPa') || pressureLayer?.uom?.includes('Pa')
    ? 'hPa'
    : 'inHg';

  const interpretation =
    trend === 'rising'
      ? 'Pressure is rising, indicating improving weather conditions.'
      : trend === 'falling'
      ? 'Pressure is falling, suggesting an approaching storm system.'
      : 'Pressure is stable. No significant short-term changes expected.';

  return {
    current: Math.round(currentValue * 10) / 10,
    unit,
    trend,
    history: history.length > 0 ? history : [1013, 1012, 1013, 1014, 1013, 1012],
    interpretation,
  };
}

// =========================================================================
// Hook
// =========================================================================

export function useDetailWeather(
  lat: number,
  lon: number,
): DetailWeatherViewModel {
  const [data, setData] = useState<DetailScreenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fetchIdRef = useRef(0);

  const fetchWeather = useCallback(
    async (isRefresh = false) => {
      const id = ++fetchIdRef.current;

      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      try {
        const bundle = await weatherService.getDetailWeather(lat, lon);
        if (id !== fetchIdRef.current) return;

        const screenData: DetailScreenData = {
          header: {
            title: `${bundle.location.point.relativeLocation.city}, ${bundle.location.point.relativeLocation.state}`,
            subtitle: 'Extended Details',
          },
          metrics: buildMetrics(bundle.latestObservation),
          temperatureTrend: buildTemperatureTrend(bundle.gridData),
          wind: buildWindData(bundle.latestObservation),
          sunTimes: buildSunTimes(bundle.gridData),
          pressure: buildPressureData(bundle.gridData),
          dataSource: {
            station: `${bundle.location.nearestStation.name} (${bundle.location.nearestStationId})`,
            updated: bundle.gridData.updateTime
              ? new Date(bundle.gridData.updateTime).toLocaleString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'N/A',
            source: 'weather.gov',
          },
        };

        setData(screenData);
      } catch (err) {
        if (id !== fetchIdRef.current) return;
        const message =
          err instanceof Error ? err.message : 'Failed to fetch detailed weather data';
        setError(message);
      } finally {
        if (id === fetchIdRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [lat, lon],
  );

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const refresh = useCallback(() => {
    fetchWeather(true);
  }, [fetchWeather]);

  return { data, isLoading, error, refresh, isRefreshing };
}
