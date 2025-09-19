import { PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';
import { useMemo } from 'react';
import { useAppStore } from '@/store/appState';

type DynamicStyle = StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);

export function useDynamicStyle(style?: DynamicStyle): DynamicStyle {
  const { language } = useAppStore();
  const dir: 'rtl' | 'ltr' = language === 'fa' ? 'rtl' : 'ltr';
  const baseDirStyle: ViewStyle = { direction: dir };

  const computedStyle = useMemo(() => {
    if (typeof style === 'function') {
      const combined = (state: PressableStateCallbackType) => [baseDirStyle, style(state)] as StyleProp<ViewStyle>;
      return combined as StyleProp<ViewStyle>;
    } else {
      return [baseDirStyle, style] as StyleProp<ViewStyle>;
    }
  }, [language, style]);

  return computedStyle;
}

export function useStaticDynamicStyle(style?: StyleProp<ViewStyle>): StyleProp<ViewStyle> {
  const { language } = useAppStore();
  const dir: 'rtl' | 'ltr' = language === 'fa' ? 'rtl' : 'ltr';
  const baseDirStyle: ViewStyle = { direction: dir };

  const computedStyle = useMemo(() => {
    return [baseDirStyle, style] as StyleProp<ViewStyle>;
  }, [language, style]);

  return computedStyle;
}
