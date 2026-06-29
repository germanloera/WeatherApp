import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface CityData {
  name: string;
  state: string;
  temp: number;
  icon: 'sunny' | 'partlyCloudy' | 'cloudy' | 'rainy';
}

interface CityRowProps {
  city: CityData;
  onPress: () => void;
}

export function CityRow({ city, onPress }: CityRowProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.row, { borderTopColor: theme.colors.border }]}
      onPress={onPress}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={`${city.name}, ${city.state} — ${city.temp}°`}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentSoft }]}>
        <LocationIcon color={theme.colors.accent} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.colors.fg }]} numberOfLines={1}>
          {city.name}
        </Text>
        <Text style={[styles.state, { color: theme.colors.muted }]} numberOfLines={1}>
          {city.state}
        </Text>
      </View>
      <Text style={[styles.temp, { color: theme.colors.fg }]}>{city.temp}°</Text>
    </TouchableOpacity>
  );
}

function LocationIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: color }} />
      <View style={{ position: 'absolute', bottom: 0, width: 2, height: 9, borderRadius: 1, backgroundColor: color }} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '500', fontFamily: 'SF Pro Text', lineHeight: 18.75 },
  state: { fontSize: 12, fontFamily: 'SF Mono', lineHeight: 16.8, marginTop: 1 },
  temp: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SF Mono',
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
});
