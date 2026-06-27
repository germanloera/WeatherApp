import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <View style={styles.device}>
      <View style={styles.buttons}>
        <View style={[styles.btnRail, { top: 174, left: -3, height: 32 }]} />
        <View style={[styles.btnRail, { top: 220, left: -3, height: 60 }]} />
        <View style={[styles.btnRail, { top: 290, left: -3, height: 60 }]} />
        <View style={[styles.btnRail, { top: 250, right: -3, height: 100 }]} />
      </View>
      <View style={styles.island} />
      <View style={styles.screen}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  device: {
    width: 390,
    height: 844,
    borderRadius: 56,
    padding: 12,
    backgroundColor: '#1a1a1c',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 0.45,
    shadowRadius: 60,
    elevation: 30,
  },
  buttons: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, pointerEvents: 'none' },
  btnRail: {
    position: 'absolute',
    width: 4,
    backgroundColor: '#0a0a0c',
    borderRadius: 2,
  },
  island: {
    position: 'absolute',
    top: 22,
    left: '50%',
    marginLeft: -62,
    width: 124,
    height: 36,
    backgroundColor: '#000',
    borderRadius: 18,
    zIndex: 5,
  },
  screen: {
    flex: 1,
    borderRadius: 44,
    overflow: 'hidden',
    backgroundColor: '#EDF1F9',
  },
});
