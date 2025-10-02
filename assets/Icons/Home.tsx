import { Colors } from '@/constants/Colors';
import { Svg, Path } from 'react-native-svg';
import { Animated } from 'react-native';
import { getAnimatedColors, useIconAnimation } from '@/hooks/animationIcons';

interface HomeIconProps {
  focused: boolean;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const HomeIcon = ({ focused }: HomeIconProps) => {
  const animation = useIconAnimation(focused);

  const fillColor = getAnimatedColors(animation, Colors.main.primary, 'transparent');
  const strokeColor = getAnimatedColors(animation, 'transparent', Colors.main.primaryLight);

  return (
    <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <AnimatedPath
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 13.3531C1 7.41437 1.64755 7.82884 5.13316 4.59635C6.65819 3.36874 9.03114 1 11.0803 1C13.1284 1 15.5489 3.35714 17.0876 4.59635C20.5732 7.82884 21.2197 7.41437 21.2197 13.3531C21.2197 22.093 19.1537 22.093 11.1099 22.093C3.06606 22.093 1 22.093 1 13.3531Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M8.04329 15.9103H14.1761" stroke={focused ? Colors.main.primaryLight : Colors.main.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default HomeIcon;
