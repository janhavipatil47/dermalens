import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Calendar, ArrowRight } from 'lucide-react-native';
import { ScanResult } from '../types/scan';

interface ResultCardProps {
  result: ScanResult;
  onPress?: () => void;
}

export default function ResultCard({ result, onPress }: ResultCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return '#00BFA6';
      case 'Medium':
        return '#FF9500';
      case 'High':
        return '#FF6B6B';
      default:
        return '#666';
    }
  };

  const getSeverityIcon = (severity: string, detected: boolean) => {
    if (!detected) {
      return <CheckCircle size={24} color="#00BFA6" />;
    }
    return <AlertTriangle size={24} color={getSeverityColor(severity)} />;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getSeverityIcon(result.severity, result.anomalyDetected)}
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>
            {result.anomalyDetected ? 'Anomaly Detected' : 'Clear Scan'}
          </Text>
          <Text style={styles.bodyArea}>{result.bodyArea}</Text>
          <View style={styles.dateContainer}>
            <Calendar size={14} color="#666" />
            <Text style={styles.date}>{formatDate(result.timestamp)}</Text>
          </View>
        </View>
        <View style={styles.meta}>
          <Text style={[styles.severity, { color: getSeverityColor(result.severity) }]}>
            {result.anomalyDetected ? result.severity : 'Normal'}
          </Text>
          <Text style={styles.confidence}>{result.confidence}%</Text>
          {onPress && <ArrowRight size={16} color="#ccc" />}
        </View>
      </View>
      
      <View style={styles.confidenceBar}>
        <View
          style={[
            styles.confidenceFill,
            {
              width: `${result.confidence}%`,
              backgroundColor: result.anomalyDetected 
                ? getSeverityColor(result.severity) 
                : '#00BFA6',
            },
          ]}
        />
      </View>
      
      <Text style={styles.recommendation} numberOfLines={2}>
        {result.recommendation}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  bodyArea: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  meta: {
    alignItems: 'flex-end',
  },
  severity: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  confidence: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  confidenceBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },
  recommendation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});