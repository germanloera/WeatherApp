import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface EmptyStateProps {
  query?: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.fgSoft }]}>
        <SearchEmptyIcon color={theme.colors.muted} />
      </View>
      <Text style={[styles.title, { color: theme.colors.fg }]}>Sin resultados</Text>
      <Text style={[styles.desc, { color: theme.colors.muted }]}>
        {query
          ? `No encontramos ciudades que coincidan con «${query}». Intenta con otro nombre o usa la geolocalización.`
          : 'Busca una ciudad o usa tu ubicación actual para ver el clima.'}
      </Text>
    </View>
  );
}

function SearchEmptyIcon({ color }: { color: string }) {
  return (
    <View style={styles.si}>
      <View style={[styles.siCircle, { borderColor: color }]} />
      <View style={[styles.siHandle, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 17, fontWeight: '600', fontFamily: 'SF Pro Text', marginBottom: 6 },
  desc: { fontSize: 13, lineHeight: 19.5, textAlign: 'center', maxWidth: 280, fontFamily: 'SF Pro Text' },
  si: { width: 22, height: 22, justifyContent: 'center', alignItems: 'center' },
  siCircle: {
    width: 13, height: 13, borderRadius: 6.5,
    borderWidth: 1.5, position: 'absolute', top: 1, left: 1,
  },
  siHandle: {
    width: 7, height: 1.5, borderRadius: 1,
    transform: [{ rotate: '45deg' }],
    position: 'absolute', bottom: 4, right: 0.5,
  },
});
