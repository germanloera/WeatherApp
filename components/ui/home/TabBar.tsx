import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface Tab {
  key: string;
  label: string;
  icon: 'weather' | 'hours' | 'detail' | 'search' | 'about';
}

interface TabBarProps {
  activeTab: string;
  onTabPress: (key: string) => void;
}

const TABS: Tab[] = [
  { key: 'weather', label: 'Clima', icon: 'weather' },
  { key: 'hours', label: 'Horas', icon: 'hours' },
  { key: 'detail', label: 'Detalle', icon: 'detail' },
  { key: 'search', label: 'Buscar', icon: 'search' },
  { key: 'about', label: 'Acerca', icon: 'about' },
];

export function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.root,
        {
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.surface + 'E8',
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <View
              style={[
                styles.iconWrap,
                isActive && { color: theme.colors.accent } as any,
              ]}
            >
              <TabIcon name={tab.icon} color={isActive ? theme.colors.accent : theme.colors.tabInactive} active={isActive} />
            </View>
            <Text
              style={[
                styles.label,
                { color: isActive ? theme.colors.accent : theme.colors.tabInactive },
                isActive && { fontWeight: '600' },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TabIcon({ name, color, active }: { name: Tab['icon']; color: string; active: boolean }) {
  const s: any = { position: 'relative', width: 22, height: 22 } as const;

  switch (name) {
    case 'weather':
      return (
        <View style={s}>
          <View style={{ position: 'absolute', left: 3, top: 4, width: 16, height: 11, borderRadius: 5.5, borderWidth: 1.5, borderColor: color }} />
          <View style={{ position: 'absolute', left: 12, top: 1, width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
        </View>
      );
    case 'hours':
      return (
        <View style={s}>
          <View style={{ position: 'absolute', left: 1, top: 1, width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: color }} />
          <View style={{ position: 'absolute', left: 10, top: 6, width: 1.5, height: 7, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ position: 'absolute', left: 10, top: 6, width: 5, height: 1.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '90deg' }] }} />
        </View>
      );
    case 'detail':
      return (
        <View style={s}>
          <View style={{ position: 'absolute', left: 1, top: 1, width: 21, height: 21, borderRadius: 10.5, borderWidth: 1.5, borderColor: color }} />
          <View style={{ position: 'absolute', left: 10, top: 6, width: 2, height: 8, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ position: 'absolute', left: 10, top: 16, width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
        </View>
      );
    case 'search':
      return (
        <View style={s}>
          <View style={{ position: 'absolute', left: 2, top: 2, width: 12, height: 12, borderRadius: 6, borderWidth: 1.5, borderColor: color }} />
          <View style={{ position: 'absolute', left: 13, top: 13, width: 7, height: 1.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '45deg' }] }} />
        </View>
      );
    case 'about':
      return (
        <View style={s}>
          <View style={{ position: 'absolute', left: 1, top: 1, width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: color }} />
          <View style={{ position: 'absolute', left: 10, top: 11, width: 2, height: 5, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ position: 'absolute', left: 10, top: 7, width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 0,
    backdropFilter: 'blur(20px)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
  },
  iconWrap: { width: 22, height: 22, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 10, letterSpacing: 0.2 },
});
