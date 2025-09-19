import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { useTranslation } from 'react-i18next';

interface HeadingProps extends TextProps {
  children: React.ReactNode;
  size?: keyof typeof headingSizes;
  bold?: boolean;
  underline?: boolean;
  strikeThrough?: boolean;
  italic?: boolean;
  highlight?: boolean;
}

const headingSizes = {
  '5xl': 48,
  '4xl': 40,
  '3xl': 32,
  '2xl': 28,
  xl: 24,
  lg: 20,
  md: 18,
  sm: 16,
  xs: 14,
};

export const Heading: React.FC<HeadingProps> = ({ children, size = 'xl', bold, underline, strikeThrough, italic, highlight, style, ...rest }) => {
  const { i18n } = useTranslation();

  const fontFamily = i18n.language === 'fa' ? 'DanaBold' : 'IBMPBold';

  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily,
          fontSize: headingSizes[size],
          fontWeight: bold ? 'bold' : 'normal',
          textDecorationLine: underline ? 'underline' : strikeThrough ? 'line-through' : 'none',
          fontStyle: italic ? 'italic' : 'normal',
          backgroundColor: highlight ? '#facc15' : 'transparent',
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};
