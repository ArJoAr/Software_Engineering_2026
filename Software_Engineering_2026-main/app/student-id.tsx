import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Wifi, Share2 } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

function QRPlaceholder() {
  return (
    <View style={styles.qrBox}>
      <View style={styles.qrInner}>
        {Array.from({ length: 6 }).map((_, row) => (
          <View key={row} style={styles.qrRow}>
            {Array.from({ length: 6 }).map((_, col) => (
              <View
                key={col}
                style={[
                  styles.qrCell,
                  (row + col) % 2 === 0 ? styles.qrCellDark : styles.qrCellLight,
                  (row === 0 || row === 5) && (col === 0 || col === 5) ? styles.qrCorner : null,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      <Text style={styles.qrLabel}>Scan to verify</Text>
    </View>
  );
}

export default function StudentIdScreen() {
  const router = useRouter();
  const { student } = useAuth();

  const currentYear = new Date().getFullYear();
  const expiry = `${currentYear}/${currentYear + 1}`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student ID</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Share2 size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.bodySubtitle}>Digital Student Card</Text>
        <Text style={styles.bodyNote}>
          Present this card at campus services, libraries, and partner institutions.
        </Text>

        <View style={styles.idCard}>
          <View style={styles.idCardHeader}>
            <View style={styles.idLogoBox}>
              <Text style={styles.idLogoText}>UPF</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.idUniversity}>Universitat Pompeu Fabra</Text>
              <Text style={styles.idCardType}>STUDENT CARD · {expiry}</Text>
            </View>
            <View style={styles.nfcIcon}>
              <Wifi size={16} color="rgba(255,255,255,0.6)" />
            </View>
          </View>

          <View style={styles.idCardBody}>
            <Image source={{ uri: student?.photoUrl }} style={styles.idPhoto} />
            <View style={styles.idInfo}>
              <Text style={styles.idName}>{student?.fullName}</Text>
              <Text style={styles.idRole}>{student?.role}</Text>
              <Text style={styles.idDegree} numberOfLines={2}>{student?.degree}</Text>
              <Text style={styles.idFaculty} numberOfLines={1}>{student?.faculty}</Text>
            </View>
          </View>

          <View style={styles.idCardDivider} />

          <View style={styles.idCardFooter}>
            <View style={styles.idDetail}>
              <Text style={styles.idDetailLabel}>ID Number</Text>
              <Text style={styles.idDetailValue}>{student?.studentIdNumber}</Text>
            </View>
            <View style={styles.idDetailSep} />
            <View style={styles.idDetail}>
              <Text style={styles.idDetailLabel}>Username</Text>
              <Text style={styles.idDetailValue}>{student?.username}</Text>
            </View>
            <View style={styles.idDetailSep} />
            <View style={styles.idDetail}>
              <Text style={styles.idDetailLabel}>Year</Text>
              <Text style={styles.idDetailValue}>{student?.year}</Text>
            </View>
          </View>

          <View style={styles.stripBar}>
            <View style={[styles.strip, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
            <View style={[styles.strip, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />
          </View>
        </View>

        <View style={styles.qrSection}>
          <QRPlaceholder />
          <Text style={styles.qrNote}>
            This QR code is unique to your account and updates every 30 seconds.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Services included</Text>
          {[
            'Campus library access (all campuses)',
            'Public transport discount card',
            'UPF sports facilities',
            'Partner museum & cultural access',
            'UPF Benefits program',
            'International student recognition (ISIC)',
          ].map((s) => (
            <View key={s} style={styles.infoItem}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
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

  body: { padding: 20 },
  bodySubtitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  bodyNote: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 24 },

  idCard: {
    borderRadius: 20,
    backgroundColor: Colors.primaryRed,
    overflow: 'hidden',
    shadowColor: Colors.primaryRed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 24,
  },
  idCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 18,
    paddingBottom: 14,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  idLogoBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  idLogoText: { fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  idUniversity: { fontSize: 13, fontWeight: '700', color: '#fff' },
  idCardType: { fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2, letterSpacing: 0.5, fontWeight: '600' },
  nfcIcon: { opacity: 0.7 },

  idCardBody: { flexDirection: 'row', gap: 14, padding: 18, alignItems: 'flex-start' },
  idPhoto: {
    width: 80,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  idInfo: { flex: 1, paddingTop: 4 },
  idName: { fontSize: 15, fontWeight: '800', color: '#fff', marginBottom: 3 },
  idRole: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '700', letterSpacing: 0.7, marginBottom: 8, textTransform: 'uppercase' },
  idDegree: { fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 16, marginBottom: 4 },
  idFaculty: { fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 15 },

  idCardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 18 },
  idCardFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 0,
  },
  idDetail: { flex: 1, alignItems: 'center' },
  idDetailLabel: { fontSize: 9, color: 'rgba(255,255,255,0.55)', fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 3 },
  idDetailValue: { fontSize: 13, color: '#fff', fontWeight: '700' },
  idDetailSep: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },
  stripBar: { height: 8, flexDirection: 'row' },
  strip: { flex: 1 },

  qrSection: { alignItems: 'center', marginBottom: 24 },
  qrBox: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 12,
  },
  qrInner: { gap: 2, marginBottom: 10 },
  qrRow: { flexDirection: 'row', gap: 2 },
  qrCell: { width: 18, height: 18, borderRadius: 2 },
  qrCellDark: { backgroundColor: Colors.textPrimary },
  qrCellLight: { backgroundColor: Colors.cardBorder },
  qrCorner: { borderRadius: 4, borderWidth: 2, borderColor: Colors.primaryRed },
  qrLabel: { fontSize: 12, color: Colors.textTertiary, fontWeight: '600' },
  qrNote: { fontSize: 12, color: Colors.textTertiary, textAlign: 'center', lineHeight: 17, paddingHorizontal: 20 },

  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 14,
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 },
  infoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primaryRed, flexShrink: 0 },
  infoText: { fontSize: 14, color: Colors.textPrimary },
});
