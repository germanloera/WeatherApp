// ---------------------------------------------------------------------------
// useLocation — Selected location state
//
// Manages the currently viewed location in a global-ish way so every screen
// shares the same lat/lon and city metadata.
//
// Usage:
//   const { location, setLocation, clearLocation } = useLocation();
//
//   setLocation({ lat: 40.7128, lon: -74.0060, city: 'New York', state: 'NY' });
//   console.log(location?.city); // "New York"
// ---------------------------------------------------------------------------

import { useState, useCallback } from 'react';

// =========================================================================
// Types
// =========================================================================

export interface LocationInfo {
  lat: number;
  lon: number;
  city: string;
  state: string;
}

export interface LocationState {
  /** The currently selected location (null before first selection). */
  location: LocationInfo | null;
  /** History of recently viewed locations (max 10). */
  recent: LocationInfo[];
  /** Replace the current location and add to recent. */
  setLocation: (loc: LocationInfo) => void;
  /** Clear the current location (returns to default / GPS). */
  clearLocation: () => void;
  /** Remove all recent history. */
  clearRecent: () => void;
}

// Default location if the user hasn't chosen one yet.
const DEFAULT_LOCATION: LocationInfo = {
  lat: 38.8894,
  lon: -77.0352,
  city: 'Washington',
  state: 'Washington DC',
};

// =========================================================================
// Hook
// =========================================================================

const STORAGE_KEY = '@claro/recent_locations';

/**
 * Loads the recent-locations list from storage.
 * Falls back to an empty array if nothing is stored or on error.
 */
function loadRecent(): LocationInfo[] {
  try {
    const raw = globalThis.__claro_recent_locations as string | undefined;
    if (raw) return JSON.parse(raw) as LocationInfo[];
  } catch {
    // ignore parse errors
  }
  return [];
}

/**
 * Saves recent locations to an in-memory global (replace with
 * AsyncStorage / expo-secure-store for persistence across app restarts).
 */
function saveRecent(recent: LocationInfo[]): void {
  try {
    (globalThis as Record<string, unknown>).__claro_recent_locations =
      JSON.stringify(recent.slice(0, 10));
  } catch {
    // ignore serialization errors
  }
}

export function useLocation(): LocationState {
  const [location, setLocationState] = useState<LocationInfo | null>(
    DEFAULT_LOCATION,
  );
  const [recent, setRecent] = useState<LocationInfo[]>(loadRecent);

  const setLocation = useCallback(
    (loc: LocationInfo) => {
      setLocationState(loc);
      setRecent((prev) => {
        const filtered = prev.filter(
          (r) => !(r.lat === loc.lat && r.lon === loc.lon),
        );
        const updated = [loc, ...filtered].slice(0, 10);
        saveRecent(updated);
        return updated;
      });
    },
    [],
  );

  const clearLocation = useCallback(() => {
    setLocationState(null);
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    saveRecent([]);
  }, []);

  return { location, recent, setLocation, clearLocation, clearRecent };
}
