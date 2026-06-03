import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check, Clock } from 'lucide-react-native';
import { useEvents } from '@/context/EventContext';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateStudyPlan, DayPlan, StudyConfig, TimeSlot } from '@/utils/studyAlgorithm';

export default function StudyPlanScreen() {
  const router = useRouter();
  const { config: configStr } = useLocalSearchParams<{ config: string }>();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { events, setEvents } = useEvents();

  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  useEffect(() => {
    if (configStr && events.length > 0) {
      try {
        const config = JSON.parse(configStr) as StudyConfig;
        const generated = generateStudyPlan(events, config);
        setPlan(generated);
      } catch (err) {
        console.error("Failed to parse config or generate plan", err);
      }
    }
  }, [configStr, events]);

  const handleSlotTap = (dayIndex: number, slotIndex: number) => {
    const slot = plan[dayIndex].slots[slotIndex];

    // Cannot swap busy slots
    if (slot.type === 'busy') {
      Alert.alert("Cannot Move", "This time slot is blocked by a class or event.");
      return;
    }

    if (!selectedSlotId) {
      // If nothing selected, and it's a study slot, select it
      if (slot.type === 'study') {
        setSelectedSlotId(slot.id);
      } else {
        // Tapping a free slot first does nothing useful for swapping
        // but maybe they want to swap a free slot with a study slot? 
        // We'll allow selecting a free slot to pull a study block into it.
        setSelectedSlotId(slot.id);
      }
      return;
    }

    if (selectedSlotId === slot.id) {
      // Deselect
      setSelectedSlotId(null);
      return;
    }

    // Perform Swap
    setPlan(prevPlan => {
      const newPlan = JSON.parse(JSON.stringify(prevPlan)) as DayPlan[];
      let slot1: TimeSlot | null = null;
      let slot2: TimeSlot | null = newPlan[dayIndex].slots[slotIndex];

      // Find slot1
      for (const d of newPlan) {
        const found = d.slots.find(s => s.id === selectedSlotId);
        if (found) {
          slot1 = found;
          break;
        }
      }

      if (slot1 && slot2) {
        // Swap attributes (keep times and ids the same)
        const tempType = slot1.type;
        const tempTitle = slot1.title;
        const tempTaskId = slot1.taskId;
        const tempIsExam = slot1.isExam;

        slot1.type = slot2.type;
        slot1.title = slot2.title;
        slot1.taskId = slot2.taskId;
        slot1.isExam = slot2.isExam;

        slot2.type = tempType;
        slot2.title = tempTitle;
        slot2.taskId = tempTaskId;
        slot2.isExam = tempIsExam;
      }

      return newPlan;
    });

    setSelectedSlotId(null);
  };

  const savePlan = () => {
    // Convert study slots into real CalendarEvents and save them
    const newEvents: import('@/types').CalendarEvent[] = [];
    plan.forEach(day => {
      day.slots.forEach(slot => {
        if (slot.type === 'study') {
          newEvents.push({
            id: `study-${slot.id}-${Date.now()}`,
            title: slot.title || 'Study Session',
            date: day.date,
            time: slot.startTime,
            endTime: slot.endTime,
            type: 'study', // Save as study so it's clear in the calendar
            subject: 'AI Planner',
          });
        }
      });
    });

    if (newEvents.length > 0) {
      setEvents(prev => [...prev, ...newEvents]);
    }

    if (Platform.OS === 'web') {
      // Web native alert doesn't block properly with callbacks in some Expo versions
      window.alert("Study plan saved to your calendar!");
      router.push('/calendar');
    } else {
      Alert.alert("Success", "Study plan saved to your calendar!", [
        { text: "OK", onPress: () => router.push('/calendar') }
      ]);
    }
  };

  const getSlotStyle = (slot: TimeSlot) => {
    const isSelected = selectedSlotId === slot.id;
    if (slot.type === 'busy') return styles.slotBusy;
    if (slot.type === 'study') {
      if (slot.isExam) return [styles.slotStudyExam, isSelected && styles.slotSelected];
      return [styles.slotStudy, isSelected && styles.slotSelected];
    }
    return [styles.slotFree, isSelected && styles.slotSelected];
  };

  const getSlotTextColor = (slot: TimeSlot) => {
    if (slot.type === 'busy') return colors.textTertiary;
    if (slot.type === 'study' && slot.isExam) return colors.primaryRed;
    if (slot.type === 'study') return colors.warning;
    return colors.textTertiary;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Study Calendar</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={savePlan}>
          <Check size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.subheader}>
        <Text style={styles.subtext}>
          Tap a study block to select it, then tap an empty slot to move it.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {plan.map((day, dIdx) => (
          <View key={day.date} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Text>
            
            <View style={styles.timeline}>
              {day.slots.map((slot, sIdx) => (
                <View key={slot.id} style={styles.timelineRow}>
                  <View style={styles.timeColumn}>
                    <Text style={styles.timeText}>{slot.startTime}</Text>
                  </View>
                  <View style={styles.slotColumn}>
                    <TouchableOpacity 
                      activeOpacity={slot.type === 'busy' ? 1 : 0.7}
                      style={[styles.slot, getSlotStyle(slot)]}
                      onPress={() => handleSlotTap(dIdx, sIdx)}
                    >
                      <Text 
                        style={[
                          styles.slotTitle, 
                          { color: getSlotTextColor(slot) },
                          slot.type === 'busy' && { textDecorationLine: 'line-through' }
                        ]}
                      >
                        {slot.type === 'free' ? 'Available' : slot.title}
                      </Text>
                      {slot.type === 'study' && (
                        <Text style={[styles.slotBadge, { color: getSlotTextColor(slot) }]}>
                          {slot.isExam ? 'Exam Prep' : 'Deadline Prep'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
        {plan.length === 0 && (
          <Text style={styles.loadingText}>Generating your perfect plan...</Text>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
  },
  backBtn: { padding: 4 },
  saveBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  
  subheader: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  subtext: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  content: { padding: 20, paddingBottom: 40 },
  loadingText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 40,
    fontSize: 16,
  },

  dayContainer: {
    marginBottom: 32,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },

  timeline: {
    flexDirection: 'column',
    gap: 8,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timeColumn: {
    width: 50,
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingTop: 12,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  slotColumn: {
    flex: 1,
  },
  
  slot: {
    padding: 12,
    borderRadius: 8,
    minHeight: 50,
    justifyContent: 'center',
    borderWidth: 1,
  },
  slotBusy: {
    backgroundColor: colors.background,
    borderColor: colors.separator,
    opacity: 0.6,
  },
  slotFree: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
  },
  slotStudy: {
    backgroundColor: colors.warningLight,
    borderColor: colors.warning,
  },
  slotStudyExam: {
    backgroundColor: colors.primaryRedLight,
    borderColor: colors.primaryRed,
  },
  slotSelected: {
    borderWidth: 2,
    borderColor: colors.info,
    shadowColor: colors.info,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },

  slotTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  slotBadge: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
});
