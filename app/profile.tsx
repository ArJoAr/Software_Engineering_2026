import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Switch,
  TextInput,
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
  Moon,
  Edit2,
  Check,
  Camera,
  Sparkles,
} from 'lucide-react-native';

import * as ImagePicker from 'expo-image-picker';


import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

// ─── IMPORTACIONES DE AVATAR (Ajusta la ruta si tu carpeta es diferente, ej: '../avatar/base_robot.png') ───
const RobotBaseImg = require('./avatar/base_robot.png');
const GhostBaseImg = require('./avatar/base_ghost.png');
const MonsterBaseImg = require('./avatar/base_monster.png');

const GorraUpfRobotImg = require('./avatar/gorra_upf_robot.png');
const GorraUpfGhostImg = require('./avatar/gorra_upf_ghost.png');
const GorraUpfMonsterImg = require('./avatar/gorra_upf_monster.png');

const CascosRobotImg = require('./avatar/cascos_robot.png');
const CuchilloGhostImg = require('./avatar/cuchillo_ghost.png');
const CuernosMonsterImg = require('./avatar/cuernos_monster.png');

const HeartRobotImg = require('./avatar/heart_robot.png');
const HeartGhostImg = require('./avatar/heart_ghost.png');
const HeartMonsterImg = require('./avatar/heart_monster.png');

export default function ProfileScreen() {
  const router = useRouter();
  const { student, logout, updateProfile } = useAuth();
  
  // Mantenemos el sistema de temas dinámico de la rama MAIN
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    email: student?.email || '',
    degree: student?.degree || '',
    faculty: student?.faculty || ''
  });

  useEffect(() => {
    if (student) {
      setEditData({
        email: student.email || '',
        degree: student.degree || '',
        faculty: student.faculty || ''
      });
    }
  }, [student]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      updateProfile({ photoUrl: result.assets[0].uri });
    }
  };

  // ─── LÓGICA DE RENDERIZADO DEL AVATAR (Traída de tu branch) ───
  const avatarStyle = (student?.monster3D?.style as string) || 'robot';
  const avatarAccessory = (student?.monster3D?.accessory as string) || 'none';
  const avatarPin = (student?.monster3D?.pin as string) || 'none';

  const getBaseImage = () => {
    if (avatarStyle === 'ghost') return GhostBaseImg;
    if (avatarStyle === 'monster') return MonsterBaseImg;
    return RobotBaseImg;
  };

  const getAccessoryImage = () => {
    if (avatarAccessory === 'gorra_upf') {
      if (avatarStyle === 'ghost') return GorraUpfGhostImg;
      if (avatarStyle === 'monster') return GorraUpfMonsterImg;
      return GorraUpfRobotImg;
    }
    if (avatarAccessory === 'cascos' && avatarStyle === 'robot') return CascosRobotImg;
    if (avatarAccessory === 'cuchillo' && avatarStyle === 'ghost') return CuchilloGhostImg;
    if (avatarAccessory === 'cuernos' && avatarStyle === 'monster') return CuernosMonsterImg;
    return null;
  };

  const getPinImage = () => {
    if (avatarPin === 'heart') {
      if (avatarStyle === 'ghost') return HeartGhostImg;
      if (avatarStyle === 'monster') return HeartMonsterImg;
      return HeartRobotImg;
    }
    return null;
  };

  const infoRows = [
    { icon: User, label: 'Student ID', value: student?.studentIdNumber },
    { icon: Mail, label: 'Institutional Email', value: student?.email },
    ...(student?.role !== 'TEACHER' ? [{ icon: GraduationCap, label: 'Degree', value: student?.degree }] : []),
    { icon: Building, label: 'Faculty', value: student?.faculty },
  ];

  return (
    <ScrollView style={styles.container} bounces={false} contentContainerStyle={styles.content}>
      {/* ─── HEADER (Estilo Main) ─── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{student?.role === 'TEACHER' ? 'Teacher Profile' : 'Student Profile'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={async () => {
          if (isEditing) {
            const res = await updateProfile(editData);
            if (res && !res.success) {
              alert(res.error);
            } else {
              setIsEditing(false);
            }
          } else {
            setIsEditing(true);
          }
        }}>
          {isEditing ? <Check size={20} color="#fff" /> : <Edit2 size={20} color="#fff" />}
        </TouchableOpacity>
      </View>

      {/* ─── HERO PROFILE CON DOBLE AVATAR (Merge Features) ─── */}
      <View style={styles.profileHero}>
        {/* ─── CONTENEDOR UNIFICADO: HERO PROFILE CON DOS AVATARES ─── */}
<View style={styles.avatarsRow}>
  
  {/* 1. CÍRCULO: FOTO DE PERFIL REAL (Con diseño mejorado de Main) */}
  <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickImage} activeOpacity={0.85}>
    {student?.photoUrl ? (
      <Image source={{ uri: student.photoUrl }} style={styles.avatar} />
    ) : (
      <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 36, color: '#fff', fontWeight: 'bold' }}>
          {student?.firstName?.[0]?.toUpperCase() || 'U'}
        </Text>
      </View>
    )}
    {/* Insignia de cámara con la posición fija exacta de Main */}
    <View style={{ position: 'absolute', bottom: -5, left: 10, backgroundColor: colors.primaryRed, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.background, zIndex: 10 }}>
      <Camera size={14} color="#fff" />
    </View>
    <View style={styles.roleBadge}>
      <Text style={styles.roleBadgeText}>{student?.role || 'STUDENT'}</Text>
    </View>
  </TouchableOpacity>

  {/* 2. CÍRCULO: AVATAR 3D INTERACTIVO (Tu Feature Branch adaptada al inglés) */}
  <TouchableOpacity 
    style={styles.avatarWrapper} 
    onPress={() => router.push('/avatar')} 
    activeOpacity={0.85}
  >
    <View style={[styles.avatar, styles.miniCanvas]}>
      <Image source={getBaseImage()} style={styles.miniLayer} resizeMode="contain" />
      {selectedAccessory !== 'none' && getAccessoryImage() && (
        <Image source={getAccessoryImage()} style={styles.miniLayer} resizeMode="contain" />
      )}
      {selectedPin !== 'none' && getPinImage() && (
        <Image source={getPinImage()} style={styles.miniLayer} resizeMode="contain" />
      )}
    </View>
    {/* Insignia de chispas en posición absoluta simétrica a la de Main */}
    <View style={{ position: 'absolute', bottom: -5, left: 10, backgroundColor: '#000', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.background, zIndex: 10 }}>
      <Sparkles size={14} color="#fff" />
    </View>
    <View style={[styles.roleBadge, { backgroundColor: '#000' }]}>
      <Text style={styles.roleBadgeText}>STUDIO 3D</Text>
    </View>
  </TouchableOpacity>

