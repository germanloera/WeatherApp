import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface ErrorCardProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorCard({
  title = 'Error de conexión',
  description = 'No pudimos obtener los datos del clima. Verifica tu conexión a internet e intenta de nuevo.',
  onRetry,
}: ErrorCardProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.errorBg, borderColor: theme.colors.errorBorder }]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.errorIcon }]}>
        <View style={styles.exclMark}>
          <Text style={styles.exclText}>!</Text>
        </View>
      </View>
      <Text style={[styles.title, { color: theme.colors.fg }]}>{title}</Text>
      <Text style={[styles.desc, { color: theme.colors.muted }]}>{description}</Text>
      {onRetry && (
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: theme.colors.accent }]}
          onPress={onRetry}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Intentar de nuevo"
        >
          <RetryIcon color="#fff" />
          <Text style={styles.retryText}>Intentar de nuevo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function RetryIcon({ color }: { color: string }) {
  return (
    <View style={styles.ri}>
      <View style={[styles.riA, { borderColor: color }]} />
      <View style={[styles.riB, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 24,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  exclMark: { justifyContent: 'center', alignItems: 'center' },
  exclText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  title: { fontSize: 17, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  desc: { fontSize: 13, lineHeight: 19.5, textAlign: 'center', maxWidth: 280, marginBottom: 20 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
  },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  ri: { width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  riA: { width: 10, height: 6, borderWidth: 1.5, borderRadius: 1, position: 'absolute', top: 1, left: 1 },
  riB: { width: 6, height: 4, borderWidth: 1.5, borderRadius: 1, position: 'absolute', bottom: 1, right: 1 },
});
