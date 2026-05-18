import React, { useMemo } from 'react';
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
  User,
} from 'lucide-react-native';

import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { student, logout } = useAuth();
  
  // Usamos los colores estándar del proyecto
  const colors = Colors;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Mapeo exacto de los campos que SÍ existen en vuestro tipo 'Student'
  const infoRows = [
    { icon: User, label: 'Student ID', value: student?.studentIdNumber },
    { icon: Mail, label: 'Institutional Email', value: student?.email },
    { icon: GraduationCap, label: 'Degree', value: student?.degree },
    { icon: Building, label: 'Faculty', value: student?.faculty },
  ];

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* ─── HEADER ─── */}
      <View style={[styles.header, { backgroundColor: colors.primaryRed }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            {/* Usamos los campos seguros que vuestro contexto provee */}
            <Text style={styles.name}>{student?.email?.split('@')[0] || 'Student'}</Text>
            <Text style={styles.nia}>ID: {student?.studentIdNumber || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* ─── INFORMACIÓN ACADÉMICA ─── */}
      <View style={[styles.card, { backgroundColor: '#fff', borderColor: '#eee' }]}>
        <Text style={[styles.cardTitle, { color: '#666' }]}>Academic Information</Text>
        
        {infoRows.map((row, index) => {
          const Icon = row.icon;
          return (
            <View key={index} style={[styles.infoRow, { borderColor: '#f5f5f5' }]}>
              <View style={[styles.infoIcon, { backgroundColor: '#fff5f5' }]}>
                <Icon size={16} color={colors.primaryRed} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: '#999' }]}>{row.label}</Text>
                <Text style={[styles.infoValue, { color: '#333' }]}>{row.value || 'Not Provided'}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* ─── ENLACES RÁPIDOS ─── */}
      <View style={[styles.card, { backgroundColor: '#fff', borderColor: '#eee' }]}>
        <Text style={[styles.cardTitle, { color: '#666' }]}>Quick Links</Text>
        
        {[
          { icon: CreditCard, label: 'View Student ID Card', route: '/student-id' },
          { icon: Calendar, label: 'Academic Calendar', route: '/calendar' },
          { icon: Mail, label: 'Printer', route: '/printer' },
        ].map(({ icon: Icon, label, route }) => (
          <TouchableOpacity 
            key={label} 
            style={[styles.linkRow, { borderBottomColor: '#f5f5f5' }]} 
            onPress={() => router.push(route as any)}
          >
            <View style={[styles.linkIcon, { backgroundColor: '#fff5f5' }]}>
              <Icon size={18} color={colors.primaryRed} />
            </View>
            <Text style={[styles.linkLabel, { color: '#333' }]}>{label}</Text>
            <ChevronRight size={16} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* ─── CERRAR SESIÓN ─── */}
      <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: '#fff', borderColor: '#eee' }]} onPress={handleLogout}>
        <LogOut size={18} color={colors.primaryRed} />
        <Text style={[styles.logoutText, { color: colors.primaryRed }]}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── HOJA DE ESTILOS LIMPIA Y OPTIMIZADA ───
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  name: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 2 },
  nia: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  card: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16, borderWidth: 1 },
  cardTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
  infoIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '500' },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  linkIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  linkLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 16, marginBottom: 32, borderRadius: 16, paddingVertical: 14, borderWidth: 1 },
  logoutText: { fontSize: 15, fontWeight: '600' },
});
