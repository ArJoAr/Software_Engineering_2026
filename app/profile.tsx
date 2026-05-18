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
        } else if (student) {
          setProfileData(student);
          setBackupData(student);
        }
      } catch (error) {
        console.error('Failed to load profile data from storage', error);
      }
    };
    loadProfile();
  }, [student]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleEdit = () => {
    setBackupData(profileData ? { ...profileData } : null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfileData(backupData ? { ...backupData } : null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!profileData) return;
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile changes');
    }
  };

  const pickImage = async () => {
    if (!isEditing) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to change your avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateField('avatarUrl', result.assets[0].uri);
    }
  };

  const updateField = (field: keyof Student, value: string) => {
    if (!profileData) return;
    setProfileData({
      ...profileData,
      [field]: value,
    });
  };

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* ─── HEADER ─── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <TouchableOpacity 
            activeOpacity={isEditing ? 0.7 : 1} 
            onPress={pickImage} 
            style={{ position: 'relative' }}
          >
            <Image
              source={{
                uri: profileData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
              }}
              style={styles.avatar}
            />
            {isEditing && (
              <View style={styles.cameraOverlay}>
                <Camera size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profileData.name}</Text>
            <Text style={styles.nia}>NIA: {profileData.nia}</Text>
          </View>
        </View>
      </View>

      {/* ─── FORMULARIO / DETALLES DE ACADEMIA ─── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Academic Information</Text>

        {/* Campo Email */}
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Mail size={16} color={Colors.primaryRed} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Institutional Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(val) => updateField('email', val)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.email}</Text>
            )}
          </View>
        </View>

        {/* Campo Grado */}
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <GraduationCap size={16} color={Colors.primaryRed} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Degree / Program</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profileData.degree}
                onChangeText={(val) => updateField('degree', val)}
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.degree}</Text>
            )}
          </View>
        </View>

        {/* Campo Facultad */}
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Building size={16} color={Colors.primaryRed} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Faculty</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profileData.faculty}
                onChangeText={(val) => updateField('faculty', val)}
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.faculty}</Text>
            )}
          </View>
        </View>

        {/* Campo Campus */}
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <MapPin size={16} color={Colors.primaryRed} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Campus Location</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profileData.campus}
                onChangeText={(val) => updateField('campus', val)}
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.campus}</Text>
            )}
          </View>
        </View>
      </View>

      {/* ─── TARJETA DE QUICK LINKS ─── */}
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
              <Icon size={18} color={Colors.primaryRed} />
            </View>
            <Text style={styles.linkLabel}>{label}</Text>
            <ChevronRight size={16} color="#999" />
          </TouchableOpacity>
        ))}

        {/* Botonera dinámica de Edición */}
        {isEditing ? (
          <View style={styles.editActionRow}>
            <TouchableOpacity style={[styles.editBtnHalf, styles.cancelBtn]} onPress={handleCancel}>
              <X size={16} color={Colors.primaryRed} />
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.editBtnHalf, styles.saveBtn]} onPress={handleSave}>
              <Save size={16} color="#fff" />
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
            <Edit3 size={16} color="#fff" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ─── BOTÓN DE CERRAR SESIÓN ─── */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color={Colors.primaryRed} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── ESTILOS ESTÁNDAR ───
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    backgroundColor: Colors.primaryRed,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  cameraOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 2 },
  nia: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eee' },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10 },
  infoIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#fff5f5', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 2 },
  infoValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  input: { borderBottomWidth: 1, borderBottomColor: Colors.primaryRed, paddingVertical: 2, fontSize: 14, color: '#333' },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  linkIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff5f5', alignItems: 'center', justifyContent: 'center' },
  linkLabel: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primaryRed, borderRadius: 12, paddingVertical: 12, marginTop: 14 },
  editBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  editActionRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  editBtnHalf: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 12 },
  cancelBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.primaryRed },
  cancelBtnText: { color: Colors.primaryRed, fontSize: 15, fontWeight: '600' },
  saveBtn: { backgroundColor: Colors.primaryRed },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, marginBottom: 32, borderRadius: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#eee' },
  logoutText: { color: Colors.primaryRed, fontSize: 15, fontWeight: '600' },
});
