// Claro Weather — React Native Expo Theme
// Light + Dark color system, typography, spacing, radii, shadows

import { useColorScheme } from 'react-native';

// ─── Color tokens ───────────────────────────────────────────────────────────

export const palette = {
  light: {
    // Core
    bg:           '#EDF1F9', // oklch(96% 0.01 240)
    surface:      '#FFFFFF', // oklch(100% 0 0)
    fg:           '#1B1D29', // oklch(18% 0.012 250)
    muted:        '#7B7F96', // oklch(52% 0.015 240)
    border:       '#E0E3EA', // oklch(90% 0.008 240)
    accent:       '#3B82F1', // oklch(58% 0.18 255)
    accentSoft:   '#EDF2FE', // color-mix(in oklch, var(--accent) 14%, transparent)
    fgSoft:       '#F0F1F4', // color-mix(in oklch, var(--fg) 6%, transparent)

    // Semantic
    success:      '#34C759', // iOS green
    warning:      '#FF9F0A', // iOS orange
    error:        '#FF453A', // iOS red
    info:         '#3B82F1', // matches accent

    // Weather card gradient (hero)
    weatherFrom:  '#3B82F1', // oklch(58% 0.18 255)
    weatherTo:    '#3654D8', // oklch(52% 0.16 265)

    // State colors
    offlineBg:    '#F05E23', // oklch(55% 0.15 30)
    offlineBgDark:'#C44D1C', // oklch(40% 0.12 30)
    errorBg:      '#FFF0EE', // oklch(95% 0.015 20)
    errorBorder:  '#FFC8C0', // oklch(82% 0.04 20)
    errorIcon:    '#F05E23', // oklch(55% 0.18 30)

    // Air quality bar
    aqLow:        '#22C55E',
    aqModerate:   '#EAB308',
    aqHigh:       '#F97316',
    aqVeryHigh:   '#EF4444',

    // Overlay
    accentCardText: '#FFFFFF',
    accentCardMeta: 'rgba(255,255,255,0.72)',

    // Tab bar
    tabInactive:  '#7B7F96',
    tabActive:    '#3B82F1',

    // Shimmer
    shimmerBase:  '#E0E3EA',
    shimmerMove:  '#F0F1F4',
  },

  dark: {
    // Core
    bg:           '#181B28', // oklch(18% 0.015 250)
    surface:      '#1F2232', // oklch(23% 0.012 250)
    fg:           '#E8EAF0', // oklch(92% 0.005 250)
    muted:        '#9498AE', // oklch(62% 0.01 240)
    border:       '#2C3040', // oklch(30% 0.01 250)
    accent:       '#5A9EFF', // oklch(64% 0.19 255)
    accentSoft:   '#1F2D52', // color-mix(in oklch, var(--accent) 18%, transparent)
    fgSoft:       '#1A1D2E', // color-mix(in oklch, var(--fg) 10%, transparent)

    // Semantic
    success:      '#30D158', // iOS green dark
    warning:      '#FFD60A', // iOS yellow dark
    error:        '#FF453A', // iOS red
    info:         '#5A9EFF', // matches dark accent

    // Weather card gradient (hero)
    weatherFrom:  '#3B82F1',
    weatherTo:    '#3654D8',

    // State colors
    offlineBg:    '#C44D1C', // oklch(40% 0.12 30)
    offlineBgDark:'#C44D1C',
    errorBg:      '#2E1B1B', // oklch(22% 0.015 20)
    errorBorder:  '#47282A', // oklch(32% 0.04 20)
    errorIcon:    '#F05E23',

    // Air quality bar
    aqLow:        '#22C55E',
    aqModerate:   '#EAB308',
    aqHigh:       '#F97316',
    aqVeryHigh:   '#EF4444',

    // Overlay
    accentCardText: '#FFFFFF',
    accentCardMeta: 'rgba(255,255,255,0.72)',

    // Tab bar
    tabInactive:  '#9498AE',
    tabActive:    '#5A9EFF',

    // Shimmer
    shimmerBase:  '#2C3040',
    shimmerMove:  '#3A3E50',
  },
} as const;

// ─── Weather condition colors ───────────────────────────────────────────────

export const weatherColors = {
  sunny:          '#F59E0B',
  partlyCloudy:   '#94A3B8',
  cloudy:         '#64748B',
  rainy:          '#3B82F1',
  stormy:         '#6366F1',
  snowy:          '#E2E8F0',
  foggy:          '#94A3B8',
  windy:          '#A1A1AA',
  night:          '#1E293B',
} as const;

// ─── Air quality levels ─────────────────────────────────────────────────────

