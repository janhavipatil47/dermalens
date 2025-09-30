import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { User, Settings as SettingsIcon, Bell, Shield, Circle as HelpCircle, FileText, ChevronRight, Moon, Camera, Download, Trash2, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [highQualityEnabled, setHighQualityEnabled] = useState(false);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your scan history and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would clear the SQLite database
            Alert.alert('Success', 'All data has been cleared.');
          }
        },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <User size={20} color="#2E3A59" />,
          title: 'Personal Information',
          subtitle: 'Update your profile details',
          hasSwitch: false,
          onPress: () => Alert.alert('Coming Soon', 'Profile management will be available in a future update.'),
        },
        {
          icon: <Shield size={20} color="#2E3A59" />,
          title: 'Privacy & Security',
          subtitle: 'Manage your data privacy',
          hasSwitch: false,
          onPress: () => Alert.alert('Privacy', 'All scan data is stored locally on your device and never shared without your consent.'),
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          icon: <Bell size={20} color="#2E3A59" />,
          title: 'Notifications',
          subtitle: 'Scan reminders and updates',
          hasSwitch: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: <Moon size={20} color="#2E3A59" />,
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          hasSwitch: true,
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled,
        },
        {
          icon: <Camera size={20} color="#2E3A59" />,
          title: 'Auto-Save Scans',
          subtitle: 'Automatically save scan results',
          hasSwitch: true,
          value: autoSaveEnabled,
          onToggle: setAutoSaveEnabled,
        },
        {
          icon: <Camera size={20} color="#2E3A59" />,
          title: 'High Quality Processing',
          subtitle: 'Enhanced AI analysis (slower)',
          hasSwitch: true,
          value: highQualityEnabled,
          onToggle: setHighQualityEnabled,
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          icon: <Download size={20} color="#2E3A59" />,
          title: 'Export Data',
          subtitle: 'Download your scan history',
          hasSwitch: false,
          onPress: () => Alert.alert('Export', 'Data export functionality will be available soon.'),
        },
        {
          icon: <FileText size={20} color="#2E3A59" />,
          title: 'Medical Reports',
          subtitle: 'Generate reports for healthcare providers',
          hasSwitch: false,
          onPress: () => Alert.alert('Reports', 'Medical report generation will be available in a future update.'),
        },
        {
          icon: <Trash2 size={20} color="#FF6B6B" />,
          title: 'Clear All Data',
          subtitle: 'Permanently delete all scan history',
          hasSwitch: false,
          onPress: handleClearData,
          isDestructive: true,
        },
      ],
    },
    {
      title: 'Support & Information',
      items: [
        {
          icon: <HelpCircle size={20} color="#2E3A59" />,
          title: 'Help & FAQ',
          subtitle: 'Get answers to common questions',
          hasSwitch: false,
          onPress: () => Alert.alert('Help', 'For support, please contact our team at support@dermalens.app'),
        },
        {
          icon: <Info size={20} color="#2E3A59" />,
          title: 'About DermaLens',
          subtitle: 'Version 1.0.0 (Build 1)',
          hasSwitch: false,
          onPress: () => Alert.alert('About', 'DermaLens v1.0.0\nAdvanced skin anomaly detection powered by AI technology.'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity 
      key={index} 
      style={[styles.settingItem, item.isDestructive && styles.destructiveItem]}
      onPress={item.onPress}
    >
      <View style={[styles.settingIcon, item.isDestructive && styles.destructiveIcon]}>
        {item.icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, item.isDestructive && styles.destructiveText]}>
          {item.title}
        </Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      {item.hasSwitch ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          thumbColor={item.value ? '#00BFA6' : '#f4f3f4'}
          trackColor={{ false: '#e1e1e1', true: '#00BFA6' }}
        />
      ) : (
        <ChevronRight size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your DermaLens experience</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={32} color="#00BFA6" />
          </View>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>DermaLens User</Text>
          <Text style={styles.profileEmail}>Track your skin health journey</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Setup</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Sections */}
      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
          </View>
        </View>
      ))}

      {/* App Information */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoTitle}>DermaLens</Text>
        <Text style={styles.appInfoDescription}>
          Advanced skin anomaly detection powered by AI technology. 
          Your trusted companion for proactive skin health monitoring.
        </Text>
        <Text style={styles.appInfoTech}>
          • Lightweight MobileNet AI model for offline processing
        </Text>
        <Text style={styles.appInfoTech}>
          • OpenCV preprocessing for enhanced accuracy
        </Text>
        <Text style={styles.appInfoTech}>
          • HIPAA-compliant local data storage
        </Text>
        <Text style={styles.appInfoVersion}>Version 1.0.0 (Build 1)</Text>
      </View>

      {/* Medical Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerTitle}>Important Medical Notice</Text>
        <Text style={styles.disclaimerText}>
          DermaLens is designed to assist in skin monitoring and should not be used as a substitute for 
          professional medical diagnosis. Always consult healthcare professionals for medical concerns.
          This app provides guidance only and is not a medical device.
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
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
  profileCard: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00BFA6',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00BFA6',
    borderRadius: 8,
  },
  editButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  sectionContent: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  destructiveItem: {
    backgroundColor: '#fff5f5',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  destructiveIcon: {
    backgroundColor: '#fee2e2',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  destructiveText: {
    color: '#FF6B6B',
  },
  settingSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  appInfo: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appInfoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#00BFA6',
    marginBottom: 8,
  },
  appInfoDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  appInfoTech: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999',
    marginTop: 12,
  },
  disclaimerContainer: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
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