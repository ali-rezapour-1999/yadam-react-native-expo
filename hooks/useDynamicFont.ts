import { useBaseStore } from '@/store/baseState/base';
import { useMemo } from 'react';
import { StyleProp, TextStyle } from 'react-native';

type DynamicTextStyle = StyleProp<TextStyle>;

export function useDynamicFont(style?: DynamicTextStyle): DynamicTextStyle {
  const language = useBaseStore().language;

  const fontStyle: TextStyle = {
    fontFamily: 'DanaReguler',
  };

  const computedStyle = useMemo(() => {
    return [fontStyle, style] as DynamicTextStyle;
  }, [language, style]);

  return computedStyle;
}
