import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowLeft,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Calendar,
  LayoutGrid,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_CALENDAR } from '@/constants/mockData';
import type { CalendarEvent } from '@/types';

// Asegura que el navegador se cierre al autenticar en dispositivos móviles
WebBrowser.maybeCompleteAuthSession();

// ─── Supabase Configuration ──────────────────────────────────────────────────
const supabaseUrl = 'https://prrtyicplljeyqpuhnpf.supabase.co';
const supabaseAnonKey = 'sb_publishable__CfchfHgr_hvXH5uuzWrIw_bdADyLxU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Constants ───────────────────────────────────────────────────────────────

const getTypeStyles = (colors: typeof Colors): Record<string, { color: string; bg: string; label: string }> => ({
  class:    { color: colors.info,                    bg: colors.infoLight,          label: 'Class' },
  exam:     { color: colors.primaryRed,              bg: colors.primaryRedLight,    label: 'Exam' },
  deadline: { color: colors.warning,                 bg: colors.warningLight,       label: 'Deadline' },
  event:    { color: colors.categoryColors.events,   bg: colors.categoryBg.events,  label: 'Event' },
  google:   { color: '#4285F4',                      bg: '#E8F0FE',                 label: 'Google Sync' },
});

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

function getWeekDays(base: Date): Date[] {
  const dow = base.getDay();
  const monday = new Date(base);
  monday.setDate(base.getDate() - (dow === 0 ? 6 : dow - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getDaysInMonth(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const startDow = first.getDay();
  const padStart = startDow === 0 ? 6 : startDow - 1;
  const cells: (Date | null)[] = Array(padStart).fill(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function genId() {
  return 'u' + Math.random().toString(36).slice(2, 9);
}

// ─── EventItem ───────────────────────────────────────────────────────────────

function EventItem({ event, colors }: { event: CalendarEvent; colors: typeof Colors }) {
  const styles    = useMemo(() => makeStyles(colors), [colors]);
  const typeStyles = useMemo(() => getTypeStyles(colors), [colors]);
  const cfg = typeStyles[event.type] ?? typeStyles.event;

  return (
    <View style={styles.eventItem}>
      <View style={[styles.eventStripe, { backgroundColor: cfg.color }]} />
      <View style={styles.eventContent}>
        <View style={styles.eventTopRow}>
          <View style={[styles.typePill, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.typePillText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          {event.subject && (
            <Text style={styles.subject} numberOfLines={1}>{event.subject}</Text>
          )}
        </View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventMeta}>
          <View style={styles.metaItem}>
            <Clock size={11} color={colors.textTertiary} />
            <Text style={styles.metaText}>
              {event.time}{event.endTime ? ` – ${event.endTime}` : ''}
            </Text>
          </View>
          {event.location && (
            <View style={styles.metaItem}>
              <MapPin size={11} color={colors.textTertiary} />
              <Text style={styles.metaText}>{event.location}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Add Event Modal ──────────────────────────────────────────────────────────

type EventType = 'class' | 'exam' | 'deadline' | 'event';

interface AddEventModalProps {
  visible: boolean;
  defaultDate: string;
  onClose: () => void;
  onAdd: (event: CalendarEvent) => void;
  colors: typeof Colors;
}

function AddEventModal({ visible, defaultDate, onClose, onAdd, colors }: AddEventModalProps) {
  const styles     = useMemo(() => makeStyles(colors), [colors]);
  const typeStyles = useMemo(() => getTypeStyles(colors), [colors]);

  const [title, setTitle]       = useState('');
  const [date, setDate]         = useState(defaultDate);
  const [time, setTime]         = useState('10:00');
  const [endTime, setEndTime]   = useState('');
  const [location, setLocation] = useState('');
  const [subject, setSubject]   = useState('');
  const [type, setType]         = useState<EventType>('class');

  const reset = () => {
    setTitle(''); setDate(defaultDate); setTime('10:00');
    setEndTime(''); setLocation(''); setSubject(''); setType('class');
  };

  const handleAdd = () => {
    if (!title.trim() || !date.trim() || !time.trim()) return;
    onAdd({
      id: genId(),
      title: title.trim(),
      date: date.trim(),
      time: time.trim(),
      endTime: endTime.trim() || undefined,
      location: location.trim() || undefined,
      subject: subject.trim() || undefined,
      type,
    });
    reset();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  const typeEntries = (Object.entries(typeStyles).filter(([k]) => k !== 'google')) as [EventType, typeof typeStyles[string]][];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Event</Text>
            <TouchableOpacity onPress={handleClose} style={styles.modalCloseBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>Type</Text>
            <View style={styles.typeRow}>
              {typeEntries.map(([key, val]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.typeChip,
                    { borderColor: val.color },
                    type === key && { backgroundColor: val.color },
                  ]}
                  onPress={() => setType(key)}
                >
                  <Text style={[styles.typeChipText, { color: type === key ? '#fff' : val.color }]}>
                    {val.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Title *</Text>
            <TextInput style={styles.input} placeholder="e.g. Media Theory" placeholderTextColor={colors.textTertiary} value={title} onChangeText={setTitle} />

            <Text style={styles.fieldLabel}>Subject</Text>
            <TextInput style={styles.input} placeholder="e.g. Cultural Studies" placeholderTextColor={colors.textTertiary} value={subject} onChangeText={setSubject} />

            <Text style={styles.fieldLabel}>Date * (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} placeholder="2026-05-19" placeholderTextColor={colors.textTertiary} value={date} onChangeText={setDate} keyboardType="numeric" />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Start time *</Text>
                <TextInput style={styles.input} placeholder="10:00" placeholderTextColor={colors.textTertiary} value={time} onChangeText={setTime} keyboardType="numeric" />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>End time</Text>
                <TextInput style={styles.input} placeholder="12:00" placeholderTextColor={colors.textTertiary} value={endTime} onChangeText={setEndTime} keyboardType="numeric" />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Location</Text>
            <TextInput style={styles.input} placeholder="e.g. Room 52.S31" placeholderTextColor={colors.textTertiary} value={location} onChangeText={setLocation} />

            <TouchableOpacity
              style={[styles.addBtn, (!title.trim() || !date.trim() || !time.trim()) && styles.addBtnDisabled]}
              onPress={handleAdd}
              disabled={!title.trim() || !date.trim() || !time.trim()}
            >
              <Plus size={18} color="#fff" />
              <Text style={styles.addBtnText}>Add Event</Text>
            </TouchableOpacity>

            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

type ViewMode = 'monthly' | 'daily';

export default function CalendarScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles     = useMemo(() => makeStyles(colors), [colors]);
  const typeStyles = useMemo(() => getTypeStyles(colors), [colors]);

  const today = new Date();
  const [viewMode, setViewMode]         = useState<ViewMode>('monthly');
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekBase, setWeekBase]         = useState(today);
  const [monthBase, setMonthBase]       = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents]             = useState<CalendarEvent[]>(MOCK_CALENDAR);
  const [showModal, setShowModal]       = useState(false);
  const [syncing, setSyncing]           = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  useEffect(() => {
    checkExistingGoogleSession();
  }, []);

  const checkExistingGoogleSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.provider_token) {
      setIsGoogleConnected(true);
      fetchGoogleCalendarEvents(session.provider_token);
    }
  };

  const handleConnectGoogle = async () => {
    setSyncing(true);
    try {
      const redirectTo = AuthSession.makeRedirectUri();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly',
          redirectTo,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (result.type === 'success') {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session?.provider_token) {
            setIsGoogleConnected(true);
            await fetchGoogleCalendarEvents(sessionData.session.provider_token);
            Alert.alert('Success', 'Google Calendar synced flawlessly!');
          }
        }
      }
    } catch (err: any) {
      Alert.alert('Sync Error', err.message || 'Failed to link Google account.');
    } finally {
      setSyncing(false);
    }
  };

  const fetchGoogleCalendarEvents = async (token: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString()}&maxResults=100`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();

      if (data.items) {
        const mappedGoogleEvents: CalendarEvent[] = data.items
          .filter((gEvent: any) => gEvent.start?.date || gEvent.start?.dateTime)
          .map((gEvent: any) => {
            const startDateTime = gEvent.start.dateTime || gEvent.start.date;
            const endDateTime   = gEvent.end?.dateTime || gEvent.end?.date || '';
            const eventDate     = startDateTime.split('T')[0];
            const eventTime     = gEvent.start.dateTime ? startDateTime.split('T')[1].slice(0, 5) : '00:00';
            const eventEndTime  = gEvent.end?.dateTime ? endDateTime.split('T')[1].slice(0, 5) : undefined;
            return {
              id: gEvent.id,
              title: gEvent.summary || 'No Title',
              date: eventDate,
              time: eventTime,
              endTime: eventEndTime,
              location: gEvent.location || undefined,
              type: 'google',
              subject: 'Google Account',
            };
          });

        setEvents((prev) => {
          const localEvents = prev.filter((e) => (e.type as string) !== 'google');
          return [...localEvents, ...mappedGoogleEvents];
        });
      }
    } catch (err) {
      console.error('Error fetching Google items:', err);
    }
  };

  // ── Derived ─────────────────────────────────────────────────────────────
  const selectedStr = toDateStr(selectedDate);
  const weekDays    = getWeekDays(weekBase);
  const monthCells  = getDaysInMonth(monthBase.getFullYear(), monthBase.getMonth());
  const dayEvents   = events
    .filter((e) => e.date === selectedStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleAddEvent = (ev: CalendarEvent) => setEvents((prev) => [...prev, ev]);
  const selectDay = (d: Date) => { setSelectedDate(d); setWeekBase(d); setViewMode('daily'); };
  const prevMonth = () => setMonthBase(new Date(monthBase.getFullYear(), monthBase.getMonth() - 1, 1));
  const nextMonth = () => setMonthBase(new Date(monthBase.getFullYear(), monthBase.getMonth() + 1, 1));
  const prevWeek  = () => { const d = new Date(weekBase); d.setDate(d.getDate() - 7); setWeekBase(d); };
  const nextWeek  = () => { const d = new Date(weekBase); d.setDate(d.getDate() + 7); setWeekBase(d); };

  const weekLabel  = `${MONTHS[weekDays[0].getMonth()]} ${weekDays[0].getFullYear()}`;
  const monthLabel = `${MONTHS[monthBase.getMonth()]} ${monthBase.getFullYear()}`;

  // ── Monthly View ─────────────────────────────────────────────────────────
  const MonthlyView = () => (
    <View style={styles.calendarCard}>
      <View style={styles.weekNav}>
        <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
          <ChevronLeft size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {DAYS_SHORT.map((d) => (
          <View key={d} style={styles.dayHeaderCell}>
            <Text style={styles.dayHeaderText}>{d}</Text>
          </View>
        ))}
      </View>

      <View style={styles.monthGrid}>
        {monthCells.map((cell, i) => {
          if (!cell) return <View key={`empty-${i}`} style={styles.monthCell} />;
          const str        = toDateStr(cell);
          const isSelected = str === selectedStr;
          const hasEvents  = events.some((e) => e.date === str);
          const isToday    = str === toDateStr(new Date());
          const eventCount = events.filter((e) => e.date === str).length;
          return (
            <TouchableOpacity
              key={str}
              style={[styles.monthCell, isSelected && styles.monthCellSelected]}
              onPress={() => selectDay(cell)}
            >
              <Text style={[
                styles.monthCellNum,
                isSelected && styles.monthCellNumSelected,
                isToday && !isSelected && styles.monthCellNumToday,
              ]}>
                {cell.getDate()}
              </Text>
              {hasEvents && (
                <View style={styles.dotRow}>
                  {Array.from({ length: Math.min(eventCount, 3) }).map((_, di) => (
                    <View key={di} style={[styles.eventDot, isSelected && styles.eventDotSelected]} />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ── Daily View ────────────────────────────────────────────────────────────
  const DailyView = () => (
    <>
      <View style={styles.calendarCard}>
        <View style={styles.weekNav}>
          <TouchableOpacity onPress={prevWeek} style={styles.navBtn}>
            <ChevronLeft size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{weekLabel}</Text>
          <TouchableOpacity onPress={nextWeek} style={styles.navBtn}>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.weekRow}>
          {weekDays.map((d, i) => {
            const dayStr     = toDateStr(d);
            const isSelected = dayStr === selectedStr;
            const hasEvents  = events.some((e) => e.date === dayStr);
            const isToday    = dayStr === toDateStr(new Date());
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                onPress={() => setSelectedDate(d)}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                  {DAYS_SHORT[i]}
                </Text>
                <Text style={[
                  styles.dayNum,
                  isSelected && styles.dayNumSelected,
                  isToday && !isSelected && styles.dayNumToday,
                ]}>
                  {d.getDate()}
                </Text>
                {hasEvents && (
                  <View style={[styles.eventDot, isSelected && styles.eventDotSelected]} />
                )}
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
          dayEvents.map((e) => <EventItem key={e.id} event={e} colors={colors} />)
        )}
      </View>
    </>
  );

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Calendar</Text>
          <TouchableOpacity style={styles.addHeaderBtn} onPress={() => setShowModal(true)}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Google Sync */}
        <TouchableOpacity
          style={[styles.googleSyncBtn, isGoogleConnected && styles.googleSyncBtnConnected]}
          onPress={handleConnectGoogle}
          disabled={syncing}
        >
          {syncing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.googleSyncBtnText}>
              {isGoogleConnected ? '✓ Google Calendar Connected' : 'Sync Google Calendar'}
            </Text>
          )}
        </TouchableOpacity>

        {/* View toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'daily' && styles.toggleBtnActive]}
            onPress={() => setViewMode('daily')}
          >
            <Calendar size={15} color={viewMode === 'daily' ? '#fff' : colors.textSecondary} />
            <Text style={[styles.toggleBtnText, viewMode === 'daily' && styles.toggleBtnTextActive]}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'monthly' && styles.toggleBtnActive]}
            onPress={() => setViewMode('monthly')}
          >
            <LayoutGrid size={15} color={viewMode === 'monthly' ? '#fff' : colors.textSecondary} />
            <Text style={[styles.toggleBtnText, viewMode === 'monthly' && styles.toggleBtnTextActive]}>Monthly</Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'monthly' ? <MonthlyView /> : <DailyView />}

        {viewMode === 'monthly' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
            {dayEvents.length === 0 ? (
              <View style={styles.emptyDay}>
                <Text style={styles.emptyText}>No scheduled events for this day.</Text>
              </View>
            ) : (
              dayEvents.map((e) => <EventItem key={e.id} event={e} colors={colors} />)
            )}
          </View>
        )}

        {/* Legend */}
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendRow}>
            {Object.entries(typeStyles).map(([key, val]) => (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: val.color }]} />
                <Text style={styles.legendText}>{val.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      <AddEventModal
        visible={showModal}
        defaultDate={selectedStr}
        onClose={() => setShowModal(false)}
        onAdd={handleAddEvent}
        colors={colors}
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const makeStyles = (colors: typeof Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content:   { paddingBottom: 100 },
  header: {
    backgroundColor: colors.primaryRed,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn:       { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  addHeaderBtn:  { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle:   { fontSize: 18, fontWeight: '700', color: '#fff' },
  googleSyncBtn: {
    backgroundColor: '#4285F4',
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  googleSyncBtnConnected: { backgroundColor: '#2E7D32', shadowColor: '#2E7D32' },
  googleSyncBtnText:      { color: '#fff', fontWeight: '700', fontSize: 14 },
  toggleRow:           { flexDirection: 'row', marginHorizontal: 20, marginTop: 16, marginBottom: 4, backgroundColor: colors.card, borderRadius: 14, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  toggleBtn:           { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 11 },
  toggleBtnActive:     { backgroundColor: colors.primaryRed },
  toggleBtnText:       { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  toggleBtnTextActive: { color: '#fff' },
  calendarCard: { backgroundColor: colors.card, margin: 20, borderRadius: 18, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  weekNav:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn:       { padding: 6 },
  monthLabel:   { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  weekRow:      { flexDirection: 'row', justifyContent: 'space-between' },
  dayCell:          { alignItems: 'center', flex: 1, paddingVertical: 8, borderRadius: 12, gap: 4 },
  dayCellSelected:  { backgroundColor: colors.primaryRed },
  dayLabel:         { fontSize: 11, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase' },
  dayLabelSelected: { color: 'rgba(255,255,255,0.75)' },
  dayNum:           { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  dayNumSelected:   { color: '#fff' },
  dayNumToday:      { color: colors.primaryRed },
  dayHeaderCell: { flex: 1, alignItems: 'center', paddingBottom: 8 },
  dayHeaderText: { fontSize: 11, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase' },
  monthGrid:            { flexDirection: 'row', flexWrap: 'wrap' },
  monthCell:            { width: `${100 / 7}%`, aspectRatio: 0.9, alignItems: 'center', justifyContent: 'center', borderRadius: 10, gap: 3, marginVertical: 2 },
  monthCellSelected:    { backgroundColor: colors.primaryRed },
  monthCellNum:         { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  monthCellNumSelected: { color: '#fff' },
  monthCellNumToday:    { color: colors.primaryRed },
  dotRow:               { flexDirection: 'row', gap: 2 },
  eventDot:         { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primaryRed },
  eventDotSelected: { backgroundColor: 'rgba(255,255,255,0.8)' },
  section:      { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  eventItem:    { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 14, overflow: 'hidden', marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  eventStripe:  { width: 4 },
  eventContent: { flex: 1, padding: 12 },
  eventTopRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  typePill:     { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  typePillText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  subject:      { fontSize: 11, color: colors.textTertiary, flex: 1 },
  eventTitle:   { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 6 },
  eventMeta:    { gap: 3 },
  metaItem:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText:     { fontSize: 12, color: colors.textSecondary },
  emptyDay:  { backgroundColor: colors.card, borderRadius: 14, padding: 20, alignItems: 'center' },
  emptyText: { color: colors.textTertiary, fontSize: 14 },
  legendCard:  { backgroundColor: colors.card, marginHorizontal: 20, borderRadius: 14, padding: 16 },
  legendTitle: { fontSize: 12, fontWeight: '700', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  legendRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:   { width: 10, height: 10, borderRadius: 5 },
  legendText:  { fontSize: 13, color: colors.textSecondary },
  fab: { position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primaryRed, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primaryRed, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  modalOverlay:  { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalSheet:    { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle:    { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  modalCloseBtn: { padding: 4 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6, marginTop: 14 },
  input:      { backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.textPrimary, borderWidth: 1, borderColor: colors.cardBorder },
  typeRow:    { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typeChip:      { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  typeChipText:  { fontSize: 13, fontWeight: '600' },
  row:           { flexDirection: 'row' },
  addBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primaryRed, borderRadius: 14, paddingVertical: 15, marginTop: 24 },
  addBtnDisabled: { opacity: 0.5 },
  addBtnText:     { fontSize: 15, fontWeight: '700', color: '#fff' },
});
