export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false  }} />
      <Stack.Screen name="(wizardForm)" options={{ headerShown: false }} />
      <Stack.Screen name="(profile)" options={{ headerShown: false }} />
    </Stack>
  );
}
