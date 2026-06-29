import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

interface WindCardProps {
  speed: number;
  unit: string;
  direction: string;
  degrees: number;
  gusts: number;
}

export function WindCard({ speed, unit, direction, degrees, gusts }: WindCardProps) {
  const { theme } = useTheme();
  const arrowRotation = degrees;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.fg }]}>Viento</Text>
        <Text style={[styles.meta, { color: theme.colors.muted }]}>
          Ráfaga máx: {gusts} mph
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.compass}>
          <Compass color={theme.colors.muted} accent={theme.colors.accent} rotation={arrowRotation} />
        </View>
        <View>
          <Text style={[styles.speed, { color: theme.colors.fg }]}>
            <Text style={styles.speedNum}>{speed}</Text>
            <Text style={[styles.speedUnit, { color: theme.colors.muted }]}> {unit}</Text>
          </Text>
          <Text style={[styles.detail, { color: theme.colors.muted }]}>
            Dirección: {direction} ({degrees}°)
          </Text>
          <Text style={[styles.detail, { color: theme.colors.muted }]}>
            Ráfagas: {gusts} {unit}
          </Text>
        </View>
      </View>
    </View>
  );
}

function Compass({ color, accent, rotation }: { color: string; accent: string; rotation: number }) {
  const s = 64;
  const cx = s / 2;
  const cy = s / 2;
  const r = 28;

  const dirs = [
    { label: 'N', x: cx, y: cy - r - 2 },
    { label: 'E', x: cx + r + 2, y: cy },
    { label: 'S', x: cx, y: cy + r + 2 },
    { label: 'O', x: cx - r - 2, y: cy },
  ];

  const rad = ((rotation - 90) * Math.PI) / 180;
  const arrowX = cx + r * 0.5 * Math.cos(rad);
  const arrowY = cy + r * 0.5 * Math.sin(rad);
  const tipX = cx + r * 0.85 * Math.cos(rad);
  const tipY = cy + r * 0.85 * Math.sin(rad);

  return (
    <View style={{ width: s, height: s, position: 'relative' }}>
      {/* Outer circle */}
      <View
        style={{
          position: 'absolute',
          left: cx - r,
          top: cy - r,
          width: r * 2,
          height: r * 2,
          borderRadius: r,
          borderWidth: 1.5,
          borderColor: color,
        }}
      />
      {/* Cross lines */}
      <View
        style={{
          position: 'absolute',
          left: cx,
          top: cy - r,
          width: 1.5,
          height: r * 2,
          backgroundColor: color,
          opacity: 0.3,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: cx - r,
          top: cy,
          width: r * 2,
          height: 1.5,
          backgroundColor: color,
          opacity: 0.3,
        }}
      />
      {/* Direction labels */}
      {dirs.map((d) => (
        <Text
          key={d.label}
          style={{
            position: 'absolute',
            left: d.x - 4,
            top: d.y - 5,
            fontSize: 7,
            color,
            fontFamily: 'SF Mono',
            fontWeight: '500',
          }}
        >
          {d.label}
        </Text>
      ))}
      {/* Arrow */}
      <View
        style={{
          position: 'absolute',
          left: arrowX - 2,
          top: arrowY - 2,
          width: 4,
          height: Math.sqrt((tipX - arrowX) ** 2 + (tipY - arrowY) ** 2),
          backgroundColor: accent,
          borderRadius: 2,
          transform: [{ rotate: `${rotation - 90}deg` }],
          transformOrigin: 'left center',
        }}
      />
      {/* Center dot */}
      <View
        style={{
          position: 'absolute',
          left: cx - 3,
          top: cy - 3,
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: accent,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
    fontFamily: 'SF Mono',
  },
  body: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  compass: {
    width: 64,
    height: 64,
  },
  speed: {
    fontSize: 24,
    fontWeight: '700',
  },
  speedNum: {
    fontFamily: 'SF Mono',
    fontVariant: ['tabular-nums'],
  },
  speedUnit: {
    fontSize: 14,
    fontWeight: '400',
  },
  detail: {
    fontSize: 13,
    marginTop: 2,
  },
});
