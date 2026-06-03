import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react-native';
import { useEvents } from '@/context/EventContext';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudyConfigScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { events } = useEvents();

  const [startHour, setStartHour] = useState('09:00');
  const [endHour, setEndHour] = useState('20:00');

  const pendingTasks = events
    .filter(e => (e.type === 'deadline' || e.type === 'exam') && !e.completed)
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  // Default estimate of 2 hours per task
  const [estimates, setEstimates] = useState<Record<string, string>>(
    pendingTasks.reduce((acc, task) => ({ ...acc, [task.id]: '2' }), {})
  );

  const handleGenerate = () => {
    // Validate estimates
    const validEstimates: Record<string, number> = {};
    for (const [id, val] of Object.entries(estimates)) {
      const num = parseInt(val, 10);
      validEstimates[id] = isNaN(num) || num < 1 ? 1 : num;
    }

    const configStr = JSON.stringify({
      startHour,
      endHour,
      estimates: validEstimates,
    });

    router.push({
      pathname: '/study-plan',
      params: { config: configStr },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan Configuration</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Study Window</Text>
          <Text style={styles.sectionDesc}>When are you available to study each day?</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeInputContainer}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <View style={styles.timeInputWrapper}>
                <Clock size={16} color={colors.textSecondary} />
                <TextInput
                  style={styles.timeInput}
                  value={startHour}
                  onChangeText={setStartHour}
                  placeholder="09:00"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.timeInputContainer}>
              <Text style={styles.timeLabel}>End Time</Text>
              <View style={styles.timeInputWrapper}>
                <Clock size={16} color={colors.textSecondary} />
                <TextInput
                  style={styles.timeInput}
                  value={endHour}
                  onChangeText={setEndHour}
                  placeholder="20:00"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Task Estimates (Hours)</Text>
            <AlertCircle size={18} color={colors.primaryRed} />
          </View>
          <Text style={styles.sectionDesc}>How many hours do you need for each task? Exams will be prioritized automatically.</Text>
          
          {pendingTasks.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>You have no pending tasks to study for.</Text>
            </View>
          ) : (
            pendingTasks.map(task => (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <View style={styles.taskMeta}>
                    <CalendarIcon size={12} color={colors.textSecondary} />
                    <Text style={styles.taskDate}>{task.date}</Text>
                    <View style={[styles.badge, { backgroundColor: task.type === 'exam' ? colors.primaryRedLight : colors.warningLight }]}>
                      <Text style={[styles.badgeText, { color: task.type === 'exam' ? colors.primaryRed : colors.warning }]}>
                        {task.type === 'exam' ? 'Exam' : 'Deadline'}
                      </Text>
                    </View>
                  </View>
                </View>
                <TextInput
                  style={styles.hoursInput}
                  value={estimates[task.id]}
                  onChangeText={(val) => setEstimates(prev => ({ ...prev, [task.id]: val }))}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.hoursSuffix}>hrs</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.generateBtn, pendingTasks.length === 0 && styles.generateBtnDisabled]}
          activeOpacity={0.8}
          onPress={handleGenerate}
          disabled={pendingTasks.length === 0}
        >
          <Text style={styles.generateBtnText}>Generate Calendar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: typeof Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primaryRed,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { padding: 20, paddingBottom: 40 },
  
  section: {
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  sectionDesc: { fontSize: 13, color: colors.textSecondary, marginBottom: 16, lineHeight: 18 },
  
  timeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  timeInputContainer: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  timeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  timeInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  emptyCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textTertiary,
    fontStyle: 'italic',
  },

  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  taskInfo: {
    flex: 1,
    paddingRight: 12,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  hoursInput: {
    width: 48,
    height: 40,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.separator,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  hoursSuffix: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  
  footer: {
    padding: 20,
    paddingBottom: 34, // Safe area for iOS
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
  },
  generateBtn: {
    backgroundColor: colors.primaryRed,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  generateBtnDisabled: {
    opacity: 0.5,
  },
  generateBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
