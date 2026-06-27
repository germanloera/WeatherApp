import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface HeaderProps {
  greeting: string;
  title: string;
  isDark: boolean;
  onToggleDark: () => void;
  onSearch?: () => void;
}

export function Header({ greeting, title, isDark, onToggleDark, onSearch }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.left}>
        <Text style={[styles.greeting, { color: theme.colors.muted }]}>{greeting}</Text>
        <Text style={[styles.title, { color: theme.colors.fg }]}>{title}</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={onToggleDark}
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          <DarkIcon isDark={isDark} color={theme.colors.fg} />
        </TouchableOpacity>
        {onSearch && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={onSearch}
            accessibilityRole="button"
            accessibilityLabel="Buscar ubicación"
          >
            <SearchIcon color={theme.colors.fg} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function DarkIcon({ isDark, color }: { isDark: boolean; color: string }) {
  if (isDark) {
    return <Text style={{ color, fontSize: 18 }}>☀</Text>;
  }
  return (
    <View style={[styles.darkMoon, { borderColor: color, borderWidth: 0, backgroundColor: 'transparent' }]}>
      <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: color, opacity: 0.9 }} />
    </View>
  );
}

function SearchIcon({ color }: { color: string }) {
  return (
    <View style={styles.si}>
      <View style={[styles.siCircle, { borderColor: color }]} />
      <View style={[styles.siLine, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: 12,
  },
  left: { flex: 1 },
  greeting: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: 'SF Mono',
    marginBottom: 4,
  },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.52 },
  right: { flexDirection: 'row', gap: 6 },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkMoon: { width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  si: { width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  siCircle: {
    width: 11, height: 11, borderRadius: 5.5,
    borderWidth: 1.5, position: 'absolute', top: 1, left: 1,
  },
  siLine: {
    width: 6, height: 1.5, borderRadius: 1,
    transform: [{ rotate: '45deg' }],
    position: 'absolute', bottom: 3.5, right: 0.5,
  },
});
