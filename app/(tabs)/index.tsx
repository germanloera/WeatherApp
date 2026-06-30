import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { OfflineBanner } from '@/components/ui/home/OfflineBanner';
import { StateManager } from '@/components/ui/home/StateManager';
import { Header } from '@/components/ui/home/Header';
import { HeroWeatherCard } from '@/components/ui/home/HeroWeatherCard';
import { MetricCard } from '@/components/ui/home/MetricCard';
import { HourlyStrip } from '@/components/ui/home/HourlyStrip';
import { DataSourceCard } from '@/components/ui/home/DataSourceCard';
import { useCurrentWeather } from '@/src';


interface CurrentWeatherScreenProps {
    /** Simulated latency for loading state (dev) */
    latency?: number;
    /** Force error state (dev) */
    forceFail?: boolean;
    /** Simulated offline state */
    offline?: boolean;
    onNavigate?: (screen: string) => void;
}

const HOURLY_DATA = [
    { time: 'Ahora', condition: 'sunny' as const, temp: '92°', precip: '59%' },
    { time: '13:00', condition: 'sunny' as const, temp: '89°', precip: '13%' },
    { time: '14:00', condition: 'sunny' as const, temp: '90°', precip: '24%' },
    { time: '15:00', condition: 'rainy' as const, temp: '90°', precip: '49%' },
    { time: '16:00', condition: 'rainy' as const, temp: '91°', precip: '59%' },
    { time: '17:00', condition: 'rainy' as const, temp: '88°', precip: '58%' },
    { time: '18:00', condition: 'rainy' as const, temp: '87°', precip: '62%' },
    { time: '19:00', condition: 'partly-cloudy' as const, temp: '84°', precip: '59%' },
    { time: '20:00', condition: 'partly-cloudy' as const, temp: '82°', precip: '54%' },
    { time: '21:00', condition: 'cloudy' as const, temp: '78°', precip: '51%' },
];

export default function CurrentWeatherScreen({
    latency,
    forceFail,
    offline = false,
    onNavigate,
}: CurrentWeatherScreenProps) {
    const { theme, isDark, toggleDark } = useTheme();
    const [activeTab, setActiveTab] = useState('weather');

    const { data, isLoading, failed,  error, refresh, isRefreshing } = useCurrentWeather(42.324268, -83.399017, "si")




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

    const handleHourlySeeAll = useCallback(() => {
        onNavigate?.('hours');
    }, [onNavigate]);

    const handleDetailSeeAll = useCallback(() => {
        onNavigate?.('detail');
    }, [onNavigate]);

    return (
        <View style={[styles.screen, { backgroundColor: theme.colors.bg }]}>
            {/* <StatusBar /> */}
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
                                greeting={ data?.header.greeting ?? ""}
                                title={ data?.header.title ?? "" }
                                isDark={isDark}
                                onToggleDark={toggleDark}
                                onSearch={handleSearch}
                            />

                            <View style={styles.section}>
                                <HeroWeatherCard
                                    temperature={data?.hero.temperature ?? -1}
                                    unit={data?.hero.unit ?? ""}
                                    condition={data?.hero.condition ?? ""}
                                    conditionIcon="sunny"
                                    feelsLike={data?.hero.feelsLike ?? -1}
                                    precipitation={data?.hero.precipitation ?? -1}
                                    windSpeed={data?.hero.windSpeed ?? ""}
                                    windDir={data?.hero.windDir ?? ""}
                                    humidity={data?.hero.humidity ?? -1}
                                    lastObs={ data?.hero.lastObs ?? '' }
                                />
                            </View>

                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={{ flex: 1 }}>
                                        <HeaderTitle title="Más detalles" />
                                    </View>
                                    <HeaderLink label="Ver todo →" onPress={handleDetailSeeAll} />
                                </View>
                                <View style={styles.metricGrid}>
                                    <View style={styles.metricCol}>
                                        <MetricCard
                                            values={ data?.metrics[0] }
                                        />
                                        <View style={{ height: 10 }} />
                                        <MetricCard
                                            values={data?.metrics[1]}
                                        
                                        />
                                    </View>
                                    <View style={styles.metricCol}>
                                        <MetricCard
                                            values={data?.metrics[2]}
                                    
                                        />
                                        <View style={{ height: 10 }} />
                                        <MetricCard
                                            values={data?.metrics[3]}
                                          
                                        />
                                    </View>
                                </View>
                            </View>

                            <HourlyStrip data={HOURLY_DATA} onSeeAll={handleHourlySeeAll} />

                            <DataSourceCard
                                station="Washington/Reagan National Airport (KDCA)"
                                updated="26 jun 2026 12:30 PM EDT"
                                source="weather.gov"
                            />

                            <View style={{ height: 20 }} />
                        </ScrollView>
                    )}
                    errorTitle="Error de conexión"
                    errorDescription="No pudimos obtener los datos del clima. Verifica tu conexión a internet e intenta de nuevo."
                />
            </View>
            {/*<TabBar activeTab={activeTab} onTabPress={handleTabPress} />*/}
                {/*< HomeIndicator />*/}
        </View>
    );
}

function HeaderTitle({ title }: { title: string }) {
    const { theme } = useTheme();
    return (
        <Text style={{ color: theme.colors.fg, fontSize: 16, fontWeight: '600' }}>
            {title}
        </Text>
    );
}

function HeaderLink({ label, onPress }: { label: string; onPress?: () => void }) {
    const { theme } = useTheme();
    return (
        <TouchableOpacity onPress={onPress} accessibilityRole="button">
            <Text style={{ color: theme.colors.accent, fontSize: 13, fontWeight: '500' }}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    content: { flex: 1, overflow: 'hidden' },
    scroll: { paddingBottom: 28 },
    section: { marginTop: 8, paddingHorizontal: 20 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    metricGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    metricCol: {
        flex: 1,
    },
});
