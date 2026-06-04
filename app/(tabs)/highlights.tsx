import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Film, 
  Music, 
  Compass, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function HighlightsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const benefitButtons = [
    {
      id: 'cinema-teatre',
      title: 'Cinema & Theatre',
      subtitle: 'Restricted access for the university community',
      icon: Film,
      route: '/benefits/cinema-teatre',
    },
    {
      id: 'ibercamara',
      title: 'Ibercamara Concert Cycle',
      subtitle: 'Exclusive student discounts and tickets',
      icon: Music,
      route: '/benefits/ibercamara',
    },
    {
      id: 'museus',
      title: 'Museums & Galleries',
      subtitle: 'Cultural access and exhibitions',
      icon: Compass,
      route: '/benefits/museus-galeries',
    },
    {
      id: 'club-upf',
      title: 'Club UPF Advantages',
      subtitle: 'Full portal of student promotions',
      icon: Sparkles,
      route: '/benefits/club-avantatges',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Highlights</Text>
        <Text style={styles.headerSub}>UPF Benefits & Services</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuContainer}>
          {benefitButtons.map((btn) => {
            const IconComponent = btn.icon;
            return (
              <TouchableOpacity
                key={btn.id}
                style={styles.menuButton}
                onPress={() => router.push(btn.route as any)}
                activeOpacity={0.7}
              >
                <View style={styles.iconWrapper}>
                  <IconComponent size={20} color={colors.primaryRed} />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.buttonTitle}>{btn.title}</Text>
                  <Text style={styles.buttonSubtitle} numberOfLines={2}>
                    {btn.subtitle}
                  </Text>
                </View>

                <ChevronRight size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            );
          })}
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
    backgroundColor: colors.primaryRed,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
  },
  menuContainer: {
    gap: 12,
  },
  menuButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder || colors.separator,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    gap: 2,
    paddingRight: 8,
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  buttonSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});