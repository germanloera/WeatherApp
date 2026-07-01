import { DataSourceCard } from '@/components/ui/home/DataSourceCard';
import { Header } from '@/components/ui/home/Header';
import { OfflineBanner } from '@/components/ui/home/OfflineBanner';
import { StateManager } from '@/components/ui/home/StateManager';
import type { WeatherCondition } from '@/components/ui/home/WeatherIcon';
import { DayDivider } from '@/components/ui/hourly/DayDivider';
import { HourRow } from '@/components/ui/hourly/HourRow';
import { useTheme } from '@/constants/ThemeProvider';
import { useHourlyForecast } from '@/src';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface HourData {
  time: string;
  condition: WeatherCondition;
  conditionText: string;
  subtitle: string;
  temp: string;
  precip?: string;
}

interface HourlyScreenProps {
  latency?: number;
  forceFail?: boolean;
  offline?: boolean;
  onNavigate?: (screen: string) => void;
}

export default function HourlyScreen({
  latency,
  forceFail,
  offline = false,
  onNavigate,
}: HourlyScreenProps) {
  const { theme, isDark, toggleDark } = useTheme();
  const [activeTab, setActiveTab] = useState('hours');
  const { data, isLoading, failed, error, refresh, isRefreshing } = useHourlyForecast()


  const handleTabPress = useCallback(
    (key: string) => {
      setActiveTab(key);
      onNavigate?.(key);
    },
    [onNavigate],
  );

  const handleSearch = useCallback(() => {
    onNavigate?.('search');
  }, [onNavigate]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.bg }]}>

      <OfflineBanner visible={offline} />
      <View style={styles.content}>
        <StateManager
          isLoading={isLoading}
          forceFail={failed}
          renderContent={() => (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scroll}
            >
              <Header
                greeting={data?.header.greeting ?? ""}
                title={data?.header.title ?? ''}
                isDark={isDark}
                onToggleDark={toggleDark}
                onSearch={handleSearch}
              />

              {data?.days.map((group, idx) => (
                <React.Fragment key={idx}>
                  <DayDivider label={group.label} />
                  <View style={styles.listPad}>
                    {group.hours.map((hour, hi) => (
                      <HourRow key={`${idx}-${hi}`} {...hour} />
                    ))}
                  </View>
                </React.Fragment>
              ))}

              <DataSourceCard
                station="weather.gov · HREF"
                updated="26 jun 2026 12:30 PM EDT"
                source="Modelo de alta resolución"
              />

              <View style={{ height: 20 }} />
            </ScrollView>
          )}
          errorTitle="Error de conexión"
          errorDescription="No pudimos obtener los datos del clima. Verifica tu conexión a internet e intenta de nuevo."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, overflow: 'hidden' },
  scroll: { paddingBottom: 28 },
  listPad: { paddingHorizontal: 20 },
});
