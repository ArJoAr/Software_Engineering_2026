import React from 'react';
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
  CreditCard,
  CalendarDays,
  Globe,
  BookOpen,
  Library,
  Calendar,
  Gift,
  Menu,
  ChevronRight,
  Bell,
  Ticket,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { QuickAccessCard } from '@/components/QuickAccessCard';
import { MOCK_EVENTS } from '@/constants/mockData';
import { EventCard } from '@/components/EventCard';

const QUICK_ACCESS = [
  {
    id: 'student-id',
    title: 'My Student ID',
    icon: CreditCard,
    route: '/student-id',
    color: Colors.primaryRed,
  },
  {
    id: 'calendar',
    title: 'My Calendar',
    icon: CalendarDays,
    route: '/calendar',
    color: Colors.info,
  },
  {
    id: 'campus-global',
    title: 'Campus Global',
    icon: Globe,
    route: '/academic',
    color: Colors.categoryColors.conference,
  },
  {
    id: 'aula-global',
    title: 'Aula Global',
    icon: BookOpen,
    route: '/academic',
    color: Colors.academic,
  },
  {
    id: 'library',
    title: 'My Library Account',
    icon: Library,
    route: '/academic',
    color: Colors.success,
  },
  {
    id: 'agenda',
    title: 'Agenda',
    icon: Calendar,
    route: '/calendar',
    color: Colors.categoryColors.culture,
  },
  {
    id: 'benefits',
    title: 'UPF Benefits',
    icon: Gift,
    route: '/highlights',
    color: Colors.warning,
  },
  {
    id: 'events',
    title: 'Campus Events',
    icon: Ticket,
    route: '/events',
    color: Colors.categoryColors.events,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { student } = useAuth();

  const featuredEvents = MOCK_EVENTS.slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerBrand}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>UPF</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>UPF Campus</Text>
              <Text style={styles.headerSub}>Universitat Pompeu Fabra</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/highlights')}>
              <Gift size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerIcon, styles.headerIconBell]}
              onPress={() => router.push('/notifications')}
            >
              <Bell size={20} color="#fff" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/menu')}>
              <Menu size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.welcomeCard} onPress={() => router.push('/profile')} activeOpacity={0.85}>
          <Image
            source={{ uri: student?.photoUrl }}
            style={styles.avatar}
          />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeGreet}>Hello, {student?.firstName ?? 'Student'}</Text>
            <Text style={styles.welcomeRole}>{student?.role} · {student?.degree?.split(' ').slice(0, 3).join(' ')}</Text>
            <Text style={styles.welcomeEmail}>{student?.email}</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.grid}>
          {QUICK_ACCESS.map((item) => {
            const IconComp = item.icon;
            return (
              <View key={item.id} style={styles.gridItem}>
                <QuickAccessCard
                  title={item.title}
                  icon={<IconComp size={22} color={item.color} />}
                  onPress={() => router.push(item.route as any)}
                  accentColor={item.color}
                />
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => router.push('/events')}>
            <Text style={styles.sectionLink}>See all</Text>
          </TouchableOpacity>
        </View>
        {featuredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => router.push(`/event/${event.id}` as any)}
          />
        ))}
      </View>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 20 },

  header: {
    backgroundColor: Colors.primaryRed,
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  logoText: { fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 1 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBell: { position: 'relative' },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    borderWidth: 1,
    borderColor: Colors.primaryRed,
  },

  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  welcomeText: { flex: 1 },
  welcomeGreet: { fontSize: 16, fontWeight: '700', color: '#fff' },
  welcomeRole: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 1 },
  welcomeEmail: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 1 },

  section: { padding: 20, paddingBottom: 0 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  sectionLink: { fontSize: 14, color: Colors.primaryRed, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '47%' },
  bottomPad: { height: 20 },
});
