import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const useIconAnimation = (focused: boolean, duration = 150) => {
  const animation = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: focused ? 1 : 0,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [focused, duration]);

  return animation;
};

export const getAnimatedColors = (animation: Animated.Value, fromColor: string, toColor: string) => {
  return animation.interpolate({
    inputRange: [0, 1],
    outputRange: [fromColor, toColor],
  });
};
