import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { SparklineChart } from './SparklineChart';

interface PressureCardProps {
  current: number;
  unit: string;
  trend: 'rising' | 'falling' | 'stable';
  data: number[];
  interpretation: string;
}

export function PressureCard({ current, unit, trend, data, interpretation }: PressureCardProps) {
  const { theme } = useTheme();

  const trendIcon = trend === 'rising' ? '↑' : trend === 'falling' ? '↓' : '→';
  const trendColor =
    trend === 'rising'
      ? theme.colors.success
      : trend === 'falling'
      ? theme.colors.error
      : theme.colors.muted;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.fg }]}>Presión atmosférica</Text>
      </View>

      <SparklineChart
        data={data}
        height={40}
        barGap={2}
        barWidth={4}
        leftLabel="-6 h"
        centerLabel={`${current} ${unit}`}
        rightLabel="Ahora"
        accentColor={trend === 'rising' ? theme.colors.success : theme.colors.accent}
      />

      <View style={styles.infoRow}>
        <Text style={[styles.trend, { color: trendColor }]}>
          {trendIcon} {trend === 'rising' ? 'Subiendo' : trend === 'falling' ? 'Bajando' : 'Estable'}
        </Text>
        <Text style={[styles.current, { color: theme.colors.fg }]}>
          <Text style={styles.num}>{current}</Text>
          <Text style={[styles.unit, { color: theme.colors.muted }]}> {unit}</Text>
        </Text>
      </View>

      <Text style={[styles.interpretation, { color: theme.colors.muted }]}>
        {interpretation}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  trend: {
    fontSize: 13,
    fontWeight: '500',
  },
  current: {
    fontSize: 18,
    fontWeight: '600',
  },
  num: {
    fontFamily: 'SF Mono',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 14,
    fontWeight: '400',
  },
  interpretation: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 19.5,
  },
});
