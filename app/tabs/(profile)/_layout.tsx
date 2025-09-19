import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ animation: 'flip' }} />
      <Stack.Screen name="setting" options={{ animation: 'flip' }} />
      <Stack.Screen name="aboutMe" options={{ animation: 'flip' }} />
    </Stack>
  );
}
