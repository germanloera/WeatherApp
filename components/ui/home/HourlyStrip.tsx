import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { HourlyItem } from './HourlyItem';
import type { WeatherCondition } from './WeatherIcon';

interface HourData {
  time: string;
  condition: WeatherCondition;
  temp: string;
  precip?: string;
}

interface HourlyStripProps {
  data?: HourData[];
  onSeeAll?: () => void;
}

export function HourlyStrip({ data, onSeeAll }: HourlyStripProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.fg }]}>Pronóstico por hora</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} accessibilityRole="button" accessibilityLabel="Ver todo">
            <Text style={[styles.link, { color: theme.colors.accent }]}>Ver todo →</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
      >
        {data && data.map((item, i) => (
          <HourlyItem key={i} {...item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 18 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  title: { fontSize: 16, fontWeight: '600' },
  link: { fontSize: 13, fontWeight: '500' },
  scroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
});
