import { useTheme } from '@/constants/ThemeProvider';
import { MetricCardData } from '@/src';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MetricCardProps {
  values?: MetricCardData,
  barColor?: string;
}

export function MetricCard({ values, barColor }: MetricCardProps) {
  const { theme } = useTheme();
  console.log(values)
  return (
    <View>

      {values && <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.label, { color: theme.colors.muted }]}>{values?.label}</Text>
        <Text style={[styles.value, { color: theme.colors.fg }]}>{values?.value}</Text>
        {values?.sub && <Text style={[styles.sub, { color: theme.colors.muted }]}>{values?.sub}</Text>}
        {values?.barValue !== undefined && (
          <View style={[styles.barTrack, { backgroundColor: theme.colors.border }]}>
            <View
              style={[
                styles.barFill,
                { width: `${Math.min(values.barValue, 100)}%` as any, backgroundColor: barColor || theme.colors.accent },
              ]}
            />
          </View>
        )}
      </View>}

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontFamily: 'SF Mono',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  sub: {
    fontSize: 11,
    marginTop: 2,
  },
  barTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
