import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
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
  Camera,
  Edit3,
  Save,
  X,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import type { Student } from '@/types';

const PROFILE_STORAGE_KEY = '@upf_profile_data';

export default function ProfileScreen() {
  const router = useRouter();
  const { student, logout } = useAuth();

  const [profileData, setProfileData] = useState<Student | null>(student);
  const [backupData, setBackupData] = useState<Student | null>(student);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);

        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfileData(parsedProfile);
          setBackupData(parsedProfile);
        } else {
          setProfileData(student);
          setBackupData(student);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        setProfileData(student);
        setBackupData(student);
      }
    };

    loadProfile();
  }, [student]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleInputChange = (field: keyof Student, value: string) => {
    if (!profileData) return;

    setProfileData({
      ...profileData,
      [field]: field === 'year' ? Number(value) : value,
    });
  };

  const handleEdit = () => {
    setBackupData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfileData(backupData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!profileData) return;

    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      setBackupData(profileData);
      setIsEditing(false);
      Alert.alert('Profile updated', 'Your profile information has been saved.');
    } catch (error) {
      Alert.alert('Error', 'Could not save profile changes.');
    }
  };

  const handleChangePhoto = async () => {
    if (!profileData) return;

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'You need to allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileData({
        ...profileData,
        photoUrl: result.assets[0].uri,
      });
    }
  };

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const infoRows = [
    {
      icon: User,
      label: 'Student ID',
      field: 'studentIdNumber' as keyof Student,
      value: profileData.studentIdNumber,
    },
    {
      icon: Mail,
      label: 'Institutional Email',
      field: 'email' as keyof Student,
      value: profileData.email,
    },
    {
      icon: GraduationCap,
      label: 'Degree',
      field: 'degree' as keyof Student,
      value: profileData.degree,
    },
    {
      icon: Building,
      label: 'Faculty',
      field: 'faculty' as keyof Student,
      value: profileData.faculty,
    },
    {
      icon: Calendar,
      label: 'Year',
      field: 'year' as keyof Student,
      value: profileData.year.toString(),
    },
    {
      icon: MapPin,
      label: 'Campus',
      field: 'campus' as keyof Student,
      value: profileData.campus,
    },
    {
      icon: Calendar,
      label: 'Enrolled Since',
      field: 'enrollmentDate' as keyof Student,
      value: profileData.enrollmentDate,
    },
  ];

  const quickLinks = [
    {
      icon: CreditCard,
      label: 'View Student ID Card',
      route: '/student-id',
    },
    {
      icon: Calendar,
      label: 'Academic Calendar',
      route: '/calendar',
    },
    {
      icon: Mail,
      label: 'Printer',
      route: '/printer',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.profileHero}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity
              activeOpacity={isEditing ? 0.8 : 1}
              onPress={isEditing ? handleChangePhoto : undefined}
            >
              <Image source={{ uri: profileData.photoUrl }} style={styles.avatar} />

              {isEditing && (
                <View style={styles.cameraButton}>
                  <Camera size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{profileData.role.toUpperCase()}</Text>
            </View>
          </View>

          {isEditing ? (
            <>
              <TextInput
                style={styles.nameInput}
                value={profileData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
                placeholder="Full name"
                placeholderTextColor={Colors.textTertiary}
              />

              <TextInput
                style={styles.usernameInput}
                value={profileData.username}
                onChangeText={(text) => handleInputChange('username', text)}
                placeholder="Username"
                placeholderTextColor={Colors.textTertiary}
                autoCapitalize="none"
              />
            </>
          ) : (
            <>
              <Text style={styles.fullName}>{profileData.fullName}</Text>
              <Text style={styles.username}>@{profileData.username}</Text>
            </>
          )}

          <View style={styles.yearPill}>
            <GraduationCap size={14} color={Colors.primaryRed} />
            <Text style={styles.yearPillText}>
              Year {profileData.year} · {profileData.degree?.split(' ').slice(0, 3).join(' ')}
            </Text>
          </View>

          {isEditing ? (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Save size={16} color="#fff" />
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <X size={16} color={Colors.primaryRed} />
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Links</Text>
        
        {/* Mapeo de enlaces rápidos corregido y cerrado correctamente */}
        {[
          { icon: CreditCard, label: 'View Student ID Card', route: '/student-id' },
          { icon: Calendar, label: 'Academic Calendar', route: '/calendar' },
          { icon: Mail, label: 'Printer', route: '/printer' },
        ].map(({ icon: Icon, label, route }) => (
          <TouchableOpacity 
            key={label} 
            style={styles.linkRow} 
            onPress={() => router.push(route as any)}
          >
            <View style={styles.linkIcon}>
              <Icon size={18} color={colors.primaryRed} />
            </View>
            <Text style={styles.linkLabel}>{label}</Text>
            <ChevronRight size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        ))} {/* <-- Cierre correcto del bucle .map() */}

        {/* Botón de edición independiente y perfectamente alineado en JSX */}
        <TouchableOpacity style={styles.editBtn} onPress={() => {/* Aquí tu lógica de edición o handleEdit */}}>
          <User size={16} color="#fff" />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Academic Information</Text>

          {infoRows.map(({ icon: Icon, label, field, value }) => (
            <View key={label} style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon size={16} color={Colors.primaryRed} />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>

                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={value}
                    onChangeText={(text) => handleInputChange(field, text)}
                    keyboardType={field === 'year' ? 'numeric' : 'default'}
                    placeholder={label}
                    placeholderTextColor={Colors.textTertiary}
                  />
                ) : (
                  <Text style={styles.infoValue}>
                    {field === 'year' ? `Year ${value}` : value}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
{/* ─── TARJETA DE QUICK LINKS (CORREGIDA) ─── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Links</Text>
        
        {[
          { icon: CreditCard, label: 'View Student ID Card', route: '/student-id' },
          { icon: Calendar, label: 'Academic Calendar', route: '/calendar' },
          { icon: Mail, label: 'Printer', route: '/printer' },
        ].map(({ icon: Icon, label, route }) => (
          <TouchableOpacity 
            key={label} 
            style={styles.linkRow} 
            onPress={() => router.push(route as any)}
          >
            <View style={styles.linkIcon}>
              <Icon size={18} color={colors.primaryRed} />
            </View>
            <Text style={styles.linkLabel}>{label}</Text>
            <ChevronRight size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.editBtn} onPress={() => {}}>
          <User size={16} color="#fff" />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* ─── BOTÓN DE CERRAR SESIÓN ─── */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color={colors.primaryRed} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── ESTILOS (Asegúrate de que cierren bien al final del documento) ───
const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.primaryRed,
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
    card: { backgroundColor: colors.card, marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.cardBorder },
    cardTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 14 },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.separator },
    infoIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primaryRedLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 2 },
    infoValue: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
    preferenceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
    linkIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryRedLight, alignItems: 'center', justifyContent: 'center' },
    linkLabel: { flex: 1, fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
    editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primaryRed, borderRadius: 12, paddingVertical: 12, marginTop: 14 },
    editBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.card, marginHorizontal: 16, marginTop: 16, marginBottom: 32, borderRadius: 16, paddingVertical: 14, borderWidth: 1, borderColor: colors.cardBorder },
    logoutText: { color: colors.primaryRed, fontSize: 15, fontWeight: '600' },
  });
