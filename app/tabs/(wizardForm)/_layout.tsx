import { Stack } from 'expo-router';

export default function WizardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="stepOne" />
      <Stack.Screen name="stepTwo" />
      <Stack.Screen name="stepThree" />
      <Stack.Screen name="stepFour" />
    </Stack>
  );
}
