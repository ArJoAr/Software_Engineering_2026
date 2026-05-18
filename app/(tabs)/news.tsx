import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ExternalLink, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_NEWS } from '@/constants/mockData';

function NewsCard({ item, colors }: { item: (typeof MOCK_NEWS)[0]; colors: typeof Colors }) {
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const dateObj = new Date(item.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.newsCard} activeOpacity={0.8}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.newsImage} />
      )}
      <View style={styles.newsBody}>
        <View style={styles.newsTopRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={styles.dateRow}>
            <Clock size={11} color={colors.textTertiary} />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsSummary} numberOfLines={3}>{item.summary}</Text>
        <View style={styles.sourceRow}>
          <Text style={styles.source}>{item.source}</Text>
          <ExternalLink size={13} color={colors.primaryRed} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NewsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>University News</Text>
        <Text style={styles.headerSub}>Latest from UPF</Text>
      </View>

      <View style={styles.featuredSection}>
        <Text style={styles.sectionLabel}>Featured</Text>
        <NewsCard item={MOCK_NEWS[0]} colors={colors} />
      </View>

      <View style={styles.listSection}>
        <Text style={styles.sectionLabel}>Recent News</Text>
        {MOCK_NEWS.slice(1).map((item) => (
          <NewsCard key={item.id} item={item} colors={colors} />
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.loadMore}>
          <Text style={styles.loadMoreText}>Load more news</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const makeStyles = (colors: typeof Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: colors.primaryRed,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 3 },

  featuredSection: { padding: 20, paddingBottom: 0 },
  listSection: { padding: 20, paddingBottom: 0 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  newsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  newsImage: { width: '100%', height: 180 },
  newsBody: { padding: 14 },
  newsTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  categoryPill: {
    backgroundColor: colors.primaryRedLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  categoryText: { fontSize: 11, fontWeight: '700', color: colors.primaryRed, textTransform: 'uppercase', letterSpacing: 0.4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 12, color: colors.textTertiary },
  newsTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 6, lineHeight: 21 },
  newsSummary: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 12 },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  source: { fontSize: 12, fontWeight: '600', color: colors.primaryRed },

  footer: { padding: 20 },
  loadMore: {
    backgroundColor: colors.card,
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  loadMoreText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
});
