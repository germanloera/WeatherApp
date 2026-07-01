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

interface DayGroup {
  label: string;
  hours: HourData[];
}

interface HourlyScreenProps {
  latency?: number;
  forceFail?: boolean;
  offline?: boolean;
  onNavigate?: (screen: string) => void;
}

const DAYS: DayGroup[] = [
  {
    label: 'Viernes 26 de junio',
    hours: [
      { time: '12 PM', condition: 'sunny', conditionText: 'Parcialmente nublado', subtitle: 'Humedad: 53% · Viento: SO 6 mph', temp: '92°', precip: '59%' },
      { time: '1 PM', condition: 'sunny', conditionText: 'Mayormente nublado', subtitle: 'Humedad: 47% · Viento: O 5 mph', temp: '89°', precip: '13%' },
      { time: '2 PM', condition: 'sunny', conditionText: 'Mayormente nublado', subtitle: 'Humedad: 45% · Viento: O 5 mph', temp: '90°', precip: '24%' },
      { time: '3 PM', condition: 'stormy', conditionText: 'Lluvias y tormentas aisladas', subtitle: 'Humedad: 45% · Viento: O 5 mph', temp: '90°', precip: '49%' },
      { time: '4 PM', condition: 'stormy', conditionText: 'Lluvias y tormentas dispersas', subtitle: 'Humedad: 44% · Viento: O 5 mph', temp: '91°', precip: '59%' },
      { time: '5 PM', condition: 'stormy', conditionText: 'Posibles lluvias y tormentas', subtitle: 'Humedad: 50% · Viento: O 5 mph', temp: '88°', precip: '58%' },
      { time: '6 PM', condition: 'stormy', conditionText: 'Posibles lluvias y tormentas', subtitle: 'Humedad: 53% · Viento: N 5 mph', temp: '87°', precip: '62%' },
      { time: '7 PM', condition: 'rainy', conditionText: 'Posibles lluvias y tormentas', subtitle: 'Humedad: 63% · Viento: N 3 mph', temp: '84°', precip: '59%' },
      { time: '8 PM', condition: 'rainy', conditionText: 'Lluvias y tormentas dispersas', subtitle: 'Humedad: 65% · Viento: SO 2 mph', temp: '82°', precip: '54%' },
      { time: '9 PM', condition: 'rainy', conditionText: 'Lluvias y tormentas dispersas', subtitle: 'Humedad: 74% · Viento: NO 1 mph', temp: '78°', precip: '51%' },
      { time: '10 PM', condition: 'stormy', conditionText: 'Lluvias y tormentas dispersas', subtitle: 'Humedad: 79% · Viento: NE 1 mph', temp: '77°', precip: '52%' },
      { time: '11 PM', condition: 'stormy', conditionText: 'Posibles lluvias y tormentas', subtitle: 'Humedad: 84% · Viento: S 1 mph', temp: '75°', precip: '58%' },
    ],
  },
  {
    label: 'Sábado 27 de junio',
    hours: [
      { time: '12 AM', condition: 'stormy', conditionText: 'Lluvias y tormentas', subtitle: 'Humedad: 87% · Viento: E 1 mph', temp: '74°', precip: '76%' },
      { time: '1 AM', condition: 'stormy', conditionText: 'Lluvias y tormentas', subtitle: 'Humedad: 90% · Viento: NO 1 mph', temp: '73°', precip: '79%' },
      { time: '2 AM', condition: 'stormy', conditionText: 'Lluvias y tormentas', subtitle: 'Humedad: 90% · Viento: NO 1 mph', temp: '73°', precip: '77%' },
      { time: '3 AM', condition: 'stormy', conditionText: 'Lluvias y tormentas', subtitle: 'Humedad: 93% · Viento: N 1 mph', temp: '71°', precip: '76%' },
      { time: '4 AM', condition: 'stormy', conditionText: 'Lluvias y tormentas', subtitle: 'Humedad: 93% · Viento: NE 1 mph', temp: '71°', precip: '79%' },
      { time: '5 AM', condition: 'stormy', conditionText: 'Lluvias y tormentas', subtitle: 'Humedad: 93% · Viento: NE 1 mph', temp: '71°', precip: '77%' },
      { time: '6 AM', condition: 'foggy', conditionText: 'Neblina y lluvias', subtitle: 'Humedad: 100% · Viento: NE 1 mph', temp: '69°', precip: '76%' },
      { time: '7 AM', condition: 'foggy', conditionText: 'Neblina y lluvias', subtitle: 'Humedad: 97% · Viento: NE 1 mph', temp: '71°', precip: '78%' },
      { time: '8 AM', condition: 'foggy', conditionText: 'Neblina y lluvias', subtitle: 'Humedad: 97% · Viento: NE 1 mph', temp: '72°', precip: '79%' },
      { time: '9 AM', condition: 'foggy', conditionText: 'Neblina y lluvias', subtitle: 'Humedad: 93% · Viento: NE 2 mph', temp: '74°', precip: '79%' },
      { time: '10 AM', condition: 'cloudy', conditionText: 'Lluvias y tormentas dispersas', subtitle: 'Humedad: 79% · Viento: S 5 mph', temp: '81°', precip: '61%' },
      { time: '11 AM', condition: 'sunny', conditionText: 'Parcialmente nublado', subtitle: 'Humedad: 85% · Viento: SE 3 mph', temp: '77°', precip: '51%' },
    ],
  },
];


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
