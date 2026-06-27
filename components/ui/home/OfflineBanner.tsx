import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface OfflineBannerProps {
  visible: boolean;
}

export function OfflineBanner({ visible }: OfflineBannerProps) {
  const { theme } = useTheme();
  if (!visible) return null;
  return (
    <View style={[styles.banner, { backgroundColor: theme.colors.offlineBg }]}>
      <OfflineIcon color="#fff" />
      <Text style={styles.text}>Sin conexión — los datos pueden no estar actualizados</Text>
    </View>
  );
}

function OfflineIcon({ color }: { color: string }) {
  return (
    <View style={styles.iconBox}>
      <View style={[styles.ol, { borderColor: color }]} />
      <View style={[styles.ol, styles.olInner, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: { color: '#fff', fontSize: 12, fontWeight: '500' },
  iconBox: { width: 14, height: 14, justifyContent: 'center', alignItems: 'center' },
  ol: {
    width: 10, height: 6, borderWidth: 1.5,
    borderRadius: 1, position: 'absolute',
  },
  olInner: { width: 6, height: 4, top: 2, left: 2 },
});
