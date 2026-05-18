import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Mail,
  GraduationCap,
  Building,
  Calendar,
  CreditCard,
  LogOut,
  ChevronRight,
  MapPin,
  User,
  Moon,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { student, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const infoRows = [
    { icon: User, label: 'Student ID', value: student?.studentIdNumber },
    { icon: Mail, label: 'Institutional Email', value: student?.email },
    { icon: GraduationCap, label: 'Degree', value: student?.degree },
    { icon: Building, label: 'Faculty', value: student?.faculty },
    { icon: Calendar, label: 'Year', value: `Year ${student?.year}` },
    { icon: MapPin, label: 'Campus', value: student?.campus },
    { icon: Calendar, label: 'Enrolled Since', value: student?.enrollmentDate },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.profileHero}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: student?.photoUrl }} style={styles.avatar} />
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>STUDENT</Text>
          </View>
        </View>
        <Text style={styles.fullName}>{student?.fullName}</Text>
        <Text style={styles.username}>@{student?.username}</Text>
        <View style={styles.yearPill}>
          <GraduationCap size={13} color={colors.primaryRed} />
          <Text style={styles.yearPillText}>Year {student?.year} · {student?.degree?.split(' ').slice(0, 3).join(' ')}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Academic Information</Text>
        {infoRows.map(({ icon: Icon, label, value }) => (
          <View key={label} style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon size={16} color={colors.primaryRed} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferences</Text>
        <View style={styles.preferenceRow}>
          <View style={styles.linkIcon}>
            <Moon size={18} color={colors.primaryRed} />
          </View>
          <Text style={styles.linkLabel}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.cardBorder, true: colors.primaryRed }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Links</Text>
        {[
          { icon: CreditCard, label: 'View Student ID Card', route: '/student-id' },
          { icon: Calendar, label: 'Academic Calendar', route: '/calendar' },
          { icon: Mail, label: 'Printer', route: '/printer' },
        ].map(({ icon: Icon, label, route }) => (
          <TouchableOpacity key={label} style={styles.linkRow} onPress={() => router.push(route as any)}>
            <View style={styles.linkIcon}>
              <Icon size={18} color={colors.primaryRed} />
            </View>
            <Text style={styles.linkLabel}>{label}</Text>
            <ChevronRight size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <LogOut size={18} color={colors.primaryRed} />
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const makeStyles = (colors: typeof Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 24 },
  header: {
    backgroundColor: colors.primaryRed,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },

  profileHero: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20 },
  avatarWrapper: { position: 'relative', marginBottom: 14 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: colors.primaryRed,
  },
  roleBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.primaryRed,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.background,
  },
  roleBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  fullName: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  username: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  yearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryRedLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  yearPillText: { fontSize: 12, fontWeight: '600', color: colors.primaryRed },

  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 14,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.separator },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 2 },
  infoValue: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },

  preferenceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: { flex: 1, fontSize: 15, color: colors.textPrimary, fontWeight: '500' },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 4,
    paddingVertical: 14,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primaryRedLight,
  },
  logoutText: { fontSize: 15, color: colors.primaryRed, fontWeight: '600' },
});
