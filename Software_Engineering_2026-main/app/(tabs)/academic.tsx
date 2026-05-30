import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  BookOpen,
  Globe,
  Library,
  FileText,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  ClipboardList,
  Award,
  Users,
  Clock,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

const ACADEMIC_TOOLS = [
  { id: 'campus', icon: Globe, label: 'Campus Global', desc: 'Enrollment, grades, records', color: Colors.categoryColors.conference },
  { id: 'aula', icon: BookOpen, label: 'Aula Global', desc: 'Course materials & assignments', color: Colors.academic },
  { id: 'library', icon: Library, label: 'Library Account', desc: 'Books, journals, reservations', color: Colors.success },
  { id: 'agenda', icon: ClipboardList, label: 'Study Agenda', desc: 'Tasks, deadlines, notes', color: Colors.categoryColors.culture },
  { id: 'grades', icon: TrendingUp, label: 'My Grades', desc: 'Academic transcript', color: Colors.info },
  { id: 'certificates', icon: Award, label: 'Certificates', desc: 'Request official documents', color: Colors.warning },
  { id: 'tutoring', icon: Users, label: 'Academic Tutoring', desc: 'Book an advisor session', color: Colors.categoryColors.events },
  { id: 'exams', icon: FileText, label: 'Exam Enrollment', desc: 'Register for final exams', color: Colors.primaryRed },
];

const COURSES = [
  { name: 'Media Theory', code: 'COM23401', professor: 'Dr. Montserrat Figueras', schedule: 'Mon/Wed 10:00–12:00', room: '52.S31', grade: 7.8 },
  { name: 'Cultural Studies', code: 'COM23302', professor: 'Dr. Rafael Subirachs', schedule: 'Tue/Thu 15:00–17:00', room: '52.S12', grade: 8.4 },
  { name: 'Video Production', code: 'COM22201', professor: 'Marta Puigdomènech', schedule: 'Tue 12:00–14:00', room: 'Studio B', grade: null },
  { name: 'Audiovisual Narratives', code: 'COM24101', professor: 'Dr. Jordi Maluquer', schedule: 'Wed 09:00–11:00', room: '24.012', grade: null },
];

export default function AcademicScreen() {
  const { student } = useAuth();

  const avg = COURSES.filter((c) => c.grade !== null).reduce((acc, c) => acc + (c.grade ?? 0), 0) / COURSES.filter((c) => c.grade !== null).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <GraduationCap size={20} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Academic</Text>
          <Text style={styles.headerSub}>Services & resources</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{COURSES.length}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxMid]}>
          <Text style={styles.statValue}>{avg.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg. Grade</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>Year {student?.year}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Services</Text>
        <View style={styles.toolsGrid}>
          {ACADEMIC_TOOLS.map(({ id, icon: Icon, label, desc, color }) => (
            <TouchableOpacity key={id} style={styles.toolCard} activeOpacity={0.8}>
              <View style={[styles.toolIcon, { backgroundColor: color + '18' }]}>
                <Icon size={20} color={color} />
              </View>
              <Text style={styles.toolLabel}>{label}</Text>
              <Text style={styles.toolDesc}>{desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Courses</Text>
        {COURSES.map((course) => (
          <TouchableOpacity key={course.code} style={styles.courseCard} activeOpacity={0.8}>
            <View style={styles.courseLeft}>
              <View style={styles.courseIcon}>
                <BookOpen size={18} color={Colors.academic} />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.courseProfessor}>{course.professor}</Text>
                <View style={styles.courseMetaRow}>
                  <Clock size={11} color={Colors.textTertiary} />
                  <Text style={styles.courseMeta}>{course.schedule}</Text>
                </View>
                <Text style={styles.courseRoom}>Room {course.room}</Text>
              </View>
            </View>
            <View style={styles.courseRight}>
              {course.grade !== null ? (
                <View style={styles.gradeBadge}>
                  <Text style={styles.gradeValue}>{course.grade}</Text>
                  <Text style={styles.gradeLabel}>/ 10</Text>
                </View>
              ) : (
                <Text style={styles.gradeNA}>–</Text>
              )}
              <ChevronRight size={16} color={Colors.textTertiary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 24 }} />
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
    gap: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryRedDark,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
    gap: 0,
  },
  statBox: {
    flex: 1, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, paddingVertical: 14, marginHorizontal: 4,
  },
  statBoxMid: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: 2 },

  section: { padding: 20, paddingBottom: 0 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },

  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  toolCard: {
    width: '47.5%',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 4,
  },
  toolIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  toolLabel: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  toolDesc: { fontSize: 11, color: Colors.textTertiary, lineHeight: 15 },

  courseCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  courseLeft: { flexDirection: 'row', flex: 1, gap: 12 },
  courseIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.academicLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  courseInfo: { flex: 1 },
  courseName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  courseCode: { fontSize: 11, color: Colors.textTertiary, fontWeight: '600', letterSpacing: 0.3, marginBottom: 3 },
  courseProfessor: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  courseMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  courseMeta: { fontSize: 11, color: Colors.textTertiary },
  courseRoom: { fontSize: 11, color: Colors.textTertiary },
  courseRight: { alignItems: 'center', gap: 6, paddingLeft: 8 },
  gradeBadge: { alignItems: 'center' },
  gradeValue: { fontSize: 18, fontWeight: '800', color: Colors.primaryRed },
  gradeLabel: { fontSize: 10, color: Colors.textTertiary },
  gradeNA: { fontSize: 18, fontWeight: '400', color: Colors.textTertiary },
});
