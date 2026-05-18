import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Star, Tag, Percent, ExternalLink, Ticket } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { MOCK_EVENTS } from '@/constants/mockData';

const BENEFITS = [
  {
    id: 'b1',
    title: '25% off at Fnac',
    description: 'Show your UPF student card at any Fnac store in Spain to get 25% off books and stationery.',
    category: 'Shopping',
    imageUrl: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=600',
    highlight: '25% OFF',
  },
  {
    id: 'b2',
    title: 'Free museum access – MACBA',
    description: 'UPF students get free entry to MACBA Museum of Contemporary Art Barcelona year-round.',
    category: 'Culture',
    imageUrl: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=600',
    highlight: 'FREE',
  },
  {
    id: 'b3',
    title: 'T-Jove transport card subsidy',
    description: 'Up to 50% subsidy on public transport with the T-Jove student card. Apply at the Students Office.',
    category: 'Transport',
    imageUrl: 'https://images.pexels.com/photos/3893735/pexels-photo-3893735.jpeg?auto=compress&cs=tinysrgb&w=600',
    highlight: '50% OFF',
  },
  {
    id: 'b4',
    title: 'GitHub Student Developer Pack',
    description: 'Access to over 100 premium developer tools and services for free through GitHub Education.',
    category: 'Technology',
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600',
    highlight: 'FREE',
  },
  {
    id: 'b5',
    title: 'Spotify Student Plan – 3 months free',
    description: 'Get 3 months of Spotify Premium for free when you verify your student status.',
    category: 'Entertainment',
    imageUrl: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=600',
    highlight: '3 MONTHS FREE',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Shopping: Colors.categoryColors.events,
  Culture: Colors.categoryColors.culture,
  Transport: Colors.info,
  Technology: Colors.academic,
  Entertainment: Colors.success,
};

const CATEGORIES = ['All', 'Shopping', 'Culture', 'Transport', 'Technology', 'Entertainment'];

export default function HighlightsScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const savedEvents = MOCK_EVENTS.filter((e) => e.isFavorited);

  const filteredBenefits = activeCategory === 'All'
    ? BENEFITS
    : BENEFITS.filter((b) => b.category === activeCategory);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Star size={20} color="#fff" fill="rgba(255,255,255,0.5)" />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Highlights</Text>
          <Text style={styles.headerSub}>Benefits & saved events</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Tag size={16} color={Colors.primaryRed} />
          <Text style={styles.sectionTitle}>UPF Benefits</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filteredBenefits.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No benefits in this category.</Text>
          </View>
        )}

        {filteredBenefits.map((benefit) => {
          const color = CATEGORY_COLORS[benefit.category] ?? Colors.primaryRed;
          return (
            <TouchableOpacity key={benefit.id} style={styles.benefitCard} activeOpacity={0.8}>

              <Image source={{ uri: benefit.imageUrl }} style={styles.benefitImage} />
              <View style={styles.benefitBody}>
                <View style={styles.benefitTopRow}>
                  <View style={[styles.benefitCatPill, { backgroundColor: color + '18' }]}>
                    <Text style={[styles.benefitCatText, { color }]}>{benefit.category}</Text>
                  </View>
                  <View style={[styles.discountPill, { backgroundColor: Colors.primaryRed }]}>
                    <Percent size={10} color="#fff" />
                    <Text style={styles.discountText}>{benefit.highlight}</Text>
                  </View>
                </View>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDesc} numberOfLines={2}>{benefit.description}</Text>
                <View style={styles.benefitFooter}>
                  <Text style={styles.learnMore}>Learn more</Text>
                  <ExternalLink size={13} color={Colors.primaryRed} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ticket size={16} color={Colors.primaryRed} />
          <Text style={styles.sectionTitle}>Saved Events</Text>
        </View>
        {savedEvents.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No saved events yet. Bookmark events from Campus Life.</Text>
          </View>
        ) : (
          savedEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.savedEventCard}
              onPress={() => router.push(`/event/${event.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={styles.savedEventDate}>
                <Text style={styles.savedEventDay}>{new Date(event.date).getDate()}</Text>
                <Text style={styles.savedEventMonth}>
                  {new Date(event.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                </Text>
              </View>
              <View style={styles.savedEventInfo}>
                <Text style={styles.savedEventTitle} numberOfLines={1}>{event.title}</Text>
                <Text style={styles.savedEventMeta} numberOfLines={1}>{event.location}</Text>
              </View>
              <Star size={16} color={Colors.primaryRed} fill={Colors.primaryRed} />
            </TouchableOpacity>
          ))
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
    gap: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  section: { padding: 20, paddingBottom: 0 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },

  benefitCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitImage: { width: '100%', height: 130 },
  benefitBody: { padding: 14 },
  benefitTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  benefitCatPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  benefitCatText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  discountPill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  discountText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  benefitTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  benefitDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  benefitFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  learnMore: { fontSize: 13, fontWeight: '600', color: Colors.primaryRed },

  filterScroll: { marginBottom: 14 },
  filterRow: { gap: 8, paddingRight: 4 },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  filterPillActive: {
    backgroundColor: Colors.primaryRed,
    borderColor: Colors.primaryRed,
  },
  filterPillText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterPillTextActive: { color: '#fff' },

  empty: { backgroundColor: Colors.card, borderRadius: 14, padding: 20, alignItems: 'center', marginBottom: 14 },
  emptyText: { fontSize: 13, color: Colors.textTertiary, textAlign: 'center', lineHeight: 19 },

  savedEventCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  savedEventDate: {
    width: 44,
    height: 52,
    backgroundColor: Colors.primaryRedLight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedEventDay: { fontSize: 18, fontWeight: '800', color: Colors.primaryRed, lineHeight: 22 },
  savedEventMonth: { fontSize: 10, fontWeight: '700', color: Colors.primaryRed, letterSpacing: 0.5 },
  savedEventInfo: { flex: 1 },
  savedEventTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  savedEventMeta: { fontSize: 12, color: Colors.textSecondary },
});
