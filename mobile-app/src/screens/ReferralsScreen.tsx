import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReferralsScreen() {
  const [copied, setCopied] = useState(false);
  const referralCode = '1CT-JD2025';
  const referralLink = `https://1ctraders.app/register?ref=${referralCode}`;

  const copyToClipboard = () => {
    Clipboard.setString(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied!', 'Referral link copied to clipboard');
  };

  const stats = {
    totalReferrals: 28,
    activeReferrals: 24,
    totalEarnings: 2450.5,
    thisMonth: 380.25,
  };

  const levels = [
    { level: 1, percentage: 8, referrals: 8, earnings: 850 },
    { level: 2, percentage: 1, referrals: 12, earnings: 620 },
    { level: 3, percentage: 1, referrals: 5, earnings: 340 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Referral Program</Text>
        <Text style={styles.headerSubtitle}>Earn from 12 levels of referrals</Text>
      </View>

      <View style={styles.referralCard}>
        <Text style={styles.referralTitle}>Your Referral Link</Text>
        <View style={styles.referralLinkContainer}>
          <Text style={styles.referralLink} numberOfLines={1}>
            {referralLink}
          </Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Ionicons
              name={copied ? 'checkmark' : 'copy'}
              size={20}
              color={copied ? '#00ff00' : '#00d9ff'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#00d9ff" />
          <Text style={styles.statValue}>{stats.totalReferrals}</Text>
          <Text style={styles.statLabel}>Total Referrals</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#00d9ff" />
          <Text style={styles.statValue}>{stats.activeReferrals}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={24} color="#00d9ff" />
          <Text style={styles.statValue}>${stats.totalEarnings}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
      </View>

      <View style={styles.levelsContainer}>
        <Text style={styles.sectionTitle}>Commission Structure</Text>
        {levels.map((level) => (
          <View key={level.level} style={styles.levelCard}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelNumber}>L{level.level}</Text>
              <View>
                <Text style={styles.levelText}>Level {level.level}</Text>
                <Text style={styles.levelPercentage}>{level.percentage}% commission</Text>
              </View>
            </View>
            <View style={styles.levelStats}>
              <Text style={styles.levelReferrals}>{level.referrals} referrals</Text>
              <Text style={styles.levelEarnings}>${level.earnings} earned</Text>
            </View>
          </View>
        ))}
        <Text style={styles.levelNote}>Total commission capped at 20%</Text>
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
  referralCard: {
    backgroundColor: '#1a1a1a',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00d9ff30',
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  referralLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  referralLink: {
    flex: 1,
    color: '#00d9ff',
    fontSize: 14,
  },
  copyButton: {
    padding: 8,
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
  levelsContainer: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  levelCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00d9ff20',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00d9ff',
    width: 40,
    textAlign: 'center',
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelPercentage: {
    fontSize: 12,
    color: '#999',
  },
  levelStats: {
    alignItems: 'flex-end',
  },
  levelReferrals: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelEarnings: {
    fontSize: 12,
    color: '#00d9ff',
  },
  levelNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

