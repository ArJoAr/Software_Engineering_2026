import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
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
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { student, logout } = useAuth();

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
          <GraduationCap size={13} color={Colors.primaryRed} />
          <Text style={styles.yearPillText}>Year {student?.year} · {student?.degree?.split(' ').slice(0, 3).join(' ')}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Academic Information</Text>
        {infoRows.map(({ icon: Icon, label, value }) => (
          <View key={label} style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon size={16} color={Colors.primaryRed} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Links</Text>
        {[
          { icon: CreditCard, label: 'View Student ID Card', route: '/student-id' },
          { icon: Calendar, label: 'Academic Calendar', route: '/calendar' },
        ].map(({ icon: Icon, label, route }) => (
          <TouchableOpacity key={label} style={styles.linkRow} onPress={() => router.push(route as any)}>
            <View style={styles.linkIcon}>
              <Icon size={18} color={Colors.primaryRed} />
            </View>
            <Text style={styles.linkLabel}>{label}</Text>
            <ChevronRight size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <LogOut size={18} color={Colors.primaryRed} />
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
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
    borderColor: Colors.primaryRed,
  },
  roleBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.primaryRed,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  roleBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  fullName: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  username: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  yearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryRedLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  yearPillText: { fontSize: 12, fontWeight: '600', color: Colors.primaryRed },

  card: {
    backgroundColor: Colors.card,
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
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 14,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.separator },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: Colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 2 },
  infoValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },

  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 4,
    paddingVertical: 14,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primaryRedLight,
  },
  logoutText: { fontSize: 15, color: Colors.primaryRed, fontWeight: '600' },
});
