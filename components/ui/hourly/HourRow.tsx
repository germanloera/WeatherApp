import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { WeatherIcon } from '../home/WeatherIcon';
import type { WeatherCondition } from '../home/WeatherIcon';

interface HourRowProps {
  time: string;
  condition: WeatherCondition;
  conditionText: string;
  subtitle: string;
  temp: string;
  precip?: string;
}

export function HourRow({ time, condition, conditionText, subtitle, temp, precip }: HourRowProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.row, { borderTopColor: theme.colors.border }]}>
      <Text style={[styles.time, { color: theme.colors.muted }]}>{time}</Text>
      <WeatherIcon condition={condition} size={22} color={theme.colors.accent} />
      <View style={styles.cond}>
        <Text style={[styles.condText, { color: theme.colors.fg }]} numberOfLines={1}>
          {conditionText}
        </Text>
        <Text style={[styles.sub, { color: theme.colors.muted }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.tempWrap}>
        <Text style={[styles.temp, { color: theme.colors.fg }]}>{temp.substring(0, 2)}°</Text>
        {precip && (
          <Text style={[styles.precip, { color: theme.colors.accent }]}>{precip}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  time: {
    width: 42,
    fontSize: 13,
    fontFamily: 'SF Mono',
    fontVariant: ['tabular-nums'],
  },
  cond: { flex: 1 },
  condText: { fontSize: 14, lineHeight: 18 },
  sub: { fontSize: 11, lineHeight: 14, marginTop: 1 },
  tempWrap: { alignItems: 'flex-end', minWidth: 44 },
  temp: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SF Mono',
    fontVariant: ['tabular-nums'],
  },
  precip: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'SF Mono',
    fontVariant: ['tabular-nums'],
  },
});
