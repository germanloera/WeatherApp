import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

export function StatusBar() {
  const { theme } = useTheme();
  const t = theme;
  return (
    <View style={[styles.root, { backgroundColor: t.colors.bg }]}>
      <Text style={[styles.time, { color: t.colors.fg, fontFamily: t.fonts.mono.fontFamily }]}>9:41</Text>
      <View style={styles.right}>
        <SignalIcon color={t.colors.fg} />
        <WiFiIcon color={t.colors.fg} />
        <BatteryIcon color={t.colors.fg} />
      </View>
    </View>
  );
}

function SignalIcon({ color }: { color: string }) {
  return (
    <View style={styles.signal}>
      {[7, 5, 3, 0].map((y, i) => (
        <View key={i} style={[styles.sigBar, { backgroundColor: color, height: [11, 9, 7, 4][i], bottom: y }]} />
      ))}
    </View>
  );
}

function WiFiIcon({ color }: { color: string }) {
  return (
    <View style={styles.wifi}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.wifiArc,
            {
              borderColor: color,
              width: 6 + i * 4,
              height: 6 + i * 4,
              borderRadius: (6 + i * 4) / 2,
              top: -i * 2,
              opacity: i === 0 ? 0.7 : 1,
            },
          ]}
        />
      ))}
    </View>
  );
}

function BatteryIcon({ color }: { color: string }) {
  return (
    <View style={styles.battery}>
      <View style={[styles.batBody, { borderColor: color }]}>
        <View style={[styles.batFill, { backgroundColor: color }]} />
      </View>
      <View style={[styles.batTip, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 26,
    paddingTop: 18,
    height: 47,
  },
  time: { fontSize: 15, fontWeight: '600', letterSpacing: -0.15 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  signal: { width: 17, height: 11, justifyContent: 'flex-end', flexDirection: 'row', gap: 1 },
  sigBar: { width: 3, borderRadius: 0.6, position: 'relative' },
  wifi: { width: 17, height: 13, justifyContent: 'center', alignItems: 'center' },
  wifiArc: { borderWidth: 1.2, position: 'absolute' },
  battery: { width: 25, height: 13, flexDirection: 'row', alignItems: 'center' },
  batBody: {
    width: 21, height: 11, borderRadius: 2.5,
    borderWidth: 1, justifyContent: 'flex-start', padding: 1.5,
  },
  batFill: { width: 16, height: 7, borderRadius: 1 },
  batTip: { width: 1.5, height: 5, borderRadius: 0.4, marginLeft: 1, opacity: 0.45 },
});
