import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Circle, Calendar } from 'lucide-react-native';
import { useEvents } from '@/context/EventContext';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function TodoScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { events, toggleEventCompletion } = useEvents();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const tasks = events
    .filter(e => e.type === 'deadline' || e.type === 'exam')
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const upcomingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const renderTask = (task: typeof events[0]) => (
    <TouchableOpacity 
      key={task.id} 
      style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
      activeOpacity={0.7}
      onPress={() => toggleEventCompletion(task.id)}
    >
      <View style={styles.checkboxContainer}>
        {task.completed ? (
          <CheckCircle2 size={24} color={Colors.success} />
        ) : (
          <Circle size={24} color={Colors.textTertiary} />
        )}
      </View>
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
          {task.title}
        </Text>
        <View style={styles.taskMeta}>
          <Calendar size={12} color={task.completed ? Colors.textTertiary : Colors.textSecondary} />
          <Text style={[styles.taskDate, task.completed && styles.taskDateCompleted]}>
            {task.date} {task.time ? `at ${task.time}` : ''}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: task.type === 'exam' ? Colors.primaryRedLight : Colors.warningLight }]}>
           <Text style={[styles.badgeText, { color: task.type === 'exam' ? Colors.primaryRed : Colors.warning }]}>
             {task.type === 'exam' ? 'Exam' : 'Homework'}
           </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>To-Do List</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity 
          style={styles.planButton}
          activeOpacity={0.8}
          onPress={() => router.push('/study-config')}
        >
          <Calendar size={20} color="#fff" />
          <Text style={styles.planButtonText}>Create AI Study Plan</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Upcoming Tasks ({upcomingTasks.length})</Text>
        {upcomingTasks.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming homeworks or exams! 🎉</Text>
        ) : (
          upcomingTasks.map(renderTask)
        )}

        {completedTasks.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Completed ({completedTasks.length})</Text>
            {completedTasks.map(renderTask)}
          </>
        )}

      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: typeof Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primaryRed,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  emptyText: { fontSize: 14, color: colors.textTertiary, fontStyle: 'italic', marginBottom: 20 },
  
  taskCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  checkboxContainer: { marginRight: 16 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: colors.textTertiary },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  taskDate: { fontSize: 12, color: colors.textSecondary },
  taskDateCompleted: { color: colors.textTertiary },
  
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: colors.separator, marginVertical: 24 },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryRed,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  planButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
