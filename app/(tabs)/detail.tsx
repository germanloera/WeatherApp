import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { OfflineBanner } from '@/components/ui/home/OfflineBanner';
import { StateManager } from '@/components/ui/home/StateManager';
import { Header } from '@/components/ui/home/Header';
import { DataSourceCard } from '@/components/ui/home/DataSourceCard';
import { DetailCard } from '@/components/ui/details/DetailCard';
import { SparklineChart } from '@/components/ui/details/SparklineChart';
import { WindCard } from '@/components/ui/details/WindCard';
import { SunTimesCard } from '@/components/ui/details/SunTimesCard';
import { PressureCard } from '@/components/ui/details/PressureCard';
import { useDetailWeather } from '@/src';

interface DetailExtendedScreenProps {
  latency?: number;
  forceFail?: boolean;
  offline?: boolean;
  onNavigate?: (screen: string) => void;
}

const TEMP_TREND = [40, 55, 70, 82, 95, 100, 98, 92, 85, 70, 55, 42];
const PRESSURE_DATA = [60, 55, 65, 60, 70, 75, 78, 82, 80, 85, 88, 90];

export default function DetailExtendedScreen({
  latency,
  forceFail,
  offline = false,
  onNavigate,
}: DetailExtendedScreenProps) {
  const { theme, isDark, toggleDark } = useTheme();
  const [activeTab, setActiveTab] = useState('detail');
  const { data, isLoading, failed, error, refresh, isRefreshing } = useDetailWeather()

  const handleTabPress = useCallback(
    (key: string) => {
      setActiveTab(key);
      onNavigate?.(key);
    },
    [onNavigate],
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.bg }]}>
  
      <OfflineBanner visible={offline} />
      <View style={styles.content}>
        <StateManager
          isLoading={ isLoading }
          forceFail={failed}
          renderContent={() => (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scroll}
            >
              <Header
                greeting="Washington, DC"
                title="Detalle extendido"
                isDark={isDark}
                onToggleDark={toggleDark}
              />

              <View style={styles.section}>
                <View style={styles.metricGrid}>
                  <View style={styles.metricCol}>
                    <DetailCard
                      label="Presión barométrica"
                      value={<><Text style={styles.numValue}>1013.2</Text> <Text style={[styles.unitValue, { color: theme.colors.muted }]}>hPa</Text></>}
                      sub="Estable ↑"
                    />
                  </View>
                  <View style={styles.metricCol}>
                    <DetailCard
                      label="Índice UV"
                      value={<><Text style={styles.numValue}>8</Text><Text style={[styles.unitValue, { color: theme.colors.muted }]}> /11</Text></>}
                      sub="Muy alto"
                      subColor={theme.colors.error}
                    >
                      <View style={[styles.qualBar, { backgroundColor: theme.colors.border }]}>
                        <View style={[styles.qualFill, { width: '73%', backgroundColor: theme.colors.error }]} />
                      </View>
                    </DetailCard>
                  </View>
                  <View style={styles.metricCol}>
                    <DetailCard
                      label="Visibilidad"
                      value={<><Text style={styles.numValue}>10</Text> <Text style={[styles.unitValue, { color: theme.colors.muted }]}>mi</Text></>}
                      sub="Sin restricciones"
                    />
                  </View>
                  <View style={styles.metricCol}>
                    <DetailCard
                      label="Punto de rocío"
                      value={<><Text style={styles.numValue}>66</Text><Text style={[styles.unitValue, { color: theme.colors.muted }]}>°F</Text></>}
                      sub="Humedad: 45%"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <View style={[styles.trendCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <View style={styles.trendHeader}>
                    <Text style={[styles.trendTitle, { color: theme.colors.fg }]}>Tendencia de temperatura</Text>
                    <Text style={[styles.trendMeta, { color: theme.colors.muted }]}>Próximas 24 h</Text>
                  </View>
                  <SparklineChart
                    data={TEMP_TREND}
                    height={60}
                    barGap={3}
                    barWidth={6}
                    leftLabel="75°F"
                    centerLabel="92°F"
                    rightLabel="68°F"
                  />
                </View>
              </View>

              <View style={styles.section}>
                <WindCard
                  speed={6}
                  unit="mph"
                  direction="Oeste"
                  degrees={270}
                  gusts={14}
                />
              </View>

              <View style={styles.section}>
                <SunTimesCard
                  sunrise="5:43 AM"
                  sunset="8:39 PM"
                  dayDuration="14h 56m"
                  nextSunrise="5:44 AM"
                />
              </View>

              <View style={styles.section}>
                <PressureCard
                  current={1013.2}
                  unit="hPa"
                  trend="rising"
                  data={PRESSURE_DATA}
                  interpretation="La presión está subiendo lentamente, lo que indica mejora en las condiciones."
                />
              </View>

              <DataSourceCard
                station="Washington/Reagan National Airport (KDCA)"
                updated="26 jun 2026"
                source="weather.gov"
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
  section: { paddingHorizontal: 20, marginTop: 8 },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCol: {
    width: '48%',
  },
  numValue: {
    fontFamily: 'SF Mono',
    fontVariant: ['tabular-nums'],
    fontSize: 22,
    fontWeight: '700',
  },
  unitValue: {
    fontSize: 13,
    fontWeight: '400',
  },
  qualBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  qualFill: {
    height: '100%',
    borderRadius: 3,
  },
  trendCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  trendMeta: {
    fontSize: 12,
    fontFamily: 'SF Mono',
  },
});
