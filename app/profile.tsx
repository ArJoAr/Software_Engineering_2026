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
        {[
          { icon: CreditCard, label: 'View Student ID Card', route: '/student-id' },
          { icon: Calendar, label: 'Academic Calendar', route: '/calendar' },
          { icon: Mail, label: 'Printer', route: '/printer' },
        ].map(({ icon: Icon, label, route }) => (
          <TouchableOpacity key={label} style={styles.linkRow} onPress={() => router.push(route as any)}>
            <View style={styles.linkIcon}>
              <Icon size={18} color={Colors.primaryRed} />
            </View>
          ) : (
            <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
              <Edit3 size={16} color="#fff" />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
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

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Links</Text>

          {quickLinks.map(({ icon: Icon, label, route }) => (
            <TouchableOpacity
              key={label}
              style={styles.linkRow}
              onPress={() => router.push(route as any)}
            >
              <View style={styles.linkIcon}>
                <Icon size={18} color={Colors.primaryRed} />
              </View>

              <Text style={styles.linkLabel}>{label}</Text>

              <ChevronRight size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color={Colors.primaryRed} />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    paddingBottom: 24,
  },

  loadingText: {
    marginTop: 80,
    textAlign: 'center',
    fontSize: 16,
    color: Colors.textSecondary,
  },

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

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  headerSpacer: {
    width: 36,
  },

  profileHero: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },

  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: Colors.primaryRed,
  },

  cameraButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
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

  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },

  fullName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },

  username: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },

  nameInput: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryRed,
    minWidth: 240,
    textAlign: 'center',
    marginBottom: 6,
    paddingVertical: 4,
  },

  usernameInput: {
    fontSize: 14,
    color: Colors.textSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
    minWidth: 180,
    textAlign: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },

  yearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryRedLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  yearPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryRed,
  },

  editBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryRed,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },

  editBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  editActions: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryRed,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },

  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryRedLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },

  cancelBtnText: {
    color: Colors.primaryRed,
    fontWeight: '700',
    fontSize: 14,
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },

  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },

  infoInput: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: Colors.separator,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.background,
  },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },

  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  linkLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },

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

  logoutText: {
    fontSize: 15,
    color: Colors.primaryRed,
    fontWeight: '600',
  },
});