import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { OfflineBanner } from '@/components/ui/home/OfflineBanner';
import { StateManager } from '@/components/ui/home/StateManager';
import { Header } from '@/components/ui/home/Header';
import { SearchBar } from '@/components/ui/search/SearchBar';
import { GeoButton } from '@/components/ui/search/GeoButton';
import { FilterRow } from '@/components/ui/search/FilterRow';
import { CityRow } from '@/components/ui/search/CityRow';
import { EmptyState } from '@/components/ui/search/EmptyState';

export interface CityData {
  id: string;
  name: string;
  state: string;
  temp: number;
  lat: number;
  lon: number;
  icon: 'sunny' | 'partlyCloudy' | 'cloudy' | 'rainy';
}

const CITIES: CityData[] = [
  { id: 'washington', name: 'Washington', state: 'Distrito de Columbia', temp: 92, lat: 38.8894, lon: -77.0352, icon: 'sunny' },
  { id: 'nyc', name: 'Nueva York', state: 'Nueva York', temp: 88, lat: 40.7128, lon: -74.0060, icon: 'partlyCloudy' },
  { id: 'la', name: 'Los Ángeles', state: 'California', temp: 82, lat: 34.0522, lon: -118.2437, icon: 'sunny' },
  { id: 'chicago', name: 'Chicago', state: 'Illinois', temp: 79, lat: 41.8781, lon: -87.6298, icon: 'partlyCloudy' },
  { id: 'houston', name: 'Houston', state: 'Texas', temp: 95, lat: 29.7604, lon: -95.3698, icon: 'sunny' },
  { id: 'phoenix', name: 'Phoenix', state: 'Arizona', temp: 107, lat: 33.4484, lon: -112.0740, icon: 'sunny' },
  { id: 'denver', name: 'Denver', state: 'Colorado', temp: 85, lat: 39.7392, lon: -104.9903, icon: 'sunny' },
  { id: 'seattle', name: 'Seattle', state: 'Washington', temp: 72, lat: 47.6062, lon: -122.3321, icon: 'cloudy' },
  { id: 'miami', name: 'Miami', state: 'Florida', temp: 90, lat: 25.7617, lon: -80.1918, icon: 'rainy' },
  { id: 'sf', name: 'San Francisco', state: 'California', temp: 68, lat: 37.7749, lon: -122.4194, icon: 'cloudy' },
];

const FILTERS = [
  { key: 'all', label: 'Populares' },
  { key: 'capitals', label: 'Capitales' },
  { key: 'beach', label: 'Playas' },
  { key: 'mountain', label: 'Montaña' },
];

const CITY_FILTER_MAP: Record<string, string[]> = {
  capitals: ['washington', 'phoenix', 'denver'],
  beach: ['la', 'miami', 'sf'],
  mountain: ['denver', 'seattle', 'sf'],
};

interface SearchScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  offline?: boolean;
}

export default function SearchScreen({ onNavigate, offline = false }: SearchScreenProps) {
  const { theme, isDark } = useTheme();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCities = useMemo(() => {
    const trimmed = query.toLowerCase().trim();
    let cities = CITIES;

    if (activeFilter !== 'all') {
      const allowed = CITY_FILTER_MAP[activeFilter] ?? [];
      cities = cities.filter((c) => allowed.includes(c.id));
    }

    if (trimmed) {
      cities = cities.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.state.toLowerCase().includes(trimmed)
      );
    }

    return cities;
  }, [query, activeFilter]);

  const handleGeoPress = useCallback(() => {
    Alert.alert(
      'Usar ubicación',
      'La aplicación usaría la geolocalización del dispositivo para obtener tu ubicación actual y mostrar el clima correspondiente.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleCityPress = useCallback(
    (city: CityData) => {
      onNavigate('weather', { lat: city.lat, lon: city.lon, city: city.name, state: city.state });
    },
    [onNavigate]
  );

  const handleTabPress = useCallback(
    (key: string) => {
      onNavigate(key);
    },
    [onNavigate]
  );

  const renderContent = () => (
    <View style={[styles.flex, { backgroundColor: theme.colors.bg }]}>
      <Header
        greeting="Encuentra tu ciudad"
        title="Buscar ubicación"
        isDark={isDark}
        onToggleDark={() => {}}
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <SearchBar value={query} onChangeText={setQuery} />
          <GeoButton onPress={handleGeoPress} />
          <FilterRow
            filters={FILTERS}
            activeFilter={activeFilter}
            onFilterPress={setActiveFilter}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.fg }]}>
            {query ? 'Resultados' : 'Ciudades populares'}
          </Text>

          {filteredCities.length === 0 ? (
            <EmptyState query={query} />
          ) : (
            filteredCities.map((city, i) => (
              <CityRow
                key={city.id}
                city={city}
                onPress={() => handleCityPress(city)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );

  return (

    <View style={ styles.flex }>
      <OfflineBanner visible={offline} />
      <StateManager
        latency={1000}
        renderContent={renderContent}
      />
    </View>
  
  );
}



const styles = StyleSheet.create({
  flex: { flex: 1, },
  scroll: { paddingBottom: 28 },
  section: { paddingHorizontal: 20, gap: 12, paddingTop: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SF Pro Text',
    lineHeight: 20.8,
    marginBottom: 4,
  },
});
