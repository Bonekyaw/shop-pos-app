import { useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { useAuthStore } from '../store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  
  const { user, token, checkSession, validateSession } = useAuthStore();

  // Validate session with server when app comes to foreground
  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && token) {
        const valid = await validateSession();
        if (!valid && user) {
          // Session was revoked — redirect to login
          router.replace('/');
        }
      }
    },
    [token, user, validateSession, router]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);

  useEffect(() => {
    // Basic Auth Guard
    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'order' || segments[0] === 'payment';
    const isValidSession = checkSession();
    
    if (!isValidSession && inAuthGroup) {
      // Redirect to login if unauthenticated
      router.replace('/');
    } else if (isValidSession && segments[0] === undefined) {
      // Redirect to tabs if authenticated and on root
      router.replace('/(tabs)/tables');
    }
  }, [user, token, segments, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="order" />
          <Stack.Screen name="payment" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
