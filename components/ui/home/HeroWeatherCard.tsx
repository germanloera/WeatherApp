import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { WeatherIcon } from './WeatherIcon';
import type { WeatherCondition } from './WeatherIcon';

interface HeroWeatherCardProps {
  temperature: number;
  unit: string;
  condition: string;
  conditionIcon: WeatherCondition;
  feelsLike: number;
  precipitation: number;
  windSpeed: string;
  windDir: string;
  humidity: number;
  lastObs: string;
}

export function HeroWeatherCard({
  temperature,
  unit,
  condition,
  conditionIcon,
  feelsLike,
  precipitation,
  windSpeed,
  windDir,
  humidity,
  lastObs,
}: HeroWeatherCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.weatherFrom }]}>
      <View style={styles.tempRow}>
        <WeatherIcon condition={conditionIcon} size={52} color="#fff" />
        <Text style={styles.temp}>
          {temperature}
          <Text style={styles.unit}>°{unit}</Text>
        </Text>
      </View>
      <Text style={styles.condition}>{condition}</Text>
      <Text style={[styles.feels, { color: theme.colors.accentCardMeta }]}>
        Sensación térmica: {feelsLike}°{unit} · Prob. de precipitación: {precipitation}%
      </Text>
      <View style={styles.metricsRow}>
        <Metric label="VIENTO" value={`${windSpeed} ${windDir}`} />
        <Metric label="HUMEDAD" value={`${humidity}%`} />
        <Metric label="ÚLT. OBS." value={lastObs} />
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={mStyles.container}>
      <Text style={mStyles.label}>{label}</Text>
      <Text style={mStyles.value}>{value}</Text>
    </View>
  );
}

const mStyles = StyleSheet.create({
  container: { alignItems: 'center' },
  label: { color: 'rgba(255,255,255,0.72)', fontSize: 10, fontFamily: 'SF Mono' },
  value: { color: '#fff', fontWeight: '600', fontSize: 14 },
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  temp: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '700',
    letterSpacing: -2.16,
    fontFamily: 'SF Pro Display',
  },
  unit: { fontSize: 28, fontWeight: '400', opacity: 0.7 },
  condition: { color: '#fff', fontSize: 16, fontWeight: '500', marginTop: 8 },
  feels: { color: 'rgba(255,255,255,0.72)', marginTop: 4, fontSize: 11, textAlign: 'center' },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
});
