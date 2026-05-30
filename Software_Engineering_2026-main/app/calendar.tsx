import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { MOCK_CALENDAR } from '@/constants/mockData';
import type { CalendarEvent } from '@/types';

const TYPE_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  class: { color: Colors.info, bg: Colors.infoLight, label: 'Class' },
  exam: { color: Colors.primaryRed, bg: Colors.primaryRedLight, label: 'Exam' },
  deadline: { color: Colors.warning, bg: Colors.warningLight, label: 'Deadline' },
  event: { color: Colors.categoryColors.events, bg: Colors.categoryBg.events, label: 'Event' },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function generateWeekDays(baseDate: Date) {
  const day = baseDate.getDay();
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function EventItem({ event }: { event: CalendarEvent }) {
  const cfg = TYPE_STYLES[event.type] ?? TYPE_STYLES.event;
  return (
    <View style={styles.eventItem}>
      <View style={[styles.eventStripe, { backgroundColor: cfg.color }]} />
      <View style={styles.eventContent}>
        <View style={styles.eventTopRow}>
          <View style={[styles.typePill, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.typePillText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          {event.subject && <Text style={styles.subject} numberOfLines={1}>{event.subject}</Text>}
        </View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventMeta}>
          <View style={styles.metaItem}>
            <Clock size={11} color={Colors.textTertiary} />
            <Text style={styles.metaText}>
              {event.time}{event.endTime ? ` – ${event.endTime}` : ''}
            </Text>
          </View>
          {event.location && (
            <View style={styles.metaItem}>
              <MapPin size={11} color={Colors.textTertiary} />
              <Text style={styles.metaText}>{event.location}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date('2025-04-14'));
  const [weekBase, setWeekBase] = useState(new Date('2025-04-14'));

  const weekDays = generateWeekDays(weekBase);

  const selectedStr = selectedDate.toISOString().split('T')[0];
  const dayEvents = MOCK_CALENDAR.filter((e) => e.date === selectedStr);

  const goNextWeek = () => {
    const next = new Date(weekBase);
    next.setDate(weekBase.getDate() + 7);
    setWeekBase(next);
  };
  const goPrevWeek = () => {
    const prev = new Date(weekBase);
    prev.setDate(weekBase.getDate() - 7);
    setWeekBase(prev);
  };

  const monthLabel = `${MONTHS[weekDays[0].getMonth()]} ${weekDays[0].getFullYear()}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Calendar</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.weekNav}>
          <TouchableOpacity onPress={goPrevWeek} style={styles.navBtn}>
            <ChevronLeft size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <TouchableOpacity onPress={goNextWeek} style={styles.navBtn}>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {weekDays.map((d, i) => {
            const dayStr = d.toISOString().split('T')[0];
            const isSelected = dayStr === selectedStr;
            const hasEvents = MOCK_CALENDAR.some((e) => e.date === dayStr);
            const isToday = dayStr === '2025-04-13';
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                onPress={() => setSelectedDate(d)}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>{DAYS[i]}</Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumSelected, isToday && !isSelected && styles.dayNumToday]}>
                  {d.getDate()}
                </Text>
                {hasEvents && <View style={[styles.eventDot, isSelected && styles.eventDotSelected]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
        {dayEvents.length === 0 ? (
          <View style={styles.emptyDay}>
            <Text style={styles.emptyText}>No scheduled events for this day.</Text>
          </View>
        ) : (
          dayEvents.map((e) => <EventItem key={e.id} event={e} />)
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming this week</Text>
        {MOCK_CALENDAR.filter((e) => {
          const d = new Date(e.date);
          return d >= weekDays[0] && d <= weekDays[6] && e.date !== selectedStr;
        }).map((e) => <EventItem key={e.id} event={e} />)}
      </View>

      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendRow}>
          {Object.entries(TYPE_STYLES).map(([key, val]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: val.color }]} />
              <Text style={styles.legendText}>{val.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 24 },
  header: {
    backgroundColor: Colors.primaryRed,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },

  calendarCard: {
    backgroundColor: Colors.card,
    margin: 20,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  weekNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { padding: 6 },
  monthLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },

  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCell: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  dayCellSelected: { backgroundColor: Colors.primaryRed },
  dayLabel: { fontSize: 11, fontWeight: '600', color: Colors.textTertiary, textTransform: 'uppercase' },
  dayLabelSelected: { color: 'rgba(255,255,255,0.75)' },
  dayNum: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  dayNumSelected: { color: '#fff' },
  dayNumToday: { color: Colors.primaryRed },
  eventDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primaryRed },
  eventDotSelected: { backgroundColor: 'rgba(255,255,255,0.8)' },

  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },

  eventItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  eventStripe: { width: 4 },
  eventContent: { flex: 1, padding: 12 },
  eventTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  typePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  typePillText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  subject: { fontSize: 11, color: Colors.textTertiary, flex: 1 },
  eventTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  eventMeta: { gap: 3 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, color: Colors.textSecondary },

  emptyDay: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: { color: Colors.textTertiary, fontSize: 14 },

  legendCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 16,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: Colors.textSecondary },
});
