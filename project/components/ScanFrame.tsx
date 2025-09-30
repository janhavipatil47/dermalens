import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const frameSize = Math.min(screenWidth * 0.7, 280);

export default function ScanFrame() {
  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        {/* Corner indicators */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
        
        {/* Center crosshair */}
        <View style={styles.crosshair}>
          <View style={styles.crosshairHorizontal} />
          <View style={styles.crosshairVertical} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: frameSize,
    height: frameSize,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00BFA6',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  crosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  crosshairHorizontal: {
    width: 20,
    height: 2,
    backgroundColor: '#00BFA6',
    opacity: 0.7,
  },
  crosshairVertical: {
    width: 2,
    height: 20,
    backgroundColor: '#00BFA6',
    opacity: 0.7,
    position: 'absolute',
    left: 9,
    top: -9,
  },
});