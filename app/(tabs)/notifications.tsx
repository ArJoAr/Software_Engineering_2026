import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, CalendarDays, BookOpen, Megaphone } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { MOCK_NOTIFICATIONS } from '@/constants/mockData';
import { NotificationCard } from '@/components/NotificationCard';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'academic', label: 'Academic' },
  { key: 'events', label: 'Events' },
  { key: 'announcements', label: 'Notices' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

export default function NotificationsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const filtered =
    filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSub}>{unreadCount} unread</Text>
          )}
        </View>
        <View style={styles.headerRight}>
          <View style={styles.bellWrapper}>
            <Bell size={22} color="#fff" />
            {unreadCount > 0 && <View style={styles.bellBadge}><Text style={styles.bellBadgeText}>{unreadCount}</Text></View>}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterChip, filter === key && styles.filterChipActive]}
            onPress={() => setFilter(key)}
          >
            <Text style={[styles.filterChipText, filter === key && styles.filterChipTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.body}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Bell size={40} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>"No notifications"</Text>
            <Text style={styles.emptyText}>"You're all caught up!"</Text>
          </View>
        ) : (
          filtered.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onPress={
                n.relatedEventId
                  ? () => router.push(`/event/${n.relatedEventId}` as any)
                  : undefined
              }
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: Colors.primaryRed,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellWrapper: { position: 'relative' },
  bellBadge: {
    position: 'absolute', top: -4, right: -6,
    backgroundColor: '#FFD700', width: 16, height: 16,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  bellBadgeText: { fontSize: 9, fontWeight: '800', color: Colors.primaryRedDark },
  markAllBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  markAllText: { fontSize: 12, color: '#fff', fontWeight: '600' },

  filterBar: { backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.separator },
  filterContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.cardBorder,
  },
  filterChipActive: { backgroundColor: Colors.primaryRed, borderColor: Colors.primaryRed },
  filterChipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterChipTextActive: { color: '#fff' },

  body: { padding: 16 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  emptyText: { fontSize: 14, color: Colors.textTertiary },
});
