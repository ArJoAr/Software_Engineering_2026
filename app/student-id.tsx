import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function StudentIdScreen() {
  const router = useRouter();
  const { student } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  // Generamos el código QR dinámico usando la API basada en el ID/username del estudiante
  const qrUrl = useMemo(() => {
    const id = student?.studentIdNumber || 'u232107';
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${id}&color=003b46&qzone=1`;
  }, [student?.studentIdNumber]);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER LIMPIO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Student ID</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* CONTENEDOR CENTRAL (SÓLO EL CARNET) */}
      <View style={styles.centerWrapper}>
        <View style={styles.idCard}>
          
          {/* FRANJA SUPERIOR CORPORATIVA UPF */}
          <View style={styles.cardHeader}>
            <View style={styles.upfLogoBadge}>
              <Text style={styles.upfLogoText}>UPF</Text>
            </View>
            <View>
              <Text style={styles.universityName}>Universitat Pompeu Fabra</Text>
              <Text style={styles.universitySub}>STUDENT CARD</Text>
            </View>
          </View>

          {/* CUERPO DEL CARNET */}
          <View style={styles.cardBody}>
            <View style={styles.metaRow}>
              {/* IMAGEN DE PERFIL */}
              {student?.photoUrl ? (
                <Image source={{ uri: student.photoUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>
                    {student?.firstName?.[0]?.toUpperCase() || 'A'}
                  </Text>
                </View>
              )}

              {/* DETALLES DEL ALUMNO */}
              <View style={styles.infoDetails}>
                <Text style={styles.studentName} numberOfLines={2}>
                  {student?.fullName || 'Ainara Etxeberria'}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{student?.role || 'STUDENT'}</Text>
                </View>
                <Text style={styles.degreeText} numberOfLines={1}>
                  {student?.degree || 'Data Science'}
                </Text>
              </View>
            </View>

            {/* SEPARADOR SEGURO */}
            <View style={styles.divider} />

            {/* CÓDIGO QR REAL Y USUARIO */}
            <View style={styles.qrSection}>
              <View style={styles.qrFrame}>
                <Image source={{ uri: qrUrl }} style={styles.qrImage} />
              </View>
              
              <Text style={styles.userIdNumber}>
                Username: {student?.studentIdNumber || 'u232107'}
              </Text>
            </View>
          </View>

          {/* PIE DE VERIFICACIÓN */}
          <View style={styles.cardFooter}>
            <ShieldCheck size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.footerText}>Official Campus ID</Text>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: typeof Colors) => StyleSheet.create({
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
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  idCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    backgroundColor: '#c91424', // Color corporativo oficial de la UPF
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  upfLogoBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  upfLogoText: {
    color: '#c91424',
    fontWeight: '900',
    fontSize: 14,
  },
  universityName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  universitySub: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 24,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#c91424',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primaryRed,
  },
  avatarPlaceholderText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryRed,
  },
  infoDetails: {
    flex: 1,
    gap: 3,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.primaryRedLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryRed,
    letterSpacing: 0.3,
  },
  degreeText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: 20,
    borderStyle: 'dashed',
  },
  qrSection: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  qrFrame: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  qrImage: {
    width: 145,
    height: 145,
  },
  userIdNumber: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.textTertiary,
    fontWeight: '700',
  },
  cardFooter: {
    backgroundColor: '#003b46', // Cierre en contraste estético y seguro
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '600',
  },
});