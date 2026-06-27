import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface DayDividerProps {
  label: string;
}

export function DayDivider({ label }: DayDividerProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.divider, { borderTopColor: theme.colors.border }]}>
      <Text style={[styles.label, { color: theme.colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: 'SF Mono',
  },
});
