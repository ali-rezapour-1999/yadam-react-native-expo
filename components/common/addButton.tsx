import { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Plus } from 'lucide-react-native';
import { Button } from '../ui/button';
import { router } from 'expo-router';

const BUTTON_SIZE = 64;

const AddButton: React.FC = memo(() => {
  const gradientColors = useMemo(() => [Colors.main.button, Colors.main.accent] as const, []);
  const gradientStart = useMemo(() => ({ x: 0, y: 0 }), []);
  const gradientEnd = useMemo(() => ({ x: 1, y: 1 }), []);


  return (
    <Button style={styles.container} onPress={() => router.push('/tabs/(tabs)/tasks/createTask')}>
      <LinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={styles.gradientButton}
      >
        <Plus size={28} color={Colors.main.background} />
      </LinearGradient>
    </Button>
  );
});

AddButton.displayName = 'AddButton';

export default AddButton;

const styles = StyleSheet.create({
  container: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    zIndex: 1001,
  },
  hidden: {
    display: 'none',
  },
  gradientButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1002,
  },
});
