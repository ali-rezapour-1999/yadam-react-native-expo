import { Colors } from '@/constants/Colors';
import { Svg, Path, Circle } from 'react-native-svg';
import { Animated } from 'react-native';
import { getAnimatedColors, useIconAnimation } from '@/hooks/animationIcons';

interface ProfileIconProps {
  focused: boolean;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProfileIcon = ({ focused }: ProfileIconProps) => {
  const animation = useIconAnimation(focused);

  const fillColor = getAnimatedColors(animation, Colors.main.primary, 'transparent');
  const strokeColor = getAnimatedColors(animation, 'transparent', Colors.main.primaryLight);

  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
      <AnimatedCircle cx="12" cy="8" r="4" fill={fillColor} stroke={strokeColor} strokeWidth={1.9} />
      <AnimatedPath d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke={strokeColor} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default ProfileIcon;
