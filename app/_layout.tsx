import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { setBackgroundColorAsync } from 'expo-navigation-bar';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "./store/authStore";
import storageService from "./services/storageService";
import { useEffect, useState } from "react";

export default function Layout() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const backgroundColor = '#121212'
    setBackgroundColorAsync(backgroundColor);
  }, [colorScheme]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedAuth = await storageService.getStoredAuth();
        if (storedAuth.bearerToken && storedAuth.refreshToken) {
          useAuthStore.setState({
            isAuthenticated: true,
            ...storedAuth
          });
          await useAuthStore.getState().refreshAuthToken();
        } else {
          useAuthStore.setState({ isAuthenticated: false });
          await new Promise(resolve => setTimeout(resolve, 100));
          router.replace('/login');
        }
      } catch (error) {
        useAuthStore.setState({ isAuthenticated: false });
        await new Promise(resolve => setTimeout(resolve, 100));
        router.replace('/login');
      } finally {
        setIsInitializing(false);
      }
    };
    initAuth();
  }, []);

  if (isInitializing) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }} />
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
    </ThemeProvider>
  );
}
