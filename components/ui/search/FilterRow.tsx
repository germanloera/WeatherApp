import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { FilterChip } from './FilterChip';

interface FilterRowProps {
  filters: { key: string; label: string }[];
  activeFilter: string;
  onFilterPress: (key: string) => void;
}

export function FilterRow({ filters, activeFilter, onFilterPress }: FilterRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {filters.map((f) => (
        <FilterChip
          key={f.key}
          label={f.label}
          active={f.key === activeFilter}
          onPress={() => onFilterPress(f.key)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
});
