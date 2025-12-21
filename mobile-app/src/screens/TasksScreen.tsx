import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TasksScreen() {
  const tasks = [
    {
      id: 1,
      title: 'Follow us on Twitter',
      reward: 10,
      icon: 'logo-twitter',
      status: 'available',
    },
    {
      id: 2,
      title: 'Subscribe to YouTube',
      reward: 15,
      icon: 'logo-youtube',
      status: 'completed',
    },
    {
      id: 3,
      title: 'Share on Social Media',
      reward: 20,
      icon: 'share-social',
      status: 'available',
    },
    {
      id: 4,
      title: 'Join Telegram Community',
      reward: 10,
      icon: 'chatbubbles',
      status: 'pending',
    },
    {
      id: 5,
      title: 'Daily Check-in',
      reward: 5,
      icon: 'checkmark-circle',
      status: 'completed',
    },
  ];

  const stats = {
    totalEarned: 145,
    availableTasks: tasks.filter((t) => t.status === 'available').length,
    completedTasks: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks & Rewards</Text>
        <Text style={styles.headerSubtitle}>Complete tasks to earn bonus rewards</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="gift" size={24} color="#00d9ff" />
          <Text style={styles.statValue}>${stats.totalEarned}</Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#00d9ff" />
          <Text style={styles.statValue}>{stats.availableTasks}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#00d9ff" />
          <Text style={styles.statValue}>{stats.completedTasks}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.tasksContainer}>
        <Text style={styles.sectionTitle}>Available Tasks</Text>
        {tasks.map((task) => (
          <View
            key={task.id}
            style={[
              styles.taskCard,
              task.status === 'completed' && styles.taskCardCompleted,
            ]}
          >
            <Ionicons
              name={task.icon as any}
              size={32}
              color={task.status === 'completed' ? '#00ff00' : '#00d9ff'}
            />
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskReward}>+${task.reward}</Text>
            </View>
            {task.status === 'available' && (
              <TouchableOpacity style={styles.taskButton}>
                <Text style={styles.taskButtonText}>Complete</Text>
              </TouchableOpacity>
            )}
            {task.status === 'completed' && (
              <Ionicons name="checkmark-circle" size={24} color="#00ff00" />
            )}
            {task.status === 'pending' && (
              <Ionicons name="time" size={24} color="#ffaa00" />
            )}
          </View>
        ))}
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
  tasksContainer: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00d9ff30',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  taskReward: {
    fontSize: 14,
    color: '#00d9ff',
    marginTop: 4,
  },
  taskButton: {
    backgroundColor: '#00d9ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  taskButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

