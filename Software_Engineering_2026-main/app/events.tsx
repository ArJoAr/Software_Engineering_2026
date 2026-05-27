import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { MOCK_EVENTS } from '@/constants/mockData';
import { EventCard } from '@/components/EventCard';
import type { EventCategory } from '@/types';

const CATEGORIES: { key: EventCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'events', label: 'Events' },
  { key: 'sports', label: 'Sports' },
  { key: 'academic', label: 'Academic' },
  { key: 'culture', label: 'Culture' },
  { key: 'conference', label: 'Conference' },
  { key: 'announcements', label: 'Notice' },
];

export default function EventsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<EventCategory | 'all'>('all');

  const filtered =
    selected === 'all'
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter((e) => e.category === selected);

  const upcoming = filtered.filter((e) => new Date(e.date) >= new Date('2025-04-14'));
  const past = filtered.filter((e) => new Date(e.date) < new Date('2025-04-14'));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Campus Life</Text>
          <Text style={styles.headerSub}>Events & Activities</Text>
        </View>
        <TouchableOpacity style={styles.backBtn}>
          <SlidersHorizontal size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {[
          { label: 'Upcoming', value: MOCK_EVENTS.filter((e) => new Date(e.date) >= new Date('2025-04-14')).length },
          { label: 'Joined', value: MOCK_EVENTS.filter((e) => e.isJoined).length },
          { label: 'Saved', value: MOCK_EVENTS.filter((e) => e.isFavorited).length },
        ].map(({ label, value }) => (
          <View key={label} style={styles.statBox}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterContent}
      >
        {CATEGORIES.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterChip, selected === key && styles.filterChipActive]}
            onPress={() => setSelected(key)}
          >
            <Text style={[styles.filterChipText, selected === key && styles.filterChipTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.section}>
        {upcoming.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            {upcoming.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push(`/event/${event.id}` as any)}
              />
            ))}
          </>
        )}

        {past.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Past Events</Text>
            {past.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push(`/event/${event.id}` as any)}
              />
            ))}
          </>
        )}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptyText}>Try a different filter to discover more events.</Text>
          </View>
        )}
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryRedDark,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
    gap: 0,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: 2 },

  filterBar: { backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.separator },
  filterContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryRed,
    borderColor: Colors.primaryRed,
  },
  filterChipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterChipTextActive: { color: '#fff' },

  section: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },

  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  emptyText: { fontSize: 14, color: Colors.textTertiary, textAlign: 'center' },
});
