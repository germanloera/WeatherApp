import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { WeatherIcon } from './WeatherIcon';
import type { WeatherCondition } from './WeatherIcon';

interface HourlyItemProps {
  time: string;
  condition: WeatherCondition;
  temp: string;
  precip?: string;
}

export function HourlyItem({ time, condition, temp, precip }: HourlyItemProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.item}>
      <Text style={[styles.time, { color: theme.colors.muted }]}>{time}</Text>
      <WeatherIcon condition={condition} size={20} color={theme.colors.accent} />
      <Text style={[styles.temp, { color: theme.colors.fg }]}>{temp}</Text>
      {precip && <Text style={[styles.precip, { color: theme.colors.accent }]}>{precip}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { alignItems: 'center', gap: 4, minWidth: 56 },
  time: { fontSize: 11, fontFamily: 'SF Mono' },
  temp: { fontSize: 14, fontWeight: '600', fontFamily: 'SF Mono', fontVariant: ['tabular-nums'] },
  precip: { fontSize: 10, fontFamily: 'SF Mono' },
});
