import { StyleProp, ViewStyle } from 'react-native';
import { View } from '../Themed';
import { MotiView } from 'moti';

export const Loading = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  return (
    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }, style]}>
      {[0, 1, 2].map((i) => (
        <MotiView
          from={{ translateY: 0, opacity: 0.5 }}
          animate={{ translateY: -10, opacity: 1 }}
          transition={{
            type: 'timing',
            duration: 600,
            loop: true,
            delay: i * 200,
          }}
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#FF7A45',
            marginHorizontal: 6,
          }}
        />
      ))}
    </View>
  );
};
