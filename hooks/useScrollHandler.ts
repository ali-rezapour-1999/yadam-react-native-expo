import { useBaseStore } from '@/store/baseState/base';
import { useRef, useCallback } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export const useScrollHandler = () => {
  const setHideTabBar = useBaseStore().setHideScroll;
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      if (currentScrollY - lastScrollY.current > 10 && currentScrollY > 30) {
        setHideTabBar(true);
      } else if (lastScrollY.current - currentScrollY > 10) {
        setHideTabBar(false);
      }

      lastScrollY.current = currentScrollY;
    },
    [setHideTabBar],
  );

  return { handleScroll, scrollEventThrottle: 16 };
};

