import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Home() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dummy chart data
  const chartData = {
    labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep'],
    datasets: [
      {
        data: [10000, 10500, 11200, 11800, 12450],
        color: (opacity = 1) => `rgba(0, 128, 62, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Recent activity dummy data
  const recentActivity = [
    { id: '1', name: 'Sarah Johnson', type: 'Contribution', amount: '+$200' },
    { id: '2', name: 'Michael Smith', type: 'Contribution', amount: '+$150' },
    { id: '3', name: 'Anna Lee', type: 'Contribution', amount: '+$175' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GroupSave</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={28} color="#777" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Dashboard</Text>

        {/* Balance Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.cardLabel}>Total Savings</Text>
                <Text style={styles.cardValue}>$12,450</Text>
                <Text style={styles.cardTrend}>↑ 8.2% from last month</Text>
              </View>
              <View style={[styles.iconCircle, styles.upTrendCircle]}>
                <Ionicons name="trending-up" size={24} color="#00803e" />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.cardLabel}>Next Contribution Due</Text>
                <Text style={styles.cardValue}>$200</Text>
                <Text style={[styles.cardTrend, { color: '#ff9500' }]}>Due in 5 days</Text>
              </View>
              <View style={[styles.iconCircle, styles.timerCircle]}>
                <Ionicons name="timer-outline" size={24} color="#ff9500" />
              </View>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={[styles.section, styles.chartSection]}>
          <Text style={styles.sectionTitle}>Contribution History</Text>

          <LineChart
            data={chartData}
            width={width - 40}
            height={180}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 128, 62, ${opacity})`,
              labelColor: () => '#999999',
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#00803e',
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: '#f0f0f0',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Goal Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Annual Trip Goal</Text>

          <View style={styles.goalContainer}>
            <View style={styles.progressContainer}>
              <View style={styles.progressCircleContainer}>
                <View style={styles.progressBackground} />
                <View style={[styles.progressFill, { width: '69%' }]} />
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressPercentage}>69%</Text>
                  <Text style={styles.progressDetails}>$12,450 of $18,000</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { marginBottom: 90 }]}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityInitials}>
                <Text style={styles.initialsText}>
                  {activity.name.split(' ').map(name => name[0]).join('')}
                </Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <Text style={styles.activityType}>{activity.type}</Text>
              </View>
              <Text style={styles.activityAmount}>{activity.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

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
    backgroundColor: '#f8f9fc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00803e',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    marginRight: 15,
    padding: 5,
  },
  profileButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  cardsContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  cardTrend: {
    fontSize: 12,
    color: '#00803e',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upTrendCircle: {
    backgroundColor: '#e6f3ed',
  },
  timerCircle: {
    backgroundColor: '#fff5e6',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartSection: {
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  goalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressCircleContainer: {
    width: '100%',
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#00803e',
    borderRadius: 15,
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  progressPercentage: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressDetails: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityInitials: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    color: '#00803e',
    fontSize: 14,
    fontWeight: '600',
  },
  activityDetails: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  activityType: {
    fontSize: 12,
    color: '#777777',
  },
  activityAmount: {
    fontSize: 14,
    color: '#00803e',
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});