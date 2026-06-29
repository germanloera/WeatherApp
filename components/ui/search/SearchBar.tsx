import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Ciudad, estado o código postal...' }: SearchBarProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.box, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <SearchIcon color={theme.colors.muted} />
      <TextInput
        style={[styles.input, { color: theme.colors.fg }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        accessibilityLabel="Buscar ciudad"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}

function SearchIcon({ color }: { color: string }) {
  return (
    <View style={styles.icon}>
      <View style={[styles.circle, { borderColor: color }]} />
      <View style={[styles.handle, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: 'SF Pro Text',
    outlineStyle: 'none',
  },
  icon: { width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  circle: {
    width: 11, height: 11, borderRadius: 5.5,
    borderWidth: 1.5, position: 'absolute', top: 1, left: 1,
  },
  handle: {
    width: 6, height: 1.5, borderRadius: 1,
    transform: [{ rotate: '45deg' }],
    position: 'absolute', bottom: 3.5, right: 0.5,
  },
});
