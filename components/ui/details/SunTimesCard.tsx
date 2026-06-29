import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface SunTimesCardProps {
  sunrise: string;
  sunset: string;
  dayDuration: string;
  nextSunrise?: string;
}

export function SunTimesCard({ sunrise, sunset, dayDuration, nextSunrise }: SunTimesCardProps) {
  const { theme } = useTheme();

  const rows = [
    { label: 'Amanecer', value: sunrise },
    { label: 'Atardecer', value: sunset },
    { label: 'Duración del día', value: dayDuration },
  ];
  if (nextSunrise) {
    rows.push({ label: 'Próximo amanecer', value: nextSunrise });
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.fg }]}>Sol y luz</Text>
      {rows.map((row, i) => (
        <View
          key={i}
          style={[
            styles.row,
            i > 0 && { borderTopWidth: 1, borderTopColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.muted }]}>{row.label}</Text>
          <Text style={[styles.value, { color: theme.colors.fg }]}>
            <Text style={styles.num}>{row.value}</Text>
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
  },
  num: {
    fontFamily: 'SF Mono',
    fontVariant: ['tabular-nums'],
  },
});
