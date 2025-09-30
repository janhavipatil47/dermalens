import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Lightbulb } from 'lucide-react-native';

interface CameraGuidanceProps {
  message: string;
  type: 'good' | 'warning' | 'info';
}

export default function CameraGuidance({ message, type }: CameraGuidanceProps) {
  const getIcon = () => {
    switch (type) {
      case 'good':
        return <CheckCircle size={20} color="#00BFA6" />;
      case 'warning':
        return <AlertCircle size={20} color="#FF6B6B" />;
      case 'info':
        return <Lightbulb size={20} color="#FF9500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'good':
        return 'rgba(0, 191, 166, 0.9)';
      case 'warning':
        return 'rgba(255, 107, 107, 0.9)';
      case 'info':
        return 'rgba(255, 149, 0, 0.9)';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      {getIcon()}
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
});