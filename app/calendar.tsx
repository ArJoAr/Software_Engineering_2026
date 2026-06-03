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
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
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
  Chrome,
  KeyRound,
  CalendarDays,
  FileDown,
  Home,
  Trash2,
} from 'lucide-react-native';
import { Colors, ColorTheme } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import type { CalendarEvent } from '@/types';
import { useEvents } from '@/context/EventContext';

WebBrowser.maybeCompleteAuthSession();

// ─── Supabase ─────────────────────────────────────────────────────────────────

const supabaseUrl = 'https://prrtyicplljeyqpuhnpf.supabase.co';
const supabaseAnonKey = 'sb_publishable__CfchfHgr_hvXH5uuzWrIw_bdADyLxU';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Constants ───────────────────────────────────────────────────────────────

interface TypeStyleConfig { color: string; bg: string; label: string }

const getTypeStyles = (colors: any): Record<string, TypeStyleConfig> => ({
  class:    { color: colors.info,                    bg: colors.infoLight,      label: 'Class' },
  exam:     { color: colors.primaryRed,              bg: colors.primaryRedLight, label: 'Exam' },
  deadline: { color: colors.warning,                 bg: colors.warningLight,   label: 'Deadline' },
  event:    { color: colors.textSecondary,           bg: colors.card,           label: 'Event' },
  google:   { color: '#4285F4',                      bg: '#E8F0FE',             label: 'Google Sync' },
  upf:      { color: '#003B46',                      bg: '#E6F0F2',             label: 'UPF Sync' },
  study:    { color: colors.success,                 bg: '#E8F5E9',             label: 'Study Plan' },
});

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeekDays(base: Date): Date[] {
  const dow = base.getDay();
  const monday = new Date(base.getFullYear(), base.getMonth(), base.getDate());
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

function genId() { return 'u' + Math.random().toString(36).slice(2, 9); }

function parseICSString(text: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const cleanText = text.replace(/\r/g, '');
  const vevents = cleanText.split('BEGIN:VEVENT');

  for (let i = 1; i < vevents.length; i++) {
    const block = vevents[i];
    const summaryMatch  = block.match(/SUMMARY:(.*)/);
    const dtstartMatch  = block.match(/DTSTART[;:].*?([0-9]{8}T[0-9]{6})/);
    const dtendMatch    = block.match(/DTEND[;:].*?([0-9]{8}T[0-9]{6})/);
    const locationMatch = block.match(/LOCATION:(.*)/);

    if (summaryMatch && dtstartMatch) {
      const rawStart = dtstartMatch[1];
      const eventDate = `${rawStart.substring(0, 4)}-${rawStart.substring(4, 6)}-${rawStart.substring(6, 8)}`;
      let eventTime = '00:00';
      if (rawStart.includes('T')) {
        eventTime = `${rawStart.substring(9, 11)}:${rawStart.substring(11, 13)}`;
      }
      let eventEndTime: string | undefined;
      if (dtendMatch) {
        const rawEnd = dtendMatch[1];
        if (rawEnd.includes('T')) {
          eventEndTime = `${rawEnd.substring(9, 11)}:${rawEnd.substring(11, 13)}`;
        }
      }
      let title = summaryMatch[1].replace(/\\,/g, ',').trim();
      if (title.includes('|')) title = title.split('|')[0].trim();
      const isExam = title.toLowerCase().includes('exam');

      events.push({
        id: 'upf-' + Math.random().toString(36).slice(2, 9),
        title,
        date: eventDate,
        time: eventTime,
        endTime: eventEndTime,
        location: locationMatch ? locationMatch[1].replace(/\\,/g, ',').trim() : undefined,
        type: isExam ? 'exam' : 'upf',
        subject: 'UPF',
      });
    }
  }
  return events;
}

// ─── EventItem ───────────────────────────────────────────────────────────────

function EventItem({ event, onDelete, colors }: { event: CalendarEvent; onDelete: (id: string) => void; colors: ColorTheme }) {
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const typeStyles = getTypeStyles(colors);
  const cfg = typeStyles[event.type] ?? typeStyles.event;
  return (
    <View style={styles.eventItem}>
      <View style={[styles.eventStripe, { backgroundColor: cfg.color }]} />
      <View style={styles.eventContent}>
        <View style={styles.eventTopRow}>
          <View style={[styles.typePill, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.typePillText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {event.subject && (
              <Text style={styles.subject} numberOfLines={1}>{event.subject}</Text>
            )}
            <TouchableOpacity onPress={() => onDelete(event.id)}>
              <Trash2 size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
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
  colors: ColorTheme;
}

function AddEventModal({ visible, defaultDate, onClose, onAdd, colors }: AddEventModalProps) {
  const styles     = useMemo(() => makeStyles(colors), [colors]);
  const typeStyles = getTypeStyles(colors);

  const [title, setTitle]       = useState('');
  const [date, setDate]         = useState(defaultDate);
  const [time, setTime]         = useState('10:00');
  const [endTime, setEndTime]   = useState('');
  const [location, setLocation] = useState('');
  const [subject, setSubject]   = useState('');
  const [type, setType]         = useState<EventType>('class');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const reset = () => {
    setTitle(''); setDate(defaultDate); setTime('10:00');
    setEndTime(''); setLocation(''); setSubject(''); setType('class');
    setErrorMsg(null);
  };

  const isValidTime = (t: string) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(t.trim());

  const handleAdd = () => {
    if (!title.trim() || !date.trim() || !time.trim()) return;
    setErrorMsg(null);

    if (!isValidTime(time)) {
      const msg = 'Start time must be in HH:MM format (00:00 – 23:59)';
      setErrorMsg(msg);
      Alert.alert('Invalid Schedule', msg);
      return;
    }
    if (endTime.trim()) {
      if (!isValidTime(endTime)) {
        const msg = 'End time must be in HH:MM format (00:00 – 23:59)';
        setErrorMsg(msg);
        Alert.alert('Invalid Schedule', msg);
        return;
      }
      const [sh, sm] = time.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      if (eh * 60 + em <= sh * 60 + sm) {
        const msg = 'End time cannot be earlier than or equal to start time.';
        setErrorMsg(msg);
        Alert.alert('Unrealistic Hours', msg);
        return;
      }
    }

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
  const allowedKeys: EventType[] = ['class', 'exam', 'deadline', 'event'];

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
              {allowedKeys.map((key) => {
                const val = typeStyles[key];
                return (
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
                );
              })}
            </View>

            <Text style={styles.fieldLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Media Theory"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.fieldLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Cultural Studies"
              placeholderTextColor={colors.textTertiary}
              value={subject}
              onChangeText={setSubject}
            />

            <Text style={styles.fieldLabel}>Date * (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-05-19"
              placeholderTextColor={colors.textTertiary}
              value={date}
              onChangeText={setDate}
              keyboardType="numeric"
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Start time * (HH:MM)</Text>
                <TextInput
                  style={[styles.input, errorMsg ? styles.inputError : null]}
                  placeholder="10:00"
                  placeholderTextColor={colors.textTertiary}
                  value={time}
                  onChangeText={setTime}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>End time (HH:MM)</Text>
                <TextInput
                  style={[styles.input, errorMsg ? styles.inputError : null]}
                  placeholder="12:00"
                  placeholderTextColor={colors.textTertiary}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Room 52.S31"
              placeholderTextColor={colors.textTertiary}
              value={location}
              onChangeText={setLocation}
            />

            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

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
  const { events, setEvents }           = useEvents();
  const [showModal, setShowModal]       = useState(false);

  const [syncing, setSyncing]           = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  const [syncingUPF, setSyncingUPF]     = useState(false);
  const [isUPFConnected, setIsUPFConnected] = useState(false);
  const [showUPFGuide, setShowUPFGuide] = useState(false);

  useEffect(() => {
    checkExistingGoogleSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            Alert.alert('Success', 'Google Calendar synced!');
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
        const mapped: CalendarEvent[] = data.items
          .filter((e: any) => e.start?.date || e.start?.dateTime)
          .map((e: any) => {
            const start = e.start.dateTime || e.start.date;
            const end   = e.end?.dateTime  || e.end?.date || '';
            return {
              id: e.id,
              title: e.summary || 'No Title',
              date: start.split('T')[0],
              startTime: e.start.dateTime ? start.split('T')[1].slice(0, 5) : '00:00',
              endTime:   e.end?.dateTime  ? end.split('T')[1].slice(0, 5)   : undefined,
              location: e.location || undefined,
              type: 'google',
              subject: 'Google Account',
            };
          });
        setEvents((prev) => [...prev.filter((e) => e.subject !== 'Google Account'), ...mapped]);
      }
    } catch (err) {
      console.error('Error fetching Google events:', err);
    }
  };

  const handlePickICSFile = async () => {
    setShowUPFGuide(false);
    setSyncingUPF(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/calendar', 'application/ics'],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) { setSyncingUPF(false); return; }

      const file = result.assets[0];
      let content = '';
      if (Platform.OS === 'web') {
        content = await (await fetch(file.uri)).text();
      } else {
        content = await FileSystem.readAsStringAsync(file.uri);
      }

      const upfEvents = parseICSString(content);
      if (!upfEvents.length) {
        Alert.alert('Aviso', 'No se encontraron clases válidas. Asegúrate de exportar desde la Secretaría Virtual de la UPF.');
        setSyncingUPF(false);
        return;
      }
      setEvents((prev) => [...prev.filter((e) => e.subject !== 'UPF'), ...upfEvents]);
      setIsUPFConnected(true);
      Alert.alert('¡Éxito!', `Se han sincronizado ${upfEvents.length} eventos de tu horario UPF.`);
    } catch (err) {
      console.error(err);
      Alert.alert('Error de importación', 'Hubo un problema al leer el archivo .ics.');
    } finally {
      setSyncingUPF(false);
    }
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const selectedStr = toDateStr(selectedDate);
  const weekDays    = getWeekDays(weekBase);
  const monthCells  = getDaysInMonth(monthBase.getFullYear(), monthBase.getMonth());
  const dayEvents   = events
    .filter((e) => e.date === selectedStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAddEvent = (ev: CalendarEvent) => setEvents((prev) => [...prev, ev]);

  const handleDeleteEvent = (id: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Are you sure you want to remove this event?");
      if (confirmed) setEvents(prev => prev.filter(e => e.id !== id));
    } else {
      Alert.alert("Delete Event", "Are you sure you want to remove this event?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => setEvents(prev => prev.filter(e => e.id !== id)) }
      ]);
    }
  };

  const selectDay = (d: Date) => {
    setSelectedDate(d);
    setWeekBase(d);
    setViewMode('daily');
  };

  const prevMonth = () => setMonthBase(new Date(monthBase.getFullYear(), monthBase.getMonth() - 1, 1));
  const nextMonth = () => setMonthBase(new Date(monthBase.getFullYear(), monthBase.getMonth() + 1, 1));
  const prevWeek = () => { const d = new Date(weekBase); d.setDate(d.getDate() - 7); setWeekBase(d); };
  const nextWeek = () => { const d = new Date(weekBase); d.setDate(d.getDate() + 7); setWeekBase(d); };

  const weekLabel  = `${MONTHS[weekDays[0].getMonth()]} ${weekDays[0].getFullYear()}`;
  const monthLabel = `${MONTHS[monthBase.getMonth()]} ${monthBase.getFullYear()}`;

  // ── Monthly View ─────────────────────────────────────────────────────────────
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

  // ── Daily View ────────────────────────────────────────────────────────────────
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
          dayEvents.map((e) => <EventItem key={e.id} event={e} onDelete={handleDeleteEvent} colors={colors} />)
        )}
      </View>
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Calendar</Text>
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
              <Home size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addHeaderBtn} onPress={() => setShowModal(true)}>
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>
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
            <Text style={styles.syncBtnText}>
              {isGoogleConnected ? '✓ Google Calendar Connected' : 'Sync Google Calendar'}
            </Text>
          )}
        </TouchableOpacity>

        {/* UPF Sync */}
        <TouchableOpacity
          style={[styles.upfSyncBtn, isUPFConnected && styles.upfSyncBtnConnected]}
          onPress={() => setShowUPFGuide(true)}
          disabled={syncingUPF}
        >
          {syncingUPF ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.syncBtnText}>
              {isUPFConnected ? '✓ UPF Calendar Connected' : 'Sync UPF Secretaría Virtual'}
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
              dayEvents.map((e) => <EventItem key={e.id} event={e} onDelete={handleDeleteEvent} colors={colors} />)
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

      {/* UPF Guide Modal */}
      <Modal
        visible={showUPFGuide}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUPFGuide(false)}
      >
        <View style={styles.guideOverlay}>
          <View style={styles.guideSheet}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideTitle}>Exportar horario de la UPF</Text>
              <TouchableOpacity onPress={() => setShowUPFGuide(false)} style={styles.guideCloseBtn}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.stepBlock}>
                <View style={styles.stepIndicator}>
                  <Chrome size={16} color="#003B46" />
                  <Text style={styles.stepIndicatorText}>1</Text>
                </View>
                <Text style={styles.stepBodyText}>
                  Entra a la <Text style={styles.boldText}>Chrome Web Store</Text> y busca{' '}
                  <Text style={styles.boldText}>&quot;Exportador de horario y calendario UPF&quot;</Text>. Instálala en tu navegador.
                </Text>
              </View>

              <View style={styles.stepBlock}>
                <View style={styles.stepIndicator}>
                  <KeyRound size={16} color="#003B46" />
                  <Text style={styles.stepIndicatorText}>2</Text>
                </View>
                <Text style={styles.stepBodyText}>
                  Inicia sesión en el <Text style={styles.boldText}>Campus Global de la UPF</Text> y dirígete a la{' '}
                  <Text style={styles.boldText}>Secretaría Virtual</Text>.
                </Text>
              </View>

              <View style={styles.stepBlock}>
                <View style={styles.stepIndicator}>
                  <CalendarDays size={16} color="#003B46" />
                  <Text style={styles.stepIndicatorText}>3</Text>
                </View>
                <Text style={styles.stepBodyText}>
                  Abre tu sección de <Text style={styles.boldText}>Calendario de clases / Horario</Text>.
                </Text>
              </View>

              <View style={styles.stepBlock}>
                <View style={styles.stepIndicator}>
                  <FileDown size={16} color="#003B46" />
                  <Text style={styles.stepIndicatorText}>4</Text>
                </View>
                <Text style={styles.stepBodyText}>
                  Haz clic en el icono de la extensión. Selecciona el rango de fechas, presiona{' '}
                  <Text style={styles.boldText}>Detectar materias</Text> y haz clic en{' '}
                  <Text style={styles.boldText}>Exportar .ics</Text>.
                </Text>
              </View>

              <TouchableOpacity style={styles.guideActionBtn} onPress={handlePickICSFile}>
                <FileDown size={18} color="#fff" />
                <Text style={styles.guideActionBtnText}>Subir archivo .ics descargado</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* FAB */}
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

