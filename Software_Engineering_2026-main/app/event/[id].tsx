import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Clock, Calendar, Users, Bookmark, Share2, CircleCheck as CheckCircle, Tag, User } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { MOCK_EVENTS } from '@/constants/mockData';

const CATEGORY_LABELS: Record<string, string> = {
  events: 'Event',
  academic: 'Academic',
  sports: 'Sports',
  culture: 'Culture',
  announcements: 'Announcement',
  conference: 'Conference',
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const event = MOCK_EVENTS.find((e) => e.id === id);

  const [bookmarked, setBookmarked] = useState(event?.isFavorited ?? false);
  const [joined, setJoined] = useState(event?.isJoined ?? false);

  if (!event) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Event not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const catColor = Colors.categoryColors[event.category] ?? Colors.primaryRed;
  const catBg = Colors.categoryBg[event.category] ?? Colors.primaryRedLight;
  const label = CATEGORY_LABELS[event.category] ?? event.category;

  const dateObj = new Date(event.date);
  const fullDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const spotsLeft = event.capacity && event.attendees ? event.capacity - event.attendees : null;
  const fillPercent = event.capacity && event.attendees ? (event.attendees / event.capacity) * 100 : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroContainer}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroFallback, { backgroundColor: catColor }]} />
        )}
        <View style={styles.heroOverlay} />
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.heroBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroRight}>
            <TouchableOpacity style={styles.heroBtn} onPress={() => setBookmarked(!bookmarked)}>
              <Bookmark
                size={18}
                color="#fff"
                fill={bookmarked ? '#fff' : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBtn}>
              <Share2 size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.heroBadge}>
          <View style={[styles.categoryChip, { backgroundColor: catBg }]}>
            <Text style={[styles.categoryChipText, { color: catColor }]}>{label}</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.organizer}>
          Organized by <Text style={styles.organizerBold}>{event.organizer}</Text>
        </Text>

        <View style={styles.detailCard}>
          {[
            { icon: Calendar, label: 'Date', value: fullDate },
            { icon: Clock, label: 'Time', value: `${event.time}${event.endTime ? ` – ${event.endTime}` : ''}` },
            { icon: MapPin, label: 'Location', value: event.location },
            event.attendees !== undefined
              ? { icon: Users, label: 'Attendance', value: `${event.attendees}${event.capacity ? `/${event.capacity}` : ''} registered` }
              : null,
          ]
            .filter(Boolean)
            .map(({ icon: Icon, label: lbl, value }: any) => (
              <View key={lbl} style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Icon size={16} color={Colors.primaryRed} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>{lbl}</Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </View>
              </View>
            ))}
        </View>

        {event.capacity && event.attendees !== undefined && (
          <View style={styles.capacityCard}>
            <View style={styles.capacityHeader}>
              <Text style={styles.capacityTitle}>Capacity</Text>
              {spotsLeft !== null && (
                <Text style={styles.spotsLeft}>
                  {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
                </Text>
              )}
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(fillPercent, 100)}%`, backgroundColor: fillPercent > 85 ? Colors.warning : Colors.success }]} />
            </View>
            <Text style={styles.attendeeText}>
              {event.attendees} of {event.capacity} people registered
            </Text>
          </View>
        )}

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>About this event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {event.tags && event.tags.length > 0 && (
          <View style={styles.tagsSection}>
            <View style={styles.tagsRow}>
              <Tag size={14} color={Colors.textTertiary} />
              <Text style={styles.tagsLabel}>Tags</Text>
            </View>
            <View style={styles.tagsList}>
              {event.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.organizerCard}>
          <View style={styles.orgIcon}>
            <User size={20} color={Colors.primaryRed} />
          </View>
          <View style={styles.orgContent}>
            <Text style={styles.orgName}>{event.organizer}</Text>
            <Text style={styles.orgRole}>UPF Student Organization</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.joinBtn, joined && styles.joinBtnActive]}
            onPress={() => setJoined(!joined)}
            activeOpacity={0.85}
          >
            {joined && <CheckCircle size={18} color="#fff" />}
            <Text style={styles.joinBtnText}>
              {joined ? 'Registered' : 'Register for Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  notFoundText: { fontSize: 16, color: Colors.textSecondary },
  backLink: { color: Colors.primaryRed, fontSize: 15, fontWeight: '600' },

  heroContainer: { height: 280, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroFallback: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroActions: {
    position: 'absolute',
    top: 56,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroRight: { flexDirection: 'row', gap: 8 },
  heroBadge: { position: 'absolute', bottom: 16, left: 20 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  categoryChipText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  body: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6, lineHeight: 28 },
  organizer: { fontSize: 13, color: Colors.textSecondary, marginBottom: 20 },
  organizerBold: { fontWeight: '700', color: Colors.textPrimary },

  detailCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.separator },
  detailIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: Colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  detailContent: { flex: 1, justifyContent: 'center' },
  detailLabel: { fontSize: 11, color: Colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 1 },
  detailValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },

  capacityCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  capacityHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  capacityTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  spotsLeft: { fontSize: 13, fontWeight: '600', color: Colors.success },
  progressBar: { height: 8, backgroundColor: Colors.background, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  attendeeText: { fontSize: 12, color: Colors.textTertiary },

  descriptionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  descriptionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  tagsSection: { marginBottom: 14 },
  tagsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  tagsLabel: { fontSize: 13, color: Colors.textTertiary, fontWeight: '600' },
  tagsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  organizerCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  orgIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgContent: { flex: 1 },
  orgName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  orgRole: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },

  actionRow: { gap: 12 },
  joinBtn: {
    backgroundColor: Colors.primaryRed,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: Colors.primaryRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  joinBtnActive: { backgroundColor: Colors.success },
  joinBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
