// ---------------------------------------------------------------------------
// useSearch — Search screen view-model
//
// Manages search query state, active filter, and city filtering logic.
// In production this would call a geocoding API; for now it works with
// the built-in city list and can be extended by plugging in a geocoder.
//
// Usage:
//   const {
//     query, setQuery,
//     activeFilter, setActiveFilter,
//     filters,
//     results,
//   } = useSearch();
//
//   <SearchBar value={query} onChangeText={setQuery} />
//   <FilterRow filters={filters} activeFilter={activeFilter} onFilterPress={setActiveFilter} />
//   {results.map(city => <CityRow key={city.id} city={city} />)}
// ---------------------------------------------------------------------------

import { useState, useMemo, useCallback } from 'react';
import type { CitySearchResult, FilterOption } from '../types/ui';

// =========================================================================
// Built-in city catalogue
//
// These match the CityRow component in the search screen.
// Extend this list or replace with a geocoding API in production.
// =========================================================================

export const BUILT_IN_CITIES: CitySearchResult[] = [
  { id: 'washington',  name: 'Washington',     state: 'Washington DC',        temp: 92, lat: 38.8894, lon: -77.0352,  icon: 'sunny' },
  { id: 'nyc',         name: 'New York',        state: 'New York',            temp: 88, lat: 40.7128, lon: -74.0060,  icon: 'partlyCloudy' },
  { id: 'la',          name: 'Los Angeles',     state: 'California',          temp: 82, lat: 34.0522, lon: -118.2437, icon: 'sunny' },
  { id: 'chicago',     name: 'Chicago',         state: 'Illinois',            temp: 79, lat: 41.8781, lon: -87.6298,  icon: 'partlyCloudy' },
  { id: 'houston',     name: 'Houston',         state: 'Texas',               temp: 95, lat: 29.7604, lon: -95.3698,  icon: 'sunny' },
  { id: 'phoenix',     name: 'Phoenix',         state: 'Arizona',             temp: 107,lat: 33.4484, lon: -112.0740, icon: 'sunny' },
  { id: 'denver',      name: 'Denver',          state: 'Colorado',            temp: 85, lat: 39.7392, lon: -104.9903, icon: 'sunny' },
  { id: 'seattle',     name: 'Seattle',         state: 'Washington',          temp: 72, lat: 47.6062, lon: -122.3321, icon: 'cloudy' },
  { id: 'miami',       name: 'Miami',           state: 'Florida',             temp: 90, lat: 25.7617, lon: -80.1918,  icon: 'rainy' },
  { id: 'sf',          name: 'San Francisco',   state: 'California',          temp: 68, lat: 37.7749, lon: -122.4194, icon: 'cloudy' },
];

const FILTERS: FilterOption[] = [
  { key: 'all',        label: 'Popular' },
  { key: 'capitals',   label: 'Capitals' },
  { key: 'beach',      label: 'Beach' },
  { key: 'mountain',   label: 'Mountain' },
];

const CITY_FILTER_MAP: Record<string, string[]> = {
  capitals: ['washington', 'phoenix', 'denver'],
  beach:    ['la', 'miami', 'sf'],
  mountain: ['denver', 'seattle', 'sf'],
};

// =========================================================================
// View-model return type
// =========================================================================

export interface SearchViewModel {
  /** Current search query text. */
  query: string;
  /** Update the query string. */
  setQuery: (text: string) => void;
  /** Currently active filter key. */
  activeFilter: string;
  /** Change the active filter. */
  setActiveFilter: (key: string) => void;
  /** Available filter options. */
  filters: FilterOption[];
  /** Filtered city results. */
  results: CitySearchResult[];
  /** Total result count. */
  resultCount: number;
}

// =========================================================================
// Hook
// =========================================================================

export function useSearch(): SearchViewModel {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const results = useMemo(() => {
    const trimmed = query.toLowerCase().trim();
    let cities = BUILT_IN_CITIES;

    // Apply category filter.
    if (activeFilter !== 'all') {
      const allowed = CITY_FILTER_MAP[activeFilter] ?? [];
      cities = cities.filter((c) => allowed.includes(c.id));
    }

    // Apply text search.
    if (trimmed) {
      cities = cities.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.state.toLowerCase().includes(trimmed),
      );
    }

    return cities;
  }, [query, activeFilter]);

  const resultCount = results.length;

  return {
    query,
    setQuery,
    activeFilter,
    setActiveFilter,
    filters: FILTERS,
    results,
    resultCount,
  };
}
