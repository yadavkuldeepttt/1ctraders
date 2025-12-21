import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const navigation = useNavigation();

  const stats = {
    balance: 5420.5,
    totalEarnings: 12450,
    activeInvestments: 3,
    referrals: 28,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back!</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>${stats.balance.toLocaleString()}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={24} color="#00d9ff" />
          <Text style={styles.statValue}>${stats.totalEarnings.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="wallet" size={24} color="#00d9ff" />
          <Text style={styles.statValue}>{stats.activeInvestments}</Text>
          <Text style={styles.statLabel}>Active Investments</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#00d9ff" />
          <Text style={styles.statValue}>{stats.referrals}</Text>
          <Text style={styles.statLabel}>Referrals</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Invest' as never)}
          >
            <Ionicons name="trending-up" size={32} color="#00d9ff" />
            <Text style={styles.actionText}>Invest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Wallet' as never)}
          >
            <Ionicons name="wallet" size={32} color="#00d9ff" />
            <Text style={styles.actionText}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Referrals' as never)}
          >
            <Ionicons name="people" size={32} color="#00d9ff" />
            <Text style={styles.actionText}>Referrals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Tasks' as never)}
          >
            <Ionicons name="checkmark-circle" size={32} color="#00d9ff" />
            <Text style={styles.actionText}>Tasks</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00d9ff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
  },
  balanceCard: {
    backgroundColor: '#1a1a1a',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00d9ff30',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#00d9ff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00d9ff20',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  quickActions: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#1a1a1a',
    width: '47%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00d9ff30',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },
});

