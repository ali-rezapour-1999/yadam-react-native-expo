import { Text as DefaultText, View as DefaultView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useDynamicFont } from '@/hooks/useDynamicFont';
import { useBaseStore } from '@/store/baseState/base';

type ColorName = {
  [K in keyof typeof Colors.main]: (typeof Colors.main)[K] extends string ? K : never;
}[keyof typeof Colors.main];

type ThemeProps = {
  lightColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(props: ThemeProps, colorName: ColorName) {
  return props.lightColor ?? Colors.main[colorName];
}

export function Text(props: TextProps) {
  const { style, lightColor, ...otherProps } = props;
  const color = useThemeColor({ lightColor }, 'textPrimary');
  const fontStyle = useDynamicFont([{ color }, style]);

  return <DefaultText style={fontStyle} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ lightColor }, 'background');
  const language = useBaseStore.getState().language;

  return < DefaultView style={[{ backgroundColor, direction: language === 'fa' ? 'rtl' : 'ltr' }, style]} {...otherProps} />;
}
