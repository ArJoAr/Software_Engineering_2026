import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MapPin, Clock, Bookmark, Users } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import type { CampusEvent } from '@/types';

interface Props {
  event: CampusEvent;
  onPress: () => void;
  compact?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  events: 'Event',
  academic: 'Academic',
  sports: 'Sports',
  culture: 'Culture',
  announcements: 'Notice',
  conference: 'Conference',
};

export function EventCard({ event, onPress, compact }: Props) {
  const [bookmarked, setBookmarked] = useState(event.isFavorited ?? false);
  const catColor = Colors.categoryColors[event.category] ?? Colors.primaryRed;
  const catBg = Colors.categoryBg[event.category] ?? Colors.primaryRedLight;
  const label = CATEGORY_LABELS[event.category] ?? event.category;

  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {event.imageUrl && !compact && (
        <Image source={{ uri: event.imageUrl }} style={styles.image} />
      )}
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.categoryBadge, { backgroundColor: catBg }]}>
            <Text style={[styles.categoryText, { color: catColor }]}>{label}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setBookmarked(!bookmarked)}
            style={styles.bookmarkBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Bookmark
              size={16}
              color={bookmarked ? Colors.primaryRed : Colors.textTertiary}
              fill={bookmarked ? Colors.primaryRed : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.mainRow}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateDay}>{day}</Text>
            <Text style={styles.dateMonth}>{month}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {event.title}
            </Text>
            <View style={styles.metaRow}>
              <Clock size={11} color={Colors.textTertiary} />
              <Text style={styles.metaText}>{event.time}{event.endTime ? ` – ${event.endTime}` : ''}</Text>
            </View>
            <View style={styles.metaRow}>
              <MapPin size={11} color={Colors.textTertiary} />
              <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
            </View>
            {event.attendees !== undefined && (
              <View style={styles.metaRow}>
                <Users size={11} color={Colors.textTertiary} />
                <Text style={styles.metaText}>
                  {event.attendees}{event.capacity ? `/${event.capacity}` : ''} attending
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  image: { width: '100%', height: 150 },
  body: { padding: 14 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  bookmarkBtn: { padding: 2 },
  mainRow: { flexDirection: 'row', gap: 12 },
  dateBadge: {
    width: 44,
    height: 52,
    backgroundColor: Colors.primaryRedLight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: { fontSize: 18, fontWeight: '800', color: Colors.primaryRed, lineHeight: 22 },
  dateMonth: { fontSize: 10, fontWeight: '700', color: Colors.primaryRed, letterSpacing: 0.5 },
  info: { flex: 1, gap: 3 },
  title: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4, lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.textSecondary, flex: 1 },
});
