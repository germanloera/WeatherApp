import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface CompactBarProps {
  value: number; // 0–100
  color?: string;
}

export function CompactBar({ value, color }: CompactBarProps) {
  const { theme } = useTheme();
  const fillColor = color || theme.colors.accent;
  return (
    <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
      <View style={[styles.fill, { width: `${Math.min(value, 100)}%` as any, backgroundColor: fillColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 4, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
});