// ─── Styles (theme-aware) ─────────────────────────────────────────────────────
//
// IMPORTANT: never reference the static `Colors` object here.
// Every colour must come from the `colors` parameter so that
// dark mode works correctly when the user toggles the theme.

const makeStyles = (colors: ColorTheme) => StyleSheet.create({
  // Layout
  container: { flex: 1, backgroundColor: colors.background },
  content:   { paddingBottom: 100 },

  // Header (always red – intentional brand colour)
  header: {
    backgroundColor: colors.primaryRed,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn:      { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  addHeaderBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle:  { fontSize: 18, fontWeight: '700', color: '#fff' },

  // Sync buttons
  googleSyncBtn: {
    backgroundColor: '#4285F4',
    marginHorizontal: 20, marginTop: 15,
    paddingVertical: 12, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#4285F4', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4, elevation: 2,
  },
  googleSyncBtnConnected: { backgroundColor: '#2E7D32', shadowColor: '#2E7D32' },
  upfSyncBtn: {
    backgroundColor: '#003B46',
    marginHorizontal: 20, marginTop: 10,
    paddingVertical: 12, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    elevation: 2,
  },
  upfSyncBtnConnected: { backgroundColor: '#2E7D32' },
  syncBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // View toggle
  toggleRow:           { flexDirection: 'row', marginHorizontal: 20, marginTop: 16, marginBottom: 4, backgroundColor: colors.card, borderRadius: 14, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  toggleBtn:           { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 11 },
  toggleBtnActive:     { backgroundColor: colors.primaryRed },
  toggleBtnText:       { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  toggleBtnTextActive: { color: '#fff' },

  // Calendar card
  calendarCard: { backgroundColor: colors.card, margin: 20, borderRadius: 18, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  weekNav:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn:       { padding: 6 },
  monthLabel:   { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  weekRow:      { flexDirection: 'row', justifyContent: 'space-between' },

  // Day cells (daily view)
  dayCell:          { alignItems: 'center', flex: 1, paddingVertical: 8, borderRadius: 12, gap: 4 },
  dayCellSelected:  { backgroundColor: colors.primaryRed },
  dayLabel:         { fontSize: 11, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase' },
  dayLabelSelected: { color: 'rgba(255,255,255,0.75)' },
  dayNum:           { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  dayNumSelected:   { color: '#fff' },
  dayNumToday:      { color: colors.primaryRed },

  // Day header row (monthly view)
  dayHeaderCell: { flex: 1, alignItems: 'center', paddingBottom: 8 },
  dayHeaderText: { fontSize: 11, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase' },

  // Month grid
  monthGrid:            { flexDirection: 'row', flexWrap: 'wrap' },
  monthCell:            { width: `${100 / 7}%`, aspectRatio: 0.9, alignItems: 'center', justifyContent: 'center', borderRadius: 10, gap: 3, marginVertical: 2 },
  monthCellSelected:    { backgroundColor: colors.primaryRed },
  monthCellNum:         { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  monthCellNumSelected: { color: '#fff' },
  monthCellNumToday:    { color: colors.primaryRed },

  // Event dots
  dotRow:           { flexDirection: 'row', gap: 2 },
  eventDot:         { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primaryRed },
  eventDotSelected: { backgroundColor: 'rgba(255,255,255,0.8)' },

  // Section / event list
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
  emptyDay:     { backgroundColor: colors.card, borderRadius: 14, padding: 20, alignItems: 'center' },
  emptyText:    { color: colors.textTertiary, fontSize: 14 },

  // Legend
  legendCard:  { backgroundColor: colors.card, marginHorizontal: 20, borderRadius: 14, padding: 16 },
  legendTitle: { fontSize: 12, fontWeight: '700', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  legendRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:   { width: 10, height: 10, borderRadius: 5 },
  legendText:  { fontSize: 13, color: colors.textSecondary },

  // FAB
  fab: { position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primaryRed, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primaryRed, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },

  // Add-event modal
  modalOverlay:  { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalSheet:    { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle:    { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  modalCloseBtn: { padding: 4 },
  fieldLabel:    { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6, marginTop: 14 },
  input:         { backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.textPrimary, borderWidth: 1, borderColor: colors.cardBorder },
  inputError:    { borderColor: colors.primaryRed, borderWidth: 1.5 },
  errorText:     { color: colors.primaryRed, fontSize: 13, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  typeRow:       { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typeChip:      { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  typeChipText:  { fontSize: 13, fontWeight: '600' },
  row:           { flexDirection: 'row' },
  addBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primaryRed, borderRadius: 14, paddingVertical: 15, marginTop: 24 },
  addBtnDisabled: { opacity: 0.5 },
  addBtnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },

  // UPF guide modal
  guideOverlay:      { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  guideSheet:        { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%' },
  guideHeader:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  guideTitle:        { fontSize: 16, fontWeight: '700', color: colors.textPrimary, flex: 1, marginRight: 10, lineHeight: 22 },
  guideCloseBtn:     { padding: 4, backgroundColor: colors.background, borderRadius: 16 },
  stepBlock:         { flexDirection: 'row', gap: 12, marginBottom: 18, alignItems: 'flex-start' },
  stepIndicator:     { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4, marginTop: 2 },
  stepIndicatorText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  stepBodyText:      { fontSize: 13.5, color: colors.textSecondary, flex: 1, lineHeight: 19 },
  boldText:          { fontWeight: '700', color: colors.textPrimary },
  guideActionBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#003B46', borderRadius: 14, paddingVertical: 15, marginTop: 15 },
  guideActionBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
