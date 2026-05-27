import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';

export default function Index() {
  const { isAuthenticated, isLoading, student } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.primaryRed, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/login" />;

  const needsOnboarding = !student?.faculty || (!student?.degree && student?.role === 'STUDENT');

  return <Redirect href={needsOnboarding ? '/onboarding' : '/(tabs)'} />;
}
