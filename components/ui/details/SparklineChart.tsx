import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface SparklineChartProps {
  data: number[];
  height?: number;
  barGap?: number;
  barWidth?: number;
  labels?: string[];
  showLabels?: boolean;
  accentColor?: string;
  mutedColor?: string;
  leftLabel?: string;
  centerLabel?: string;
  rightLabel?: string;
}

export function SparklineChart({
  data,
  height = 60,
  barGap = 3,
  barWidth = 6,
  showLabels = false,
  accentColor,
  mutedColor,
  leftLabel,
  centerLabel,
  rightLabel,
}: SparklineChartProps) {
  const { theme } = useTheme();
  const max = Math.max(...data);

  return (
    <View>
      <View style={[styles.chart, { height, gap: barGap }]}>
        {data.map((v, i) => {
          const pct = max > 0 ? (v / max) * 100 : 0;
          const isMuted = i < data.length / 3 || i > (data.length * 2) / 3;
          const bg = isMuted
            ? mutedColor || theme.colors.accentSoft
            : accentColor || theme.colors.accent;
          return (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  width: barWidth,
                  height: `${Math.max(pct, 4)}%` as any,
                  backgroundColor: bg,
                  borderRadius: barWidth / 3,
                },
              ]}
            />
          );
        })}
      </View>
      {(showLabels || leftLabel || centerLabel || rightLabel) && (
        <View style={styles.labels}>
          <Text style={[styles.label, { color: theme.colors.muted }]}>
            {leftLabel || ''}
          </Text>
          <Text style={[styles.label, { color: theme.colors.muted, fontWeight: '600' }]}>
            {centerLabel || ''}
          </Text>
          <Text style={[styles.label, { color: theme.colors.muted }]}>
            {rightLabel || ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  bar: {
    minHeight: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: 'SF Mono',
  },
});
