import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { DetailMetricData } from '@/src';

interface DetailCardProps {
  data?: DetailMetricData ;
  subColor?: string;
  children?: React.ReactNode;

}

export function DetailCard({ data, subColor, children }: DetailCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.label, { color: theme.colors.muted }]}>{data?.label}</Text>
      <Text style={[styles.value, { color: theme.colors.fg }]}>{data?.value}</Text>
      {data?.sub && (
        <Text style={[styles.sub, { color: subColor || theme.colors.muted }]}>{data?.sub}</Text>
      )}
      {children}
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
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: -0.22,
  },
  sub: {
    fontSize: 12,
    marginTop: 2,
  },
});
