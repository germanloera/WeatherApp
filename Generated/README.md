# weather.gov API — Clean Architecture Client + ViewModels

TypeScript client library for the [National Weather Service API](https://api.weather.gov/).
Built with Axios, fully typed, and organized in a clean-architecture style with React hooks (ViewModels) that bridge the API layer to the UI components.

---

## Complete Directory Structure

```
Generated/
└── README.md                                     # This file

src/                                              # Copy into your project root
├── index.ts                                      # Public entry point
├── api/
│   ├── client/
│   │   └── httpClient.ts                         # Axios instance, interceptors, WeatherApiError
│   ├── endpoints/
│   │   ├── points.ts                             # GET /points/{lat},{lon}
│   │   ├── gridpoints.ts                         # GET /gridpoints/{wfo}/{x},{y}/forecast (+ hourly, raw)
│   │   ├── observations.ts                       # GET /stations/{id}/observations (/latest, history, list)
│   │   ├── alerts.ts                             # GET /alerts/active (by area, zone, id, count, types)
│   │   ├── zones.ts                              # GET /zones/{type}/{zoneId} (/forecast, /stations, /observations)
│   │   └── index.ts
│   └── types/
│       ├── enums.ts                              # WindDirection, AlertSeverity, WeatherPhenomenon…
│       ├── models.ts                             # All API models: Point, Gridpoint, Observation, Alert…
│       └── index.ts
└── viewmodels/                                   # ViewModel layer (React hooks + services)
    ├── index.ts                                  # Public barrel — import everything from here
    ├── types/
    │   └── ui.ts                                 # UI-oriented types (maps API → component props)
    ├── services/
    │   └── weatherService.ts                     # Orchestrates multi-step API flows (point → grid → data)
    └── hooks/
        ├── useLocation.ts                        # Selected/recent-location state management
        ├── useCurrentWeather.ts                   # Home screen view-model
        ├── useDetailWeather.ts                    # Detail screen view-model
        ├── useHourlyForecast.ts                   # Hourly screen view-model
        └── useSearch.ts                          # Search screen view-model
```


---

## Quick Start

### 1. Install dependencies

```bash
npm install axios
# or
yarn add axios
```

### 2. Copy the files

Copy the entire `src/` folder into your project root:

```
tu-proyecto/
├── src/                     (← src/ completo — API + ViewModels)
│   ├── index.ts
│   ├── api/
│   │   ├── client/
│   │   ├── endpoints/
│   │   └── types/
│   └── viewmodels/
│       ├── index.ts
│       ├── types/
│       ├── services/
│       └── hooks/
├── app/
├── components/
├── constants/
└── ...
```

### 3. Import and use

```ts
import { useCurrentWeather, useLocation, useHourlyForecast } from '../viewmodels';
import { useDetailWeather } from '../viewmodels';
import { useSearch } from '../viewmodels';

// =========================================================================
// Home screen — current weather
// =========================================================================
function HomeScreen() {
  const { location } = useLocation();
  const { data, isLoading, error, refresh } = useCurrentWeather(
    location?.lat ?? 38.88,
    location?.lon ?? -77.03,
  );

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorCard onRetry={refresh} />;
  if (!data) return null;

  return (
    <ScrollView>
      <Header greeting={data.header.greeting} title={data.header.title} />
      <HeroWeatherCard {...data.hero} />
      <View style={styles.metricGrid}>
        {data.metrics.map((m, i) => <MetricCard key={i} {...m} />)}
      </View>
      <HourlyStrip data={data.hourly} onSeeAll={() => {}} />
      <DataSourceCard {...data.dataSource} />
    </ScrollView>
  );
}

// =========================================================================
// Detail screen — extended weather
// =========================================================================
function DetailScreen() {
  const { location } = useLocation();
  const { data, isLoading, error, refresh } = useDetailWeather(
    location?.lat ?? 38.88,
    location?.lon ?? -77.03,
  );

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorCard onRetry={refresh} />;
  if (!data) return null;

  return (
    <ScrollView>
      <Header greeting={data.header.subtitle} title={data.header.title} />
      <View style={styles.metricGrid}>
        {data.metrics.map((m, i) => <DetailCard key={i} {...m} />)}
      </View>
      <SparklineChart {...data.temperatureTrend} />
      <WindCard {...data.wind} />
      <SunTimesCard {...data.sunTimes} />
      <PressureCard {...data.pressure} />
      <DataSourceCard {...data.dataSource} />
    </ScrollView>
  );
}
```

---

## Complete ViewModel API

### `useLocation()`

Global-ish location state shared across all screens.

```ts
const { location, recent, setLocation, clearLocation, clearRecent } = useLocation();

// On search result selected:
setLocation({ lat: 40.7128, lon: -74.0060, city: 'New York', state: 'NY' });
```

| Return        | Type                          | Description                            |
|---------------|-------------------------------|----------------------------------------|
| `location`    | `LocationInfo \| null`        | Current lat/lon/city/state             |
| `recent`      | `LocationInfo[]`              | Recently viewed (max 10)               |
| `setLocation` | `(loc: LocationInfo) => void` | Select location + add to recent        |
| `clearLocation` | `() => void`                | Deselect (falls to default)            |
| `clearRecent` | `() => void`                  | Clear history                          |

---

### `useCurrentWeather(lat, lon, unit?)`

Home screen view-model. Calls `WeatherService.getCurrentWeather()` which resolves the coordinate → grid → forecast → observation → alerts.

```ts
const { data, isLoading, error, refresh, isRefreshing } = useCurrentWeather(38.88, -77.03, 'us');
```

| Return      | Type                          | Description                          |
|-------------|-------------------------------|--------------------------------------|
| `data`      | `HomeScreenData \| null`      | Formatted props for all home widgets |
| `isLoading` | `boolean`                     | Initial load in progress             |
| `error`     | `string \| null`              | Error message                        |
| `refresh`   | `() => void`                  | Background re-fetch                  |
| `isRefreshing` | `boolean`                  | Background refresh in progress       |

**`HomeScreenData` shape:**

```ts
interface HomeScreenData {
  header:    { greeting: string; title: string };
  hero:      HeroWeatherData;               // → <HeroWeatherCard />
  metrics:   MetricCardData[];              // → <MetricCard /> array
  hourly:    HourlyStripItem[];             // → <HourlyStrip data={} />
  dataSource: DataSourceData;               // → <DataSourceCard />
}
```

All field names match the component props exactly. You can spread directly:

```tsx
<HeroWeatherCard {...data.hero} />
<MetricCard {...data.metrics[0]} />
<HourlyStrip data={data.hourly} />
<DataSourceCard {...data.dataSource} />
```

---

### `useDetailWeather(lat, lon)`

Detail (extended) screen view-model. Calls `WeatherService.getDetailWeather()` for raw grid data + observations.

```ts
const { data, isLoading, error, refresh } = useDetailWeather(38.88, -77.03);
```

| Return  | Type                            | Description                               |
|---------|---------------------------------|-------------------------------------------|
| `data`  | `DetailScreenData \| null`      | Formatted props for all detail widgets    |

**`DetailScreenData` shape:**

```ts
interface DetailScreenData {
  header:           { title: string; subtitle: string };
  metrics:          DetailMetricData[];          // → <DetailCard /> array (pressure, UV, visibility, dew point)
  temperatureTrend: TemperatureTrendData;        // → <SparklineChart />
  wind:             WindData;                     // → <WindCard />
  sunTimes:         SunTimesData;                // → <SunTimesCard />
  pressure:         PressureData;                // → <PressureCard />
  dataSource:       DataSourceData;              // → <DataSourceCard />
}
```

---

### `useHourlyForecast(lat, lon, unit?)`

Hourly screen view-model. Groups the 7‑day hourly forecast by calendar day.

```ts
const { data, isLoading, error, refresh } = useHourlyForecast(38.88, -77.03, 'us');
```

| Return  | Type                              | Description                                       |
|---------|-----------------------------------|---------------------------------------------------|
| `data`  | `HourlyScreenData \| null`        | Days with hours ready for DayDivider + HourRow    |

**`HourlyScreenData` shape:**

```ts
interface HourlyScreenData {
  header:     { greeting: string; title: string };
  days:       DayGroup[];   // each DayGroup → <DayDivider label={} /> + N × <HourRow />
  dataSource: DataSourceData;
}

interface DayGroup {
  label: string;     // "Viernes 26 de junio"
  hours: HourlyRowData[];
}

interface HourlyRowData {
  time: string;           // "1 PM"
  condition: WeatherCondition;
  conditionText: string;  // "Parcialmente nublado"
  subtitle: string;       // "Humedad: 45% · Viento: O 5 mph"
  temp: string;           // "90°"
  precip?: string;        // "59%"
}
```

Rendering:

```tsx
{data.days.map(day => (
  <React.Fragment key={day.label}>
    <DayDivider label={day.label} />
    {day.hours.map((hour, idx) => <HourRow key={idx} {...hour} />)}
  </React.Fragment>
))}
```

---

### `useSearch()`

Search screen view-model. Manages query, filter, and result filtering from a built-in city catalogue.

```ts
const { query, setQuery, activeFilter, setActiveFilter, filters, results, resultCount } = useSearch();
```

| Return          | Type                | Description                         |
|-----------------|---------------------|-------------------------------------|
| `query`         | `string`            | Current search text                 |
| `setQuery`      | `(text) => void`    | Update search                       |
| `activeFilter`  | `string`            | Active filter key                   |
| `setActiveFilter` | `(key) => void`   | Change filter                       |
| `filters`       | `FilterOption[]`    | Filter chips data                   |
| `results`       | `CitySearchResult[]`| Filtered city results               |
| `resultCount`   | `number`            | Number of results                   |

---

## WeatherService (advanced)

The `WeatherService` class orchestrates the multi-step API flow. Each method:

1. Calls `PointsApi.getPoint()` to resolve the coordinate → grid office + X + Y
2. Finds the nearest observation station
3. Fetches the required forecast/grid/observation data in parallel
4. Returns ready-to-use typed bundles

```ts
import { weatherService } from '../viewmodels';

// Get everything for the home screen
const bundle = await weatherService.getCurrentWeather(38.88, -77.03);
console.log(bundle.forecast12h.periods[0].temperature);  // current temp
console.log(bundle.latestObservation?.timestamp);         // latest obs time

// Get raw gridded data for the detail screen
const detail = await weatherService.getDetailWeather(38.88, -77.03);
console.log(detail.gridData.temperature?.values);         // temp time series
console.log(detail.gridData.pressure?.values);            // pressure time series
```

You can also instantiate your own with a custom Axios client:

```ts
import { WeatherService } from '../viewmodels';
import { createHttpClient } from '../src/api/client/httpClient';

const customClient = createHttpClient('(MyApp/1.0, dev@myapp.com)', 10000);
const myService = new WeatherService(); // uses httpClient singleton internally
```

---

## Integration Guide

### Step 1 — Install packages

```bash
npm install axios
# Optional: for production persistence of recent locations
npx expo install @react-native-async-storage/async-storage
```

### Step 2 — Copy files

```
tu-proyecto/
├── src/
│   └── api/weather/        ← Copy Generated/src/
│       └── ...
└── viewmodels/             ← Copy Generated/viewmodels/
    └── ...
```

### Step 3 — Update import paths

The viewmodels import from `../api/...` (internal to `src/`) and from `../../../components/...` (pointing to the project's `components/` folder). These paths are already correct when `src/` sits at the project root alongside `components/`, `app/`, etc.

If you place `src/` in a different location, adjust:

| File | Import | Needs update if |
|---|---|---|
| `src/viewmodels/hooks/*.ts` | `'../../../components/...'` | `src/` is nested deeper than project root |
| `src/viewmodels/services/weatherService.ts` | `'../api/...'` | The relative path between `viewmodels/` and `api/` changes |

Alternatively, set up TypeScript path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@api/*": ["./src/api/*"],
      "@viewmodels/*": ["./src/viewmodels/*"],
      "@components/*": ["./components/*"]
    }
  }
}
```

### Step 4 — Set your User-Agent

Edit `src/api/client/httpClient.ts` line ~35:

```ts
const DEFAULT_USER_AGENT = '(MyWeatherApp/1.0, contact@myapp.com)';
```

The NWS API **requires** a valid User-Agent. Include a way to contact you.

### Step 5 — Wire up the location provider

In your root layout (`app/_layout.tsx` or similar), provide the location context so all screens share the same selected location:

```tsx
import { useLocation } from '../viewmodels';

// Option A: Pass via React Context
const LocationContext = createContext<ReturnType<typeof useLocation>>(null!);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const locationState = useLocation();
  return (
    <LocationContext.Provider value={locationState}>
      {children}
    </LocationContext.Provider>
  );
}

// Option B: Simply call useLocation() in each screen component
// The hook holds its state in-memory — all instances share the same
// default location. Use the Context approach for tighter coupling.
```

### Step 6 — Use in screens

**Home screen** (`app/(tabs)/index.tsx`):

```tsx
import { useCurrentWeather, useLocation } from '../../viewmodels';

export default function HomeScreen() {
  const { location } = useLocation();
  const { data, isLoading, error, refresh } = useCurrentWeather(
    location?.lat ?? 38.8894,
    location?.lon ?? -77.0352,
    'us',
  );

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorCard onRetry={refresh} />;
  if (!data) return null;

  // ...render with data.header, data.hero, data.metrics, data.hourly, data.dataSource
}
```

**Detail screen** (`app/(tabs)/detail.tsx`):

```tsx
import { useDetailWeather, useLocation } from '../../viewmodels';

export default function DetailScreen() {
  const { location } = useLocation();
  const { data, isLoading, error, refresh } = useDetailWeather(
    location?.lat ?? 38.8894,
    location?.lon ?? -77.0352,
  );

  // ...same pattern
}
```

**Hourly screen** (`app/(tabs)/hourly.tsx`):

```tsx
import { useHourlyForecast, useLocation } from '../../viewmodels';

export default function HourlyScreen() {
  const { location } = useLocation();
  const { data, isLoading, error, refresh } = useHourlyForecast(
    location?.lat ?? 38.8894,
    location?.lon ?? -77.0352,
    'us',
  );
}
```

**Search screen** (`app/(tabs)/search.tsx`):

```tsx
import { useSearch } from '../../viewmodels';

export default function SearchScreen({ onNavigate }: { onNavigate: any }) {
  const { query, setQuery, activeFilter, setActiveFilter, filters, results } = useSearch();
  // ...
}
```

### Step 7 — Refresh (pull-to-refresh)

All hooks expose a `refresh()` callback. Wire it to a pull-to-refresh gesture:

```tsx
import { RefreshControl } from 'react-native';

<ScrollView
  refreshControl={
    <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
  }
>
  {/* content */}
</ScrollView>
```

---

## Data Flow Diagram

```
User selects location (search / GPS)
          │
          ▼
   useLocation().setLocation({ lat, lon, city, state })
          │
          ▼
   ┌────────────────────────────────────────────────┐
   │  useCurrentWeather(lat, lon)                    │
   │  useDetailWeather(lat, lon)                     │
   │  useHourlyForecast(lat, lon)                    │
   └────────────────────────────────────────────────┘
          │
          ▼
   WeatherService (orchestrator)
          │
          ├─ PointsApi.getPoint()       → gridId, gridX, gridY, city/state
          ├─ GridpointsApi.getForecast()  → 12h periods
          ├─ GridpointsApi.getHourlyForecast() → hourly periods
          ├─ GridpointsApi.getGridData() → raw layers (temp, pressure, wind…)
          ├─ ObservationsApi.getLatestObservation() → current conditions
          └─ AlertsApi.getActiveAlerts() → watches/warnings
          │
          ▼
   Hook maps API data → UI types (HeroWeatherData, MetricCardData, etc.)
          │
          ▼
   Screen receives { data, isLoading, error, refresh }
          │
          ├─ isLoading  →  <Skeleton />
          ├─ error      →  <ErrorCard onRetry={refresh} />
          └─ data       →  <HeroWeatherCard /> <MetricCard /> <HourlyStrip /> …
```

---

## Customising the WeatherCondition mapping

The hooks use a heuristic (`mapCondition()`) that reads the NWS `shortForecast` string and maps it to one of the app's `WeatherCondition` icons:

| shortForecast contains | Icon           |
|------------------------|----------------|
| sunny, clear           | `sunny`        |
| partly, mostly cloudy  | `partly-cloudy`|
| cloudy, overcast       | `cloudy`       |
| thunderstorm, tstorm   | `stormy`       |
| rain, shower, drizzle   | `rainy`        |
| snow, blizzard         | `snowy`        |
| fog, haze, mist        | `foggy`        |
| wind                   | `windy`        |

Edit the `mapCondition()` function in each hook to fine-tune the mapping.

---

## Required packages

| Package | Purpose | Install command |
|---|---|---|
| `axios` | HTTP client | `npm install axios` |
| `@react-native-async-storage/async-storage` | (Optional) Persist recent locations | `npx expo install @react-native-async-storage/async-storage` |

---

## Integration Checklist

- [ ] Install `axios`
- [ ] Copy the entire `src/` folder into your project root
- [ ] Replace the default User-Agent in `httpClient.ts` with your app name + contact
- [ ] Set up `useLocation()` — either as Context provider or call directly in screens
- [ ] Replace the hardcoded mock data in each screen with the corresponding view-model hook
- [ ] Wire `refresh()` to pull-to-refresh
- [ ] Run `npx tsc --noEmit` to check for type errors
- [ ] (Optional) Install `@react-native-async-storage/async-storage` for location persistence

---

## Example: Replacing mock data in index.tsx

**Before (mock data):**

```tsx
const HOURLY_DATA = [
  { time: 'Ahora', condition: 'sunny', temp: '92°', precip: '59%' },
  // ...
];

export default function CurrentWeatherScreen() {
  return (
    <HeroWeatherCard temperature={92} unit="F" condition="..." conditionIcon="sunny" feelsLike={96} precipitation={59} windSpeed="6 mph" windDir="O" humidity={45} lastObs="12:00 PM" />
    <MetricCard label="Precipitation" value="59%" />
    <HourlyStrip data={HOURLY_DATA} />
    <DataSourceCard station="..." updated="..." source="weather.gov" />
  );
}
```

**After (view-model):**

```tsx
import { useCurrentWeather, useLocation } from '../../viewmodels';

export default function CurrentWeatherScreen() {
  const { location } = useLocation();
  const { data, isLoading, error, refresh } = useCurrentWeather(
    location?.lat ?? 38.8894,
    location?.lon ?? -77.0352,
    'us',
  );

  return (
    <StateManager
      isLoading={isLoading}
      error={error}
      onRetry={refresh}
    >
      {data && (
        <ScrollView>
          <Header greeting={data.header.greeting} title={data.header.title} />
          <HeroWeatherCard {...data.hero} />
          <View style={styles.metricGrid}>
            {data.metrics.map((m, i) => (
              <View key={i} style={styles.metricCol}>
                <MetricCard {...m} />
              </View>
            ))}
          </View>
          <HourlyStrip data={data.hourly} onSeeAll={handleHourlySeeAll} />
          <DataSourceCard {...data.dataSource} />
        </ScrollView>
      )}
    </StateManager>
  );
}
```
