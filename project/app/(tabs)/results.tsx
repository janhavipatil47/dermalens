import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Calendar, ArrowRight, Save, Share2, RotateCcw } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getScanById } from '@/utils/database';
import { ScanResult } from '@/types/scan';

const { width: screenWidth } = Dimensions.get('window');

export default function ResultsScreen() {
  const { scanId } = useLocalSearchParams();
  const [result, setResult] = useState<ScanResult | null>(null);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (scanId && typeof scanId === 'string') {
      const scanResult = getScanById(scanId);
      setResult(scanResult);
    }
  }, [scanId]);

  if (!fontsLoaded || !result) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading results...</Text>
      </View>
    );
  }

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
      return <CheckCircle size={32} color="#00BFA6" />;
    }
    return <AlertTriangle size={32} color={getSeverityColor(severity)} />;
  };

  const getActionButtonText = (severity: string, detected: boolean) => {
    if (!detected) return 'Continue Monitoring';
    
    switch (severity) {
      case 'Low':
        return 'Set Reminder';
      case 'Medium':
        return 'Find Dermatologist';
      case 'High':
        return 'Book Urgent Appointment';
      default:
        return 'Learn More';
    }
  };

  const confidencePercentage = Math.round(result.confidence);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan Results</Text>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#666" />
          <Text style={styles.dateText}>
            {new Date(result.timestamp).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>

      {/* Latest Result Card */}
      <View style={styles.resultCard}>
        <Text style={styles.sectionTitle}>Latest Result</Text>
        
        {/* Scan Preview */}
        <View style={styles.scanPreview}>
          <View style={styles.scanImage}>
            {result.boundingBox && (
              <View
                style={[
                  styles.boundingBox,
                  {
                    left: result.boundingBox.x,
                    top: result.boundingBox.y,
                    width: result.boundingBox.width,
                    height: result.boundingBox.height,
                    borderColor: getSeverityColor(result.severity),
                  },
                ]}
              />
            )}
          </View>
          <View style={styles.severityBadge}>
            <Text style={[styles.severityText, { backgroundColor: getSeverityColor(result.severity) }]}>
              Severity: {result.severity}
            </Text>
          </View>
          <Text style={styles.boundingBoxLabel}>
            Bounding box indicates detected area
          </Text>
        </View>

        {/* Results Summary */}
        <View style={styles.resultsHeader}>
          <View style={styles.resultsIcon}>
            {getSeverityIcon(result.severity, result.anomalyDetected)}
          </View>
          <View style={styles.resultsContent}>
            <Text style={styles.resultsTitle}>
              {result.anomalyDetected ? 'Anomaly Detected' : 'No Anomaly Detected'}
            </Text>
            <Text style={styles.bodyAreaText}>{result.bodyArea}</Text>
            <Text style={[styles.confidenceLabel, { color: getSeverityColor(result.severity) }]}>
              {result.anomalyDetected ? `${result.severity} Confidence` : 'Clear Scan'}
            </Text>
          </View>
          <Text style={styles.confidencePercentage}>{confidencePercentage}%</Text>
        </View>

        <View style={styles.confidenceBar}>
          <View
            style={[
              styles.confidenceFill,
              {
                width: `${confidencePercentage}%`,
                backgroundColor: result.anomalyDetected 
                  ? getSeverityColor(result.severity) 
                  : '#00BFA6',
              },
            ]}
          />
        </View>

        {/* Recommendation */}
        <View style={styles.recommendationSection}>
          <Text style={styles.recommendationTitle}>Recommendation</Text>
          <Text style={styles.recommendationText}>
            {result.recommendation}
          </Text>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: getSeverityColor(result.severity) }]}>
            <Text style={styles.actionButtonText}>
              {getActionButtonText(result.severity, result.anomalyDetected)}
            </Text>
            <ArrowRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Save size={20} color="#00BFA6" />
          <Text style={styles.saveButtonText}>Save to History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color="#2E3A59" />
          <Text style={styles.shareButtonText}>Share Report</Text>
        </TouchableOpacity>
      </View>

      {/* New Scan Button */}
      <TouchableOpacity 
        style={styles.newScanButton}
        onPress={() => router.push('/')}
      >
        <RotateCcw size={20} color="#fff" />
        <Text style={styles.newScanButtonText}>New Scan</Text>
      </TouchableOpacity>

      {/* Medical Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerTitle}>Important Medical Notice</Text>
        <Text style={styles.disclaimerText}>
          This analysis is for informational purposes only and should not replace professional medical advice. 
          Always consult with healthcare professionals for proper diagnosis and treatment.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#2E3A59',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  resultCard: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
  scanPreview: {
    marginBottom: 20,
  },
  scanImage: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    position: 'relative',
    marginBottom: 12,
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 4,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  severityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  boundingBoxLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsIcon: {
    marginRight: 16,
  },
  resultsContent: {
    flex: 1,
  },
  resultsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  bodyAreaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  confidenceLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  confidencePercentage: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333',
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#e1e1e1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  recommendationSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 20,
  },
  recommendationTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  recommendationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#00BFA6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#00BFA6',
    marginLeft: 8,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 2,
    borderColor: '#2E3A59',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2E3A59',
    marginLeft: 8,
  },
  newScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#2E3A59',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newScanButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  disclaimerContainer: {
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disclaimerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  disclaimerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});