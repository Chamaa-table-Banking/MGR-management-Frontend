import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import your screen components
import DashboardScreen from './tabs/DashboardScreen';
// import TransactionsScreen from './screens/TransactionsScreen';
// import GroupsScreen from './screens/GroupsScreen';
// import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './tabs/settings';

const MainScreen = () => {
  const [activeTab, setActiveTab] = useState('');
  const insets = useSafeAreaInsets();

  // Function to render the active screen based on activeTab
  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'transactions':
        return <TransactionsScreen />;
      case 'groups':
        return <GroupsScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content Area */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom || 10 }]}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('dashboard')}
        >
          <View style={[styles.navIcon, activeTab === 'dashboard' ? styles.activeNavIcon : null]}>
            <Ionicons
              name={activeTab === 'dashboard' ? 'home' : 'home-outline'}
              size={22}
              color={activeTab === 'dashboard' ? '#00803e' : '#888888'}
            />
          </View>
          <Text style={[styles.navText, activeTab === 'dashboard' ? styles.activeNavText : null]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('transactions')}
        >
          <View style={[styles.navIcon, activeTab === 'transactions' ? styles.activeNavIcon : null]}>
            <Ionicons
              name={activeTab === 'transactions' ? 'swap-vertical' : 'swap-vertical-outline'}
              size={22}
              color={activeTab === 'transactions' ? '#00803e' : '#888888'}
            />
          </View>
          <Text style={[styles.navText, activeTab === 'transactions' ? styles.activeNavText : null]}>
            Transactions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('groups')}
        >
          <View style={[styles.navIcon, activeTab === 'groups' ? styles.activeNavIcon : null]}>
            <Ionicons
              name={activeTab === 'groups' ? 'people' : 'people-outline'}
              size={22}
              color={activeTab === 'groups' ? '#00803e' : '#888888'}
            />
          </View>
          <Text style={[styles.navText, activeTab === 'groups' ? styles.activeNavText : null]}>
            Groups
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('reports')}
        >
          <View style={[styles.navIcon, activeTab === 'reports' ? styles.activeNavIcon : null]}>
            <Ionicons
              name={activeTab === 'reports' ? 'bar-chart' : 'bar-chart-outline'}
              size={22}
              color={activeTab === 'reports' ? '#00803e' : '#888888'}
            />
          </View>
          <Text style={[styles.navText, activeTab === 'reports' ? styles.activeNavText : null]}>
            Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('settings')}
        >
          <View style={[styles.navIcon, activeTab === 'settings' ? styles.activeNavIcon : null]}>
            <Ionicons
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
              size={22}
              color={activeTab === 'settings' ? '#00803e' : '#888888'}
            />
          </View>
          <Text style={[styles.navText, activeTab === 'settings' ? styles.activeNavText : null]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 2,
  },
  activeNavIcon: {
    backgroundColor: 'rgba(0, 128, 62, 0.1)',
  },
  navText: {
    fontSize: 12,
    color: '#888888',
  },
  activeNavText: {
    color: '#00803e',
    fontWeight: 'bold',
  },
});

export default MainScreen;