</View>

        <Text style={styles.fullName}>{student?.fullName || 'User'}</Text>
        <Text style={styles.username}>ID: {student?.studentIdNumber || 'N/A'}</Text>
        
        {student?.role !== 'TEACHER' && (
          <View style={styles.yearPill}>
            <GraduationCap size={13} color={colors.primaryRed} />
            <Text style={styles.yearPillText}>{student?.degree || 'Academic Program'}</Text>
          </View>
        )}
      </View>

      {/* ─── INFORMACIÓN ACADÉMICA ─── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Academic Information</Text>
        {isEditing ? (
          <View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}><Mail size={16} color={colors.primaryRed} /></View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Institutional Email</Text>
                <TextInput style={styles.editInput} value={editData.email} onChangeText={t => setEditData({...editData, email: t})} />
              </View>
            </View>
            {student?.role !== 'TEACHER' && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}><GraduationCap size={16} color={colors.primaryRed} /></View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Degree</Text>
                  <TextInput style={styles.editInput} value={editData.degree} onChangeText={t => setEditData({...editData, degree: t})} />
                </View>
              </View>
            )}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}><Building size={16} color={colors.primaryRed} /></View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Faculty</Text>
                <TextInput style={styles.editInput} value={editData.faculty} onChangeText={t => setEditData({...editData, faculty: t})} />
              </View>
            </View>
          </View>
        ) : (
          infoRows.map(({ icon: Icon, label, value }) => (
            <View key={label} style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon size={16} color={colors.primaryRed} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value || 'Not Provided'}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* ─── PREFERENCIAS ─── */}
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

      {/* ─── ENLACES RÁPIDOS ─── */}
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

      {/* ─── CERRAR SESIÓN ─── */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <LogOut size={18} color={colors.primaryRed} />
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── HOJAS DE ESTILO DINÁMICAS (Main) ───
const makeStyles = (colors: any) => StyleSheet.create({
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
  
  // 🆕 Contenedor para alinear los dos avatares juntos
  avatarsRow: { 
    flexDirection: 'row', 
    gap: 24, 
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 88,  // Reducido un pelín (de 96 a 88) para que quepan ambos perfectos
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.primaryRed,
  },
  
  // 🆕 Estilos del lienzo miniatura para el Avatar 3D
  miniCanvas: {
    backgroundColor: '#F4F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Importante para que las partes grandes del PNG no se salgan de la bola
    borderColor: '#000' // Borde negro para diferenciarlo de la foto real
  },
  miniLayer: {
    position: 'absolute',
    width: '180%',
    height: '180%',
  },

  iconBadge: {
    position: 'absolute', 
    bottom: -5, 
    left: 4, 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 2, 
    borderColor: colors.background, 
    zIndex: 10
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
    zIndex: 10
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
  editInput: { fontSize: 14, color: colors.textPrimary, fontWeight: '500', borderBottomWidth: 1, borderBottomColor: colors.primaryRedLight, paddingVertical: 2, paddingHorizontal: 4 },

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