import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface GeoButtonProps {
  onPress: () => void;
}

export function GeoButton({ onPress }: GeoButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Usar mi ubicación actual"
    >
      <GeoIcon color={theme.colors.accent} />
      <Text style={[styles.label, { color: theme.colors.accent }]}>Usar mi ubicación actual</Text>
    </TouchableOpacity>
  );
}

function GeoIcon({ color }: { color: string }) {
  return (
    <View style={styles.icon}>
      <View style={[styles.outer, { borderColor: color }]} />
      <View style={[styles.dot, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 14,
  },
  label: { fontSize: 14, fontWeight: '500', fontFamily: 'SF Pro Text' },
  icon: { width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  outer: {
    width: 16, height: 16, borderRadius: 8, borderWidth: 1.5,
    position: 'absolute',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
