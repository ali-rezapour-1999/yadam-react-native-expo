import { Colors } from '@/constants/Colors';
import { Svg, Path } from 'react-native-svg';
import { Animated } from 'react-native';
import { getAnimatedColors, useIconAnimation } from '@/hooks/animationIcons';

interface TodoIconProps {
  focused: boolean;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const TodoIcon = ({ focused }: TodoIconProps) => {
  const animation = useIconAnimation(focused);

  const fillColor = getAnimatedColors(animation, Colors.main.primary, 'transparent');
  const strokeColor = getAnimatedColors(animation, 'transparent', Colors.main.primaryLight);

  return (
    <Svg width="32" height="32" viewBox="0 0 22 23" fill="none">
      <AnimatedPath
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.127014 10.1069C0.127014 17.464 2.35207 19.9171 9.02618 19.9171C15.7014 19.9171 17.9254 17.464 17.9254 10.1069C17.9254 2.74976 15.7014 0.296685 9.02618 0.296685C2.35207 0.296685 0.127014 2.74976 0.127014 10.1069Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.58197"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path d="M12.837 14.027H5.17972" stroke={focused ? Colors.main.primaryLight : Colors.main.textPrimary} strokeWidth="1.58197" strokeLinecap="round" strokeLinejoin="round" />

      <Path d="M12.837 10.0372H5.17972" stroke={focused ? Colors.main.primaryLight : Colors.main.textPrimary} strokeWidth="1.58197" strokeLinecap="round" strokeLinejoin="round" />

      <Path d="M8.10156 6.05273H5.17972" stroke={focused ? Colors.main.primaryLight : Colors.main.textPrimary} strokeWidth="1.58197" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default TodoIcon;
