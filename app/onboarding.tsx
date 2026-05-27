import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';
import { ChevronDown, Check } from 'lucide-react-native';

const FACULTIES = [
  'Faculty of Communication',
  'Faculty of Law',
  'Faculty of Economics and Business',
  'Faculty of Health and Life Sciences',
  'Faculty of Humanities',
  'Faculty of Translation and Language Sciences',
  'Faculty of Political and Social Sciences',
  'Engineering School (DTIC)',
];

const DEGREES: Record<string, string[]> = {
  'Faculty of Communication': ['Audiovisual Communication', 'Journalism', 'Advertising and Public Relations'],
  'Faculty of Law': ['Law', 'Criminology', 'Labor Relations'],
  'Faculty of Economics and Business': ['Business Management', 'Economics', 'International Business'],
  'Faculty of Health and Life Sciences': ['Human Biology', 'Medicine'],
  'Faculty of Humanities': ['Humanities', 'Global Studies'],
  'Faculty of Translation and Language Sciences': ['Translation and Interpretation', 'Applied Languages'],
  'Faculty of Political and Social Sciences': ['Political Science', 'Sociology'],
  'Engineering School (DTIC)': ['Computer Science', 'Telecommunications', 'Biomedical Engineering', 'Data Science'],
};

export default function OnboardingScreen() {
  const { student, updateProfile } = useAuth();
  const router = useRouter();
  
  const [faculty, setFaculty] = useState('');
  const [degree, setDegree] = useState('');
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isDegreeModalOpen, setIsDegreeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTeacher = student?.role === 'TEACHER';

  const handleComplete = async () => {
    if (!faculty) return alert('Please select a faculty.');
    if (!isTeacher && !degree) return alert('Please select a degree.');

    setIsSubmitting(true);
    const result = await updateProfile({ faculty, degree: isTeacher ? '' : degree });
    setIsSubmitting(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      alert(result.error || 'Something went wrong.');
    }
  };

  const degreeOptions = faculty ? DEGREES[faculty] || [] : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to UPF Campus!</Text>
        <Text style={styles.headerSubtitle}>
          Let&apos;s complete your profile so we can personalize your experience.
        </Text>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Your Role</Text>
          <View style={styles.roleBox}>
            <Text style={styles.roleBoxText}>{isTeacher ? 'Teacher' : 'Student'}</Text>
          </View>
          <Text style={styles.helpText}>Automatically deduced from your email.</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Faculty / School</Text>
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => setIsFacultyModalOpen(true)}
          >
            <Text style={[styles.dropdownButtonText, !faculty && styles.placeholderText]}>
              {faculty || 'Select your faculty...'}
            </Text>
            <ChevronDown size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {!isTeacher && (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Degree / Career</Text>
            <TouchableOpacity 
              style={[styles.dropdownButton, !faculty && styles.disabledButton]} 
              onPress={() => {
                if (faculty) setIsDegreeModalOpen(true);
                else alert('Please select a faculty first.');
              }}
              activeOpacity={faculty ? 0.7 : 1}
            >
              <Text style={[styles.dropdownButtonText, !degree && styles.placeholderText]}>
                {degree || 'Select your degree...'}
              </Text>
              <ChevronDown size={20} color={faculty ? Colors.textTertiary : Colors.cardBorder} />
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.submitBtn, isSubmitting && styles.disabledButton]} 
          onPress={handleComplete}
          disabled={isSubmitting}
        >
          <Text style={styles.submitBtnText}>{isSubmitting ? 'Saving...' : 'Complete Profile'}</Text>
          <Check size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Faculty Modal */}
      <Modal visible={isFacultyModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Faculty</Text>
              <TouchableOpacity onPress={() => setIsFacultyModalOpen(false)}>
                <Text style={styles.closeBtn}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {FACULTIES.map((item) => (
                <TouchableOpacity 
                  key={item} 
                  style={styles.modalOption}
                  onPress={() => {
                    setFaculty(item);
                    setDegree(''); // Reset degree if faculty changes
                    setIsFacultyModalOpen(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, faculty === item && styles.modalOptionTextActive]}>
                    {item}
                  </Text>
                  {faculty === item && <Check size={20} color={Colors.primaryRed} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Degree Modal */}
      <Modal visible={isDegreeModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Degree</Text>
              <TouchableOpacity onPress={() => setIsDegreeModalOpen(false)}>
                <Text style={styles.closeBtn}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {degreeOptions.map((item) => (
                <TouchableOpacity 
                  key={item} 
                  style={styles.modalOption}
                  onPress={() => {
                    setDegree(item);
                    setIsDegreeModalOpen(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, degree === item && styles.modalOptionTextActive]}>
                    {item}
                  </Text>
                  {degree === item && <Check size={20} color={Colors.primaryRed} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: Colors.primaryRed,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  form: {
    flex: 1,
    padding: 24,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  helpText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 6,
  },
  roleBox: {
    backgroundColor: 'rgba(204, 0, 0, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(204, 0, 0, 0.15)',
  },
  roleBoxText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryRed,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  placeholderText: {
    color: Colors.textTertiary,
  },
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  submitBtn: {
    backgroundColor: Colors.primaryRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    fontSize: 16,
    color: Colors.primaryRed,
    fontWeight: '600',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  modalOptionTextActive: {
    fontWeight: '700',
    color: Colors.primaryRed,
  },
});
