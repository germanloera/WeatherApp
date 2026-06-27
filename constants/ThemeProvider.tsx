import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { lightTheme, darkTheme, AppTheme } from './theme';

// ─── Context ─────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme: AppTheme;
  toggleDark: () => void;
  setDark: (v: boolean) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  toggleDark: () => {},
  setDark: () => {},
  isDark: false,
});

export const useTheme = (): ThemeContextValue => useContext(ThemeContext);

// ─── Props ───────────────────────────────────────────────────────────────

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Override system preference (e.g. from settings) */
  overrideDark?: boolean | null;
}

// ─── Provider ────────────────────────────────────────────────────────────

export function ThemeProvider({ children, overrideDark }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [manualDark, setManualDark] = useState<boolean | null>(null);

  const isDark =
    manualDark !== null
      ? manualDark
      : overrideDark ?? systemScheme === 'dark';

  const theme = isDark ? darkTheme : lightTheme;

  const toggleDark = () => setManualDark((prev) => !(prev ?? systemScheme === 'dark'));
  const setDark = (v: boolean) => setManualDark(v);

  // Sync StatusBar
  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    StatusBar.setBackgroundColor(isDark ? darkTheme.colors.bg : lightTheme.colors.bg);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, toggleDark, setDark, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── useThemedStyles — memoized StyleSheet factory ───────────────────────

import { StyleSheet } from 'react-native';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: AppTheme) => T,
): T {
  const { theme } = useTheme();
  const [styles, setStyles] = useState(() => factory(theme));

  useEffect(() => {
    setStyles(factory(theme));
  }, [theme, factory]);

  return styles;
}
