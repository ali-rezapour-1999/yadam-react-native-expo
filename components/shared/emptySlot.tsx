import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Text } from '../Themed';
import { Pressable } from 'react-native';

const EmptySlot = ({ route, placeholder }: { route?: any; placeholder?: string }) => (
  <Pressable
    onPress={() => router.push(route || '/tabs/(tabs)/createTask')}
    style={{
      backgroundColor: Colors.main.cardBackground,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: Colors.main.textPrimary,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 12,
    }}
  >
    <Text
      style={{
        fontSize: 14,
        color: Colors.main.textDisabled,
      }}
    >
      {placeholder}
    </Text>
  </Pressable>
);

export default EmptySlot;
