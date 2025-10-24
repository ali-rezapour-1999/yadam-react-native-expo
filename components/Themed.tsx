import { Text as DefaultText, View as DefaultView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/authState/authState';
import { useDynamicFont } from '@/hooks/useDynamicFont';

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
  const { language } = useAppStore();

  return <DefaultView style={[{ backgroundColor, direction: language === 'fa' ? 'rtl' : 'ltr' }, style]} {...otherProps} />;
}
