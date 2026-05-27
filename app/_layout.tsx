import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react';

function AppStack() {
  const { isDark } = useTheme();
  const { isAuthenticated, isLoading, student } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && student) {
      const needsOnboarding = !student.faculty || (!student.degree && student.role === 'STUDENT');
      
      if (needsOnboarding && segments[0] !== 'onboarding') {
        router.replace('/onboarding' as any);
      }
    }
  }, [isAuthenticated, student, segments, isLoading, router]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" options={{ presentation: 'card' }} />
        <Stack.Screen name="printer" options={{ presentation: 'card' }} />
        <Stack.Screen name="student-id" options={{ presentation: 'card' }} />
        <Stack.Screen name="calendar" options={{ presentation: 'card' }} />
        <Stack.Screen name="events" options={{ presentation: 'card' }} />
        <Stack.Screen name="event/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="chatbot" options={{ presentation: 'card' }} />
        <Stack.Screen name="onboarding" options={{ presentation: 'card', gestureEnabled: false }} />
        <Stack.Screen name="menu" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppStack />
      </AuthProvider>
    </ThemeProvider>
  );
}
