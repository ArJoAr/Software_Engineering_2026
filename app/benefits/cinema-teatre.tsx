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
import { ArrowLeft, Film, Theater, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function CinemaTeatreScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const linksData = [
    {
      id: 'teatre-lliure',
      title: 'Teatre Lliure',
      description: 'Discounted tickets available for all theatre shows during the 2025-2026 season.',
      url: 'https://www.upf.edu/web/cultura/teatre-lliure1',
      type: 'theatre',
    },
    {
      id: 'teatre-poliorama',
      title: 'Teatre Poliorama',
      description: 'Special ticket promotions on regular performances running from March to June 2026.',
      url: 'https://www.upf.edu/web/cultura/teatre-poliorama',
      type: 'theatre',
    },
    {
      id: 'espai-texas',
      title: 'Espai Texas',
      description: 'Get a 25% discount on theatrical productions using the promo code TEXASUPF25. Present your UPF card at the venue.',
      url: 'https://espaitexas.cat/',
      type: 'cinema',
    },
    {
      id: 'zumzeig',
      title: 'Cinecooperativa Zumzeig',
      description: 'Exclusive ticket price reductions available at the box office for cooperative independent movie screenings.',
      url: 'https://www.upf.edu/web/cultura/zumzeig',
      type: 'cinema',
    },
    {
      id: 'akademia',
      title: 'Teatre Akadèmia',
      description: 'Special university community discounts applicable for regular season plays and artistic works.',
      url: 'https://www.upf.edu/web/cultura/akademia',
      type: 'theatre',
    },
  ];

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('An error occurred while opening link:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cinema & Theatre</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Exclusive access restricted to the UPF university community. Please make sure to bring your Digital Student Card to verify status at the venues.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {linksData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.cardButton}
              onPress={() => handleOpenLink(item.url)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {item.type === 'cinema' ? (
                  <Film size={20} color={colors.primaryRed} />
                ) : (
                  <Theater size={20} color={colors.primaryRed} />
                )}
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>

              <View style={styles.actionArea}>
                <ExternalLink size={16} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>
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
  banner: {
    backgroundColor: colors.primaryRedLight,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bannerText: {
    fontSize: 12,
    color: colors.primaryRed,
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  listContainer: {
    gap: 12,
  },
  cardButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder || colors.separator,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder || colors.separator,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
    paddingRight: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  actionArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
});