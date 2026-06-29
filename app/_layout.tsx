import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightTheme } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark'
  const theme =  isDark ? DarkTheme : DefaultTheme

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={ isDark ? 'light' : 'dark' }/>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
       
      </SafeAreaView>
    </ThemeProvider>
  );
}
