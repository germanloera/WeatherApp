import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

export function HomeIndicator() {
  const { theme } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.colors.bg }]}>
      <View style={[styles.bar, { backgroundColor: theme.colors.fg }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { height: 28, justifyContent: 'center', alignItems: 'center' },
  bar: { width: 134, height: 5, borderRadius: 999, opacity: 0.85 },
});
