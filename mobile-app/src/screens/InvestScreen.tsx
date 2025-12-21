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

export default function InvestScreen() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);

  const plans = [
    {
      id: 1,
      name: 'Oil Investment',
      icon: 'cash',
      roiMin: 1.5,
      roiMax: 2.5,
      minInvest: 100,
      maxInvest: 5000,
    },
    {
      id: 2,
      name: 'Shares Trading',
      icon: 'bar-chart',
      roiMin: 1.5,
      roiMax: 2.5,
      minInvest: 100,
      maxInvest: 10000,
    },
    {
      id: 3,
      name: 'Crypto Trading',
      icon: 'logo-bitcoin',
      roiMin: 1.5,
      roiMax: 2.5,
      minInvest: 100,
      maxInvest: 25000,
    },
    {
      id: 4,
      name: 'AI Trading Bot',
      icon: 'hardware-chip',
      roiMin: 1.5,
      roiMax: 2.5,
      minInvest: 100,
      maxInvest: 50000,
    },
  ];

  const handleInvest = () => {
    // TODO: Implement investment logic
    setShowModal(false);
    alert(`Investment of $${amount} initiated!`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Investment Plans</Text>
        <Text style={styles.headerSubtitle}>Choose your investment strategy</Text>
      </View>

      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
            ]}
            onPress={() => {
              setSelectedPlan(plan.id);
              setShowModal(true);
            }}
          >
            <Ionicons name={plan.icon as any} size={32} color="#00d9ff" />
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planRoi}>
              {plan.roiMin}% - {plan.roiMax}% Daily
            </Text>
            <Text style={styles.planMin}>Min: ${plan.minInvest}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete Investment</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#666"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.investButton} onPress={handleInvest}>
                <Text style={styles.investButtonText}>Invest Now</Text>
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
  plansContainer: {
    padding: 20,
    gap: 16,
  },
  planCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00d9ff30',
  },
  planCardSelected: {
    borderColor: '#00d9ff',
    borderWidth: 2,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  planRoi: {
    fontSize: 16,
    color: '#00d9ff',
    marginTop: 8,
  },
  planMin: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
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
    marginBottom: 20,
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
  investButton: {
    flex: 1,
    backgroundColor: '#00d9ff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  investButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

