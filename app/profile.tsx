import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, GraduationCap, Building, LogOut, ChevronRight, User, Moon, Gamepad2 } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { student, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const infoRows = [
    { icon: User, label: 'Student ID', value: student?.studentIdNumber },
    { icon: Mail, label: 'Institutional Email', value: student?.email },
    { icon: GraduationCap, label: 'Degree', value: student?.degree },
    { icon: Building, label: 'Faculty', value: student?.faculty },
  ];

  return (
    <ScrollView style={styles.container} bounces={false} contentContainerStyle={styles.content}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* HERO SECTOR (FOTO INSTITUCIONAL FIJA) */}
      <View style={styles.profileHero}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: student?.avatarUrl }} style={styles.avatar} />
        </View>
        <Text style={styles.fullName}>{student?.email?.split('@')[0] || 'Student'}</Text>
        <Text style={styles.username}>ID: {student?.studentIdNumber || 'N/A'}</Text>
      </View>

      {/* BANNER ACCESO ACCESORIO MONSTRUO 3D (SECCIÓN APARTE GAMING) */}
      <TouchableOpacity 
        style={[styles.gamingCard, { backgroundColor: colors.primaryRedLight, borderColor: colors.primaryRed }]}
        onPress={() => router.push('/avatar')}
        activeOpacity={0.9}
      >
        <View style={[styles.gamingIconWrapper, { backgroundColor: colors.primaryRed }]}>
          <Gamepad2 size={22} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.gamingTitle, { color: colors.primaryRed }]}>Monster Studio 3D</Text>
          <Text style={[styles.gamingSubtitle, { color: colors.textSecondary }]}>Customize your game avatar outfit</Text>
        </View>
        <ChevronRight size={20} color={colors.primaryRed} />
      </TouchableOpacity>

      {/* ACADEMIC INFORMATION */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Academic Information</Text>
        {infoRows.map(({ icon: Icon, label, value }) => (
          <View key={label} style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon size={16} color={colors.primaryRed} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value || 'Not Provided'}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* PREFERENCES */}
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

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
        <LogOut size={18} color={colors.primaryRed} />
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 24 },
  header: { backgroundColor: colors.primaryRed, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  profileHero: { alignItems: 'center', paddingVertical: 20 },
  avatarWrapper: { marginBottom: 10 },
  avatar: { width: 84, height: 84, borderRadius: 42, borderWidth: 2, borderColor: colors.cardBorder },
  fullName: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  username: { fontSize: 13, color: colors.textSecondary },
  
  gamingCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 16, padding: 14, borderRadius: 16, borderWidth: 1, gap: 12 },
  gamingIconWrapper: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyCentered: 'center', justifyContent: 'center' },
  gamingTitle: { fontSize: 15, fontWeight: '700' },
  gamingSubtitle: { fontSize: 12, marginTop: 2 },

  card: { backgroundColor: colors.card, borderRadius: 16, marginHorizontal: 20, marginBottom: 16, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontSize: 12, fontWeight: '700', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.separator },
  infoIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primaryRedLight, alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 10, color: colors.textTertiary, fontWeight: '600' },
  infoValue: { fontSize: 14, color: colors.textPrimary },
  preferenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  linkIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryRedLight, alignItems: 'center', justifyContent: 'center' },
  linkLabel: { fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, paddingVertical: 14, backgroundColor: colors.card, borderRadius: 14, borderWidth: 1.5, borderColor: colors.primaryRedLight },
  logoutText: { fontSize: 15, color: colors.primaryRed, fontWeight: '600' },
});