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
import { ArrowLeft, Compass, Info, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function MuseusGaleriesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const fallbackUrl = 'https://www.fundaciosunol.org/ca/activitats/';

  // Structured information completely extracted and translated from the museum data assets
  const museumsData = [
    {
      id: 'mnac',
      name: 'MNAC (Museu Nacional d\'Art de Catalunya)',
      benefits: [
        'Free entry for accredited teachers and student groups accompanied by instructors (prior reservation required).',
        'Free entry for accredited students completing research projects commissioned by corresponding departments.',
        'Free entry on Saturdays from 15:00 h onwards, the first Sunday of every month, as well as May 18th (International Museum Day).',
        '30% ticket price reduction presenting your UPF Card (€8.40 standard reduced fee).'
      ]
    },
    {
      id: 'fundacio-antoni-tapies',
      name: 'Fundació Antoni Tàpies',
      benefits: [
        'Standard general entrance: €8.',
        'Reduced admission tier rate: €6.40 available when presenting a valid Student Card, Library Card, or Carnet Jove.'
      ]
    },
    {
      id: 'fundacio-sunol',
      name: 'Fundació Suñol',
      benefits: [
        'Completely free general access to all active art exhibitions.',
        'Guided tours: €5 per person with prerequisite registration (limited structural capacity restrictions apply).',
        'Concerted group tours accompanied by professional staff guides: €80 flat configuration fee (available in English, Catalan, Spanish, and French).'
      ],
      url: 'https://www.fundaciosunol.org/ca/activitats/'
    },
    {
      id: 'fundacio-joan-miro',
      name: 'Fundació Joan Miró Barcelona',
      benefits: [
        'Standard box office purchase general entry: €15.',
        'Advance digital booking online promotional rate: €14.',
        'Reduced student admission fee (ages 15 to 30) and Library Card holders: €7.'
      ]
    },
    {
      id: 'macba',
      name: 'MACBA (Museu d\'Art Contemporani de Barcelona)',
      benefits: [
        'Completely free entrance granted immediately upon presenting your valid UPF Card at the counter.',
        'Standard regular general box office entry fee: €12.',
        'Standard digital ticket purchase online promotional rate: €10.80.'
      ]
    }
  ];

  const handleOpenLink = async (url?: string) => {
    const targetUrl = url || fallbackUrl;
    try {
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
      }
    } catch (error) {
      console.error('Error opening cultural partner link:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* SCREEN NAVBAR HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Museums & Galleries</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* TOP COMPLIANCE NOTE */}
        <View style={styles.noticeBox}>
          <Info size={16} color={colors.textSecondary} style={{ marginTop: 2 }} />
          <Text style={styles.noticeText}>
            Always remember to show your Digital Student Profile Card at the ticket booth to redeem these rates.
          </Text>
        </View>

        {/* LIST GENERATOR */}
        <View style={styles.museumsContainer}>
          {museumsData.map((museum) => (
            <View key={museum.id} style={styles.museumCard}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Compass size={18} color={colors.primaryRed} />
                </View>
                <Text style={styles.museumName}>{museum.name}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.benefitsList}>
                {museum.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>

              {museum.url && (
                <TouchableOpacity 
                  style={styles.linkButton} 
                  onPress={() => handleOpenLink(museum.url)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkButtonText}>View Foundation Activities</Text>
                  <ExternalLink size={14} color={colors.primaryRed} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
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
  noticeBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder || colors.separator,
    marginBottom: 20,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  museumsContainer: {
    gap: 16,
  },
  museumCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder || colors.separator,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  museumName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder || colors.separator,
    marginVertical: 12,
  },
  benefitsList: {
    gap: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.primaryRed,
    fontWeight: '700',
    marginTop: -2,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: colors.primaryRedLight,
    borderRadius: 10,
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryRed,
  },
});