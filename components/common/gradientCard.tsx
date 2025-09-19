import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleProp, ViewStyle, DimensionValue } from 'react-native';

interface GradientCardProps {
  colors: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  width?: DimensionValue;
  height?: number;
  children: React.ReactNode;
}

export const GradientCard: React.FC<GradientCardProps> = ({ colors, start = { x: 0, y: 0 }, end = { x: 1, y: 1 }, width = '100%', height, children }) => {
  const platformStyles: StyleProp<ViewStyle> = Platform.select({
    ios: {
      shadowColor: colors[0],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    android: { elevation: 3 },
    default: {},
  });

  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      className="px-5 flex flex-row items-center justify-between"
      style={[
        {
          flex: 1,
          borderRadius: 20,
          height,
          width,
        },
        platformStyles,
      ]}
    >
      {children}
    </LinearGradient>
  );
};
