import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, MapPin, Ticket, Info, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function IbercameraScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const purchaseUrl = 'https://ibercamera.koobin.com/?referer=YGdgYHBicHxzUWppcGR6c3lrcWpKZHx0cXxmeUonIQ%3D%3D';

  const handleOpenLink = async () => {
    try {
      const supported = await Linking.canOpenURL(purchaseUrl);
      if (supported) {
        await Linking.openURL(purchaseUrl);
      }
    } catch (error) {
      console.error('Error launching ticketing platform:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ibercamera Concerts</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.badgeRow}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>100 SEATS AVAILABLE</Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeText}>FROM €20</Text>
            </View>
          </View>
          <Text style={styles.concertTitle}>Mahler's First Symphony</Text>
          <Text style={styles.concertSubtitle}>Special reduced prices for the UPF Community</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.metaRow}>
            <Calendar size={18} color={colors.primaryRed} />
            <View>
              <Text style={styles.metaLabel}>Date & Time</Text>
              <Text style={styles.metaValue}>May 18, 2026 at 20:00 h</Text>
            </View>
          </View>

          <View style={styles.metaSeparator} />

          <View style={styles.metaRow}>
            <MapPin size={18} color={colors.primaryRed} />
            <View>
              <Text style={styles.metaLabel}>Venue & Locations</Text>
              <Text style={styles.metaValue}>L'Auditori (Zones 1, 2, 3, 4 & 5)</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Performers & Artists</Text>
          <View style={styles.infoBlock}>
            <Text style={styles.bodyTextBold}>Orchestra:</Text>
            <Text style={styles.bodyText}>Gürzenich-Orchester Köln (Cologne Opera Orchestra)</Text>
            <View style={{ height: 8 }} />
            <Text style={styles.bodyTextBold}>Soprano:</Text>
            <Text style={styles.bodyText}>Christiane Karg</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Repertoire</Text>
          <View style={styles.infoBlock}>
            <Text style={styles.repertoireItem}>• Gustav Mahler: Symphony No. 1</Text>
            <Text style={styles.repertoireItem}>• Richard Strauss: Final Scene from Capriccio</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Pricing Breakdown</Text>
          <View style={styles.pricingCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceZone}>Zone 1 Premium Seats</Text>
              <Text style={styles.priceValue}>€30</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.priceZone}>Zones 2, 3, 4 & 5 Seats</Text>
              <Text style={styles.priceValue}>€20</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.conditionsHeader}>
            <Info size={16} color={colors.textSecondary} />
            <Text style={styles.conditionsTitle}>Terms & Conditions</Text>
          </View>
          <View style={styles.conditionsBlock}>
            <Text style={styles.conditionItem}>• Promotion exclusively open to the UPF university community.</Text>
            <Text style={styles.conditionItem}>• Minimum purchase configuration requirement of 2 tickets per order.</Text>
            <Text style={styles.conditionItem}>• Strict cap allocation maximum of 100 reduced price seats available.</Text>
            <Text style={styles.conditionItem}>• You must present your physical or Digital UPF Student Card at the venue doors upon entrance.</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={handleOpenLink} activeOpacity={0.8}>
          <Ticket size={20} color="#fff" />
          <Text style={styles.ctaButtonText}>Purchase Promotional Tickets</Text>
          <ExternalLink size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: colors.cardBorder || colors.separator,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder || colors.separator,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  promoBadge: {
    backgroundColor: colors.primaryRed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  promoBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  priceBadge: {
    backgroundColor: '#003b46',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  concertTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 30,
  },
  concertSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder || colors.separator,
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 1,
  },
  metaSeparator: {
    height: 1,
    backgroundColor: colors.cardBorder || colors.separator,
    marginVertical: 12,
  },
  section: {
    marginBottom: 22,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  infoBlock: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder || colors.separator,
  },
  bodyTextBold: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bodyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 2,
  },
  repertoireItem: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
    lineHeight: 22,
  },
  pricingCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder || colors.separator,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  priceZone: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryRed,
  },
  priceDivider: {
    height: 1,
    backgroundColor: colors.cardBorder || colors.separator,
  },
  conditionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  conditionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  conditionsBlock: {
    gap: 8,
    paddingHorizontal: 4,
  },
  conditionItem: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: colors.primaryRed,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});