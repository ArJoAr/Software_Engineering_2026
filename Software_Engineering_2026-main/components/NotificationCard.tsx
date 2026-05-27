import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BookOpen, CalendarDays, Megaphone } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import type { Notification } from '@/types';

interface Props {
  notification: Notification;
  onPress?: () => void;
}

const TYPE_CONFIG = {
  academic: {
    color: Colors.academic,
    bg: Colors.academicLight,
    icon: BookOpen,
    label: 'Academic',
  },
  events: {
    color: Colors.categoryColors.events,
    bg: Colors.categoryBg.events,
    icon: CalendarDays,
    label: 'Events',
  },
  announcements: {
    color: Colors.info,
    bg: Colors.infoLight,
    icon: Megaphone,
    label: 'Notice',
  },
};

export function NotificationCard({ notification, onPress }: Props) {
  const cfg = TYPE_CONFIG[notification.type];
  const IconComponent = cfg.icon;

  return (
    <TouchableOpacity
      style={[styles.card, !notification.isRead && styles.cardUnread]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
        <IconComponent size={18} color={cfg.color} />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.typeBadge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.typeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          <Text style={styles.time}>{notification.time}</Text>
        </View>
        <Text style={[styles.title, !notification.isRead && styles.titleUnread]}>
          {notification.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.date}>{notification.date}</Text>
      </View>
      {!notification.isRead && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 10,
  },
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primaryRed,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  typeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  time: { fontSize: 11, color: Colors.textTertiary },
  title: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 3 },
  titleUnread: { fontWeight: '700' },
  body: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 4 },
  date: { fontSize: 11, color: Colors.textTertiary },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryRed,
    flexShrink: 0,
    marginTop: 4,
  },
});
