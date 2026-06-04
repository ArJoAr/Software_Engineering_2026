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
  CreditCard,
  CalendarDays,
  BookOpen,
  Gift,
  Bell,
  Ticket,
  Pencil,
  Sparkles,
  MessageCircle,
  ChevronRight,
  ClipboardList,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { QuickAccessCard } from '@/components/QuickAccessCard';
import { AvatarPreview } from '@/components/AvatarPreview';
import { MOCK_EVENTS } from '@/constants/mockData';
import { EventCard } from '@/components/EventCard';

const QUICK_ACCESS = [
  { id: 'student-id', title: 'Student ID',     icon: CreditCard,   route: '/student-id',  color: Colors.primaryRed },
  { id: 'calendar',   title: 'Calendar',        icon: CalendarDays, route: '/calendar',    color: Colors.info },
  { id: 'academics',  title: 'Academics',       icon: BookOpen,     route: '/academic',    color: Colors.academic },
  { id: 'benefits',   title: 'Benefits',        icon: Gift,         route: '/highlights',  color: Colors.success },
  { id: 'events',     title: 'Events',          icon: Ticket,       route: '/events',      color: Colors.categoryColors.events },
  { id: 'news',       title: 'News',            icon: Bell,         route: '/news',        color: Colors.warning },
];

export default function HomeScreen() {
  const router = useRouter();
  const { student } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const hasAvatar = !!student?.monster3D?.style;
  const featuredEvents = MOCK_EVENTS.slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
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
          </View>
        </View>

        {/* ── Welcome card: left = user info | right = 3D avatar ── */}
        <View style={styles.welcomeCard}>

          {/* Left half — tap → profile */}
          <TouchableOpacity style={styles.welcomeLeft} onPress={() => router.push('/profile')} activeOpacity={0.8}>
            {student?.photoUrl ? (
              <Image source={{ uri: student.photoUrl }} style={styles.userPhoto} />
            ) : (
              <View style={[styles.userPhoto, styles.userPhotoFallback]}>
                <Text style={styles.userPhotoInitial}>
                  {student?.firstName?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            <Text style={styles.welcomeGreet} numberOfLines={1}>
              {student?.firstName ?? 'Student'}
            </Text>
            <Text style={styles.welcomeRole} numberOfLines={1}>
              {student?.role ?? ''}
            </Text>
            <Text style={styles.welcomeEmail} numberOfLines={2}>
              {student?.email ?? ''}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.welcomeDivider} />

          {/* Right half — tap → avatar studio */}
          <TouchableOpacity
            style={styles.welcomeRight}
            onPress={() => router.push('/avatar' as any)}
            activeOpacity={0.8}
          >
            {hasAvatar ? (
              <>
                <AvatarPreview
                  config={student!.monster3D!}
                  size={90}
                  bgColor="rgba(255,255,255,0.1)"
                />
                <View style={styles.editBadge}>
                  <Pencil size={9} color="#fff" />
                  <Text style={styles.editBadgeText}>Fabri</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.avatarCTA}>
                  <Sparkles size={28} color="rgba(255,255,255,0.7)" />
                </View>
                <Text style={styles.avatarCTATitle}>My Avatar</Text>
                <Text style={styles.avatarCTASub}>Tap to create</Text>
              </>
            )}
          </TouchableOpacity>

        </View>
      </View>

      {/* ── Chatbot featured card ── */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.chatbotCard}
          onPress={() => router.push('/chatbot')}
          activeOpacity={0.88}
        >
          <View style={styles.chatbotIconWrap}>
            <MessageCircle size={26} color="#fff" fill="rgba(255,255,255,0.25)" />
          </View>
          <View style={styles.chatbotText}>
            <Text style={styles.chatbotTitle}>UPF Assistant</Text>
            <Text style={styles.chatbotSub}>Ask anything about campus, courses or services</Text>
          </View>
          <ChevronRight size={18} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      {/* ── AI Planner featured card ── */}
      <View style={styles.plannerSection}>
        <TouchableOpacity
          style={styles.plannerCard}
          onPress={() => router.push('/todo' as any)}
          activeOpacity={0.88}
        >
          <View style={styles.plannerIconWrap}>
            <ClipboardList size={26} color="#fff" />
          </View>
          <View style={styles.plannerText}>
            <Text style={styles.plannerTitle}>AI Planner</Text>
            <Text style={styles.plannerSub}>Exams, tasks & deadlines in one place</Text>
          </View>
          <ChevronRight size={18} color="rgba(88,86,214,0.5)" />
        </TouchableOpacity>
      </View>

      {/* ── Quick Access grid (3 columns) ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.grid}>
          {QUICK_ACCESS.map((item) => {
            const IconComp = item.icon;
            return (
              <View key={item.id} style={styles.gridItem}>
                <QuickAccessCard
                  title={item.title}
                  icon={<IconComp size={20} color={item.color} />}
                  onPress={() => router.push(item.route as any)}
                  accentColor={item.color}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* ── Upcoming Events ── */}
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

const makeStyles = (colors: typeof Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 24 },

  // ── Header ──────────────────────────────────────────────
  header: {
    backgroundColor: colors.primaryRed,
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
  },
  logoText:    { fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  headerSub:   { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 1 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerIconBell: { position: 'relative' },
  bellDot: {
    position: 'absolute', top: 7, right: 7,
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: '#FFD700',
    borderWidth: 1, borderColor: colors.primaryRed,
  },

  // ── Welcome card ────────────────────────────────────────
  welcomeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
    minHeight: 148,
  },
  welcomeLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 3,
  },
  userPhoto: {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  userPhotoFallback: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  userPhotoInitial: { fontSize: 22, color: '#fff', fontWeight: '700' },
  welcomeGreet: { fontSize: 14, fontWeight: '700', color: '#fff', textAlign: 'center' },
  welcomeRole:  { fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  welcomeEmail: { fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 14 },

  welcomeDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginVertical: 18,
  },

  welcomeRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 6,
  },
  editBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.28)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  editBadgeText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  avatarCTA: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarCTATitle: { fontSize: 13, fontWeight: '700', color: '#fff' },
  avatarCTASub:   { fontSize: 11, color: 'rgba(255,255,255,0.55)' },

  // ── Chatbot featured card ────────────────────────────────
  chatbotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryRedDark,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: colors.primaryRed,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  chatbotIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  chatbotText: { flex: 1 },
  chatbotTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 2 },
  chatbotSub:   { fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 17 },

  // ── AI Planner card ─────────────────────────────────────
  plannerSection: { paddingHorizontal: 20, paddingTop: 10 },
  plannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.academicLight,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.academic + '40',
  },
  plannerIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.academic,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  plannerText: { flex: 1 },
  plannerTitle: { fontSize: 15, fontWeight: '700', color: colors.academic, marginBottom: 2 },
  plannerSub:   { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },

  // ── Sections & grid ─────────────────────────────────────
  section: { paddingHorizontal: 20, paddingTop: 20 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
  sectionLink:  { fontSize: 14, color: colors.primaryRed, fontWeight: '600' },

  grid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: { width: '30.5%' },

  bottomPad: { height: 24 },
});
