import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Camera, RotateCcw, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import CameraGuidance from '@/components/CameraGuidance';
import ScanFrame from '@/components/ScanFrame';
import { processImageForAnomalies } from '@/utils/anomalyDetection';
import { saveScanResult } from '@/utils/database';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CameraScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [guidanceMessage, setGuidanceMessage] = useState('Position skin area in viewfinder');
  const [guidanceType, setGuidanceType] = useState<'good' | 'warning' | 'info'>('info');
  const [bodyArea, setBodyArea] = useState('Unknown area');
  const cameraRef = useRef<CameraView>(null);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    // Simulate real-time guidance updates
    const guidanceMessages = [
      { message: 'Good lighting detected', type: 'good' as const },
      { message: 'Hold device steady', type: 'info' as const },
      { message: 'Move closer to skin area', type: 'warning' as const },
      { message: 'Perfect distance - ready to scan', type: 'good' as const },
      { message: 'Ensure 10-15cm distance', type: 'info' as const },
    ];

    const interval = setInterval(() => {
      if (!isCapturing) {
        const randomGuidance = guidanceMessages[Math.floor(Math.random() * guidanceMessages.length)];
        setGuidanceMessage(randomGuidance.message);
        setGuidanceType(randomGuidance.type);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isCapturing]);

  if (!fontsLoaded) {
    return null;
  }

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionIcon}>
          <Camera size={60} color="#00BFA6" />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionMessage}>
          DermaLens needs camera access to scan and analyze skin anomalies for early detection.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
        
        <View style={styles.hipaaNotice}>
          <Text style={styles.hipaaText}>
            🔒 HIPAA-safe tips: Keep faces out of scans
          </Text>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const captureAndAnalyze = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      setGuidanceMessage('Capturing image...');
      setGuidanceType('info');

      // Simulate image capture
      await new Promise(resolve => setTimeout(resolve, 500));

      setGuidanceMessage('Processing with AI...');
      
      // Simulate body area detection
      const bodyAreas = ['Left arm', 'Right arm', 'Left leg', 'Right leg', 'Back', 'Chest', 'Face', 'Neck'];
      const detectedArea = bodyAreas[Math.floor(Math.random() * bodyAreas.length)];
      setBodyArea(detectedArea);

      // Process image for anomalies
      const result = await processImageForAnomalies('mock-image-uri', detectedArea);
      
      // Save to database
      saveScanResult(result);

      // Navigate to results
      router.push({
        pathname: '/results',
        params: { scanId: result.id }
      });

    } catch (error) {
      Alert.alert('Scan Error', 'Failed to process image. Please try again.');
      setGuidanceMessage('Scan failed - try again');
      setGuidanceType('warning');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>DermaLens</Text>
          <Text style={styles.headerSubtitle}>Skin Anomaly Detection</Text>
        </View>
        
        <View style={styles.medicalNotice}>
          <Text style={styles.medicalNoticeText}>
            Medical guidance only. Not a diagnosis.
          </Text>
        </View>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.overlay}>
            <ScanFrame />
          </View>
        </CameraView>
      </View>

      {/* Guidance */}
      <View style={styles.guidanceContainer}>
        <CameraGuidance message={guidanceMessage} type={guidanceType} />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={toggleCameraFacing}
          disabled={isCapturing}
        >
          <RotateCcw size={24} color={isCapturing ? "#ccc" : "#2E3A59"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
          onPress={captureAndAnalyze}
          disabled={isCapturing}
        >
          <View style={styles.captureButtonInner}>
            {isCapturing ? (
              <View style={styles.processingIndicator} />
            ) : (
              <Camera size={32} color="#fff" />
            )}
          </View>
          <Text style={styles.captureButtonText}>
            {isCapturing ? 'Processing...' : 'Capture Scan'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          disabled={isCapturing}
        >
          <Zap size={24} color={isCapturing ? "#ccc" : "#2E3A59"} />
        </TouchableOpacity>
      </View>

      {/* Footer Tips */}
      <View style={styles.footer}>
        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>
            💡 Ensure good lighting and hold device steady for accurate results
          </Text>
        </View>
        
        <View style={styles.hipaaFooter}>
          <Text style={styles.hipaaFooterText}>
            🔒 HIPAA-safe tips: Keep faces out of scans
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  permissionIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#00BFA6',
  },
  permissionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#2E3A59',
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#00BFA6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  hipaaNotice: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#2E3A59',
    borderRadius: 12,
  },
  hipaaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#2E3A59',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  },
  medicalNotice: {
    backgroundColor: '#2E3A59',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  medicalNoticeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#fff',
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidanceContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  captureButton: {
    alignItems: 'center',
    marginHorizontal: 40,
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  captureButtonInner: {
    width: 80,
    height: 80,
    backgroundColor: '#00BFA6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 8,
  },
  processingIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#fff',
    borderTopColor: 'transparent',
  },
  captureButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#2E3A59',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  tipContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  hipaaFooter: {
    backgroundColor: '#2E3A59',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  hipaaFooterText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});