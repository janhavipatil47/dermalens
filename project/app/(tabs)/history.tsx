import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, ListFilter as Filter, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { getAllScans, getScansCount } from '@/utils/database';
import { ScanResult } from '@/types/scan';
import ResultCard from '@/components/ResultCard';

const { width: screenWidth } = Dimensions.get('window');

export default function HistoryScreen() {
  const [historyData, setHistoryData] = useState<ScanResult[]>([]);
  const [filter, setFilter] = useState<'all' | 'detected' | 'clear'>('all');
  const [stats, setStats] = useState({ total: 0, detected: 0, clear: 0 });

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = () => {
    const scans = getAllScans();
    const scanStats = getScansCount();
    setHistoryData(scans);
    setStats(scanStats);
  };

  if (!fontsLoaded) {
    return null;
  }

  const getFilteredData = () => {
    switch (filter) {
      case 'detected':
        return historyData.filter(item => item.anomalyDetected);
      case 'clear':
        return historyData.filter(item => !item.anomalyDetected);
      default:
        return historyData;
    }
  };

  const handleScanPress = (scan: ScanResult) => {
    router.push({
      pathname: '/results',
      params: { scanId: scan.id }
    });
  };

  const renderHistoryItem = ({ item }: { item: ScanResult }) => (
    <ResultCard 
      result={item} 
      onPress={() => handleScanPress(item)}
    />
  );

  const filteredData = getFilteredData();

  if (historyData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>
          <Text style={styles.headerSubtitle}>Track your skin monitoring progress</Text>
        </View>
        
        <View style={styles.emptyState}>
          <TrendingUp size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Scans Yet</Text>
          <Text style={styles.emptyStateMessage}>
            Start by taking your first skin scan to begin tracking your skin health journey.
          </Text>
          <TouchableOpacity 
            style={styles.startScanButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.startScanButtonText}>Take First Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>History</Text>
            <Text style={styles.headerSubtitle}>Track your skin monitoring progress</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.totalCard]}>
          <TrendingUp size={24} color="#2E3A59" />
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>
        <View style={[styles.statCard, styles.detectedCard]}>
          <AlertTriangle size={24} color="#FF6B6B" />
          <Text style={styles.statNumber}>{stats.detected}</Text>
          <Text style={styles.statLabel}>Anomalies</Text>
        </View>
        <View style={[styles.statCard, styles.clearCard]}>
          <CheckCircle size={24} color="#00BFA6" />
          <Text style={styles.statNumber}>{stats.clear}</Text>
          <Text style={styles.statLabel}>Clear Scans</Text>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <Filter size={20} color="#666" />
          <Text style={styles.filterTitle}>Filters</Text>
        </View>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
              All ({stats.total})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'detected' && styles.filterButtonActive]}
            onPress={() => setFilter('detected')}
          >
            <Text style={[styles.filterButtonText, filter === 'detected' && styles.filterButtonTextActive]}>
              Detected ({stats.detected})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'clear' && styles.filterButtonActive]}
            onPress={() => setFilter('clear')}
          >
            <Text style={[styles.filterButtonText, filter === 'clear' && styles.filterButtonTextActive]}>
              Clear ({stats.clear})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* History List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyStateMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  startScanButton: {
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
  startScanButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalCard: {
    borderTopColor: '#2E3A59',
    borderTopWidth: 3,
  },
  detectedCard: {
    borderTopColor: '#FF6B6B',
    borderTopWidth: 3,
  },
  clearCard: {
    borderTopColor: '#00BFA6',
    borderTopWidth: 3,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  filterSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: '#00BFA6',
    borderColor: '#00BFA6',
  },
  filterButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});