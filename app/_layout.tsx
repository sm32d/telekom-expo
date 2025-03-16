import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "./store/authStore";
import storageService from "./services/storageService";
import { useEffect, useState } from "react";

export default function Layout() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedAuth = await storageService.getStoredAuth();
      if (storedAuth.bearerToken && storedAuth.refreshToken) {
        useAuthStore.setState({
          isAuthenticated: true,
          ...storedAuth
        });
        // Refresh token using authStore
        try {
          await useAuthStore.getState().refreshAuthToken();
          setIsInitializing(false);
        } catch (error) {
          useAuthStore.setState({ isAuthenticated: false });
          setIsInitializing(false);
          router.replace('/login');
        }
      } else {
        setIsInitializing(false);
        if (!isAuthenticated) {
          router.replace('/login');
        }
      }
    };
    initAuth();
  }, []);

  if (isInitializing) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="settings/index" />
          <Stack.Screen name="more-options" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
