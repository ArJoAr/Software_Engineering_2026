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
import { ArrowLeft, Sparkles, ShieldCheck, Percent, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function ClubAvantatgesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const activationUrl = 'https://www.colectivosvip.com/upf/activate-account-input.action';

  const handleOpenLink = async () => {
    try {
      const supported = await Linking.canOpenURL(activationUrl);
      if (supported) {
        await Linking.openURL(activationUrl);
      }
    } catch (error) {
      console.error('Error opening account activation portal:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Club UPF Advantages</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HERO ICON PROFILE */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Sparkles size={32} color={colors.primaryRed} />
          </View>
          <Text style={styles.mainTitle}>Exclusive Student Discounts</Text>
          <Text style={styles.mainSubtitle}>
            Access hundreds of national brand discounts, cashback rewards, and customized technology deals tailored for Pompeu Fabra University members.
          </Text>
        </View>

        {/* KEY HIGHLIGHTS PERKS */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Percent size={20} color={colors.primaryRed} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Premium Brands</Text>
              <Text style={styles.featureDescription}>
                Special pricing on electronics, travel, fashion, clothing stores, gym memberships, and restaurant networks.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <ShieldCheck size={20} color={colors.primaryRed} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Free Registration</Text>
              <Text style={styles.featureDescription}>
                This platform is fully covered by the university. There are no registration forms, setup charges, or monthly hidden fees.
              </Text>
            </View>
          </View>
        </View>

        {/* INSTRUCTIONS NOTICE BOX */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionHeading}>How to claim your account</Text>
          <Text style={styles.instructionStep}>
            1. Tap the activation trigger button located at the bottom of the page.
          </Text>
          <Text style={styles.instructionStep}>
            2. Enter your university identification details using your official student credentials.
          </Text>
          <Text style={styles.instructionStep}>
            3. Finalize your profile configurations to unlock online discount vouchers and shopping tracking.
          </Text>
        </View>

        {/* ACTIVATION CTA BUTTON */}
        <TouchableOpacity style={styles.ctaButton} onPress={handleOpenLink} activeOpacity={0.8}>
          <Text style={styles.ctaButtonText}>Activate Your Savings Profile</Text>
          <ExternalLink size={16} color="#fff" />
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
    padding: 24,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  mainSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  featuresContainer: {
    gap: 14,
    marginBottom: 28,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder || colors.separator,
  },
  featureTextContainer: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  featureDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  instructionCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primaryRed,
    marginBottom: 28,
  },
  instructionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  instructionStep: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  ctaButton: {
    backgroundColor: colors.primaryRed,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});