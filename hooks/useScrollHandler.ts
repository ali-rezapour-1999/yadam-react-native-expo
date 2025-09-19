import { useRef, useCallback } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useAppStore } from '@/store/appState';

export const useScrollHandler = () => {
  const { setHideTabBar } = useAppStore();
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setHideTabBar(true);
      } else if (currentScrollY < lastScrollY.current) {
        setHideTabBar(false);
      }

      lastScrollY.current = currentScrollY;
    },
    [setHideTabBar],
  );

  return { handleScroll, scrollEventThrottle: 10 };
};
