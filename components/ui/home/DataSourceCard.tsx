import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface DataSourceCardProps {
  station?: string;
  updated: string;
  source: string;
}

export function DataSourceCard({ station, updated, source }: DataSourceCardProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {station && <Text style={[styles.meta, { color: theme.colors.muted }]}>
        Datos de: <Text style={{ fontWeight: '500', color: theme.colors.fg }}>{station}</Text>
      </Text>
      }
      <Text style={[styles.updated, { color: theme.colors.muted }]}>
        Actualizado: {updated} · {source}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 18,
  },
  meta: { fontSize: 11, textAlign: 'center' },
  updated: { fontSize: 12, marginTop: 4, textAlign: 'center' },
});
