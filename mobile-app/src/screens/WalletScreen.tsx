import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WalletScreen() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');

  const wallet = {
    balance: 5420.5,
    totalDeposits: 10500,
    totalWithdrawals: 5079.5,
  };

  const transactions = [
    { id: 1, type: 'deposit', amount: 500, status: 'completed', date: '2025-01-15' },
    { id: 2, type: 'withdrawal', amount: 200, status: 'completed', date: '2025-01-14' },
    { id: 3, type: 'roi', amount: 145, status: 'completed', date: '2025-01-14' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
        <Text style={styles.headerSubtitle}>Manage your deposits and withdrawals</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>${wallet.balance.toLocaleString()}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.depositButton}
            onPress={() => setShowDepositModal(true)}
          >
            <Ionicons name="arrow-down" size={20} color="#000" />
            <Text style={styles.depositButtonText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => setShowWithdrawModal(true)}
          >
            <Ionicons name="arrow-up" size={20} color="#00d9ff" />
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${wallet.totalDeposits.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Deposits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${wallet.totalWithdrawals.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Withdrawals</Text>
        </View>
      </View>

      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <Ionicons
              name={
                transaction.type === 'deposit'
                  ? 'arrow-down'
                  : transaction.type === 'withdrawal'
                  ? 'arrow-up'
                  : 'wallet'
              }
              size={24}
              color={
                transaction.type === 'deposit' || transaction.type === 'roi'
                  ? '#00ff00'
                  : '#ff0000'
              }
            />
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>{transaction.type}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                transaction.type === 'withdrawal' && styles.transactionAmountNegative,
              ]}
            >
              {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount}
            </Text>
          </View>
        ))}
      </View>

      <Modal visible={showDepositModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deposit Funds</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#666"
              value={depositAmount}
              onChangeText={setDepositAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Crypto wallet address (BTC, ETH, USDT)"
              placeholderTextColor="#666"
              value={cryptoAddress}
              onChangeText={setCryptoAddress}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDepositModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showWithdrawModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw Funds</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#666"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Crypto wallet address"
              placeholderTextColor="#666"
              value={cryptoAddress}
              onChangeText={setCryptoAddress}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowWithdrawModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  depositButton: {
    flex: 1,
    backgroundColor: '#00d9ff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  depositButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00d9ff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  withdrawButtonText: {
    color: '#00d9ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00d9ff20',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  transactionsContainer: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  transactionCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00d9ff20',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff00',
  },
  transactionAmountNegative: {
    color: '#ff0000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    borderWidth: 1,
    borderColor: '#00d9ff30',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d9ff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#00d9ff30',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#00d9ff30',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#00d9ff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

