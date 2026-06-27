import React from 'react';
import { View, StyleSheet } from 'react-native';

export type WeatherCondition = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy' | 'windy' | 'night';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  color?: string;
}

export function WeatherIcon({ condition, size = 24, color = '#3B82F1' }: WeatherIconProps) {
  const s = size / 24;
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      {renderIcon(condition, color, s)}
    </View>
  );
}

function renderIcon(condition: WeatherCondition, color: string, s: number) {
  const stroke = { stroke: color, fill: 'none', strokeWidth: 1.5 * s };
  const fill = { fill: color, stroke: 'none' };

  switch (condition) {
    case 'sunny':
      return (
        <View style={{ width: 24 * s, height: 24 * s, position: 'relative' }}>
          <View style={[styles.dot, { width: 9 * s, height: 9 * s, borderRadius: (9 * s) / 2, backgroundColor: color, top: 7.5 * s, left: 7.5 * s }]} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 12 * s + 5.5 * s * Math.cos(rad);
            const y1 = 12 * s + 5.5 * s * Math.sin(rad);
            const x2 = 12 * s + 9 * s * Math.cos(rad);
            const y2 = 12 * s + 9 * s * Math.sin(rad);
            return <View key={i} style={[styles.ray, { backgroundColor: color, left: x1, top: y1, width: 3.5 * s * (i % 2 === 0 ? 1 : 0.7), height: 1.5 * s, transform: [{ rotate: `${deg}deg` }], transformOrigin: 'left center' }]} />;
          })}
        </View>
      );
    case 'rainy':
      return (
        <View style={{ width: 24 * s, height: 24 * s, position: 'relative' }}>
          <View style={[styles.cloud, { borderColor: color, width: 18 * s, height: 11 * s, borderRadius: (5.5 * s), top: 4 * s, left: 3 * s }]} />
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.rainDrop, { backgroundColor: color, width: 2 * s, height: 5 * s, borderRadius: s, top: (17 + i * 2) * s, left: (6 + i * 6) * s }]} />
          ))}
        </View>
      );
    case 'stormy':
      return (
        <View style={{ width: 24 * s, height: 24 * s, position: 'relative' }}>
          <View style={[styles.cloud, { borderColor: color, width: 18 * s, height: 11 * s, borderRadius: (5.5 * s), top: 4 * s, left: 3 * s }]} />
          <View style={[styles.lightning, { borderLeftWidth: 3 * s, borderRightWidth: 3 * s, borderTopWidth: 6 * s, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color, top: 15 * s, left: 9 * s }]} />
          <View style={[styles.lightning, { borderLeftWidth: 2 * s, borderRightWidth: 2 * s, borderTopWidth: 4 * s, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color, top: 18 * s, left: 13 * s, opacity: 0.7 }]} />
        </View>
      );
    case 'night':
      return (
        <View style={{ width: 24 * s, height: 24 * s, position: 'relative' }}>
          <View style={[styles.moon, { borderColor: color, width: 14 * s, height: 14 * s, borderRadius: (7 * s), top: 3 * s, left: 7 * s }]} />
          <View style={[styles.moonCut, { backgroundColor: '#fff', width: 10 * s, height: 10 * s, borderRadius: (5 * s), top: 5 * s, left: 5 * s }]} />
        </View>
      );
    case 'partly-cloudy':
      return (
        <View style={{ width: 24 * s, height: 24 * s, position: 'relative' }}>
          <View style={[styles.dot, { width: 7 * s, height: 7 * s, borderRadius: (3.5 * s), backgroundColor: color, top: 1 * s, left: 7 * s }]} />
          <View style={[styles.cloud, { borderColor: color, width: 16 * s, height: 10 * s, borderRadius: (5 * s), top: 6 * s, left: 3 * s }]} />
        </View>
      );
    case 'snowy':
      return (
        <View style={{ width: 24 * s, height: 24 * s, position: 'relative' }}>
          <View style={[styles.cloud, { borderColor: color, width: 18 * s, height: 11 * s, borderRadius: (5.5 * s), top: 4 * s, left: 3 * s }]} />
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.snowFlake, { borderColor: color, width: 3 * s, height: 3 * s, borderRadius: (1.5 * s), top: (17 + i * 2) * s, left: (6 + i * 6) * s }]} />
          ))}
        </View>
      );
    default:
      return (
        <View style={[styles.cloud, { borderColor: color, width: 18 * s, height: 11 * s, borderRadius: (5.5 * s), top: 4 * s, left: 3 * s }]} />
      );
  }
}

const styles = StyleSheet.create({
  dot: { position: 'absolute' },
  ray: { position: 'absolute', borderRadius: 1 },
  cloud: { position: 'absolute', borderWidth: 1.5 },
  rainDrop: { position: 'absolute', borderRadius: 1 },
  lightning: { position: 'absolute', width: 0, height: 0, borderStyle: 'solid' },
  moon: { position: 'absolute', borderWidth: 2 },
  moonCut: { position: 'absolute' },
  snowFlake: { position: 'absolute', borderWidth: 1.5 },
});