export const airQualityLevels = [
  { label: 'Buena',  color: palette.light.aqLow,       range: [0, 50] },
  { label: 'Moderada', color: palette.light.aqModerate, range: [51, 100] },
  { label: 'Dañina', color: palette.light.aqHigh,       range: [101, 150] },
  { label: 'Muy dañina', color: palette.light.aqVeryHigh, range: [151, 300] },
] as const;

// ─── UV Index levels ────────────────────────────────────────────────────────

export const uvLevels = [
  { label: 'Bajo',     color: '#22C55E', range: [0, 2] },
  { label: 'Moderado', color: '#EAB308', range: [3, 5] },
  { label: 'Alto',     color: '#F97316', range: [6, 7] },
  { label: 'Muy alto', color: '#EF4444', range: [8, 10] },
  { label: 'Extremo',  color: '#7C3AED', range: [11, 11] },
] as const;

// ─── Typography ─────────────────────────────────────────────────────────────

export const fonts = {
  display: { fontFamily: 'SF Pro Display', fontWeight: '700' as const },
  body:    { fontFamily: 'SF Pro Text', fontWeight: '400' as const },
  mono:    { fontFamily: 'SF Mono', fontWeight: '400' as const },
} as const;

export const fontSizes = {
  h1:     26,
  h2:     20,
  h3:     16,
  body:   15,
  meta:   12,
  caption: 10,
} as const;

export const lineHeights = {
  tight:   1.1,
  normal:  1.4,
  relaxed: 1.6,
} as const;

// ─── Spacing ────────────────────────────────────────────────────────────────

export const spacing = {
  xxs: 2,
  xs:  4,
  sm:  6,
  md:  8,
  lg:  10,
  xl:  12,
  '2xl': 14,
  '3xl': 16,
  '4xl': 18,
  '5xl': 20,
  '6xl': 24,
  '7xl': 28,
  '8xl': 32,
  '9xl': 40,
} as const;

// ─── Border radii ───────────────────────────────────────────────────────────

export const radii = {
  xs:    4,
  sm:    6,
  md:    8,
  lg:    10,
  xl:    12,
  '2xl': 14,
  '3xl': 18,
  '4xl': 20,
  pill:  999,
  device: 56,
  island: 999,
} as const;

// ─── Shadows (iOS) ──────────────────────────────────────────────────────────

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

// ─── Animation durations ────────────────────────────────────────────────────

export const durations = {
  fast:   150,
  normal: 250,
  slow:   400,
  xslow:  800,
  shimmer: 1600,
} as const;

// ─── Theme type ─────────────────────────────────────────────────────────────

export interface AppTheme {
  dark: boolean;
  colors: typeof palette.light;
  fonts: typeof fonts;
  fontSizes: typeof fontSizes;
  lineHeights: typeof lineHeights;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
  durations: typeof durations;
  weatherColors: typeof weatherColors;
  airQualityLevels: typeof airQualityLevels;
  uvLevels: typeof uvLevels;
}

// ─── Light theme object ─────────────────────────────────────────────────────

export const lightTheme: AppTheme = {
  dark: false,
  colors: palette.light,
  fonts,
  fontSizes,
  lineHeights,
  spacing,
  radii,
  shadows,
  durations,
  weatherColors,
  airQualityLevels,
  uvLevels,
};

// ─── Dark theme object ──────────────────────────────────────────────────────

export const darkTheme: AppTheme = {
  dark: true,
  colors:  palette.dark,
  fonts,
  fontSizes,
  lineHeights,
  spacing,
  radii,
  shadows,
  durations,
  weatherColors,
  airQualityLevels,
  uvLevels,
};

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAppTheme(): AppTheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}

// ─── Typography presets (StyleSheet.create-ready) ──────────────────────────

import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: 'SF Pro Display',
    fontWeight: '700',
    fontSize: 26,
    letterSpacing: -0.52,
    lineHeight: 28.6,
  },
  h2: {
    fontFamily: 'SF Pro Display',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  h3: {
    fontFamily: 'SF Pro Text',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20.8,
  },
  body: {
    fontFamily: 'SF Pro Text',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 21,
  },
  meta: {
    fontFamily: 'SF Mono',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
  },
  caption: {
    fontFamily: 'SF Mono',
    fontWeight: '400',
    fontSize: 10,
    letterSpacing: 0.6,
    lineHeight: 14,
  },
  num: {
    fontFamily: 'SF Mono',
    fontWeight: '600',
    fontSize: 18,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  },
};

// ─── Tab bar icon sizing ────────────────────────────────────────────────────

export const tabIconSize = 22;
export const iconSize = { sm: 16, md: 20, lg: 24, xl: 32 };
