import { Colors } from '@/constants/Colors';
import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const CancelIcon = ({ color }: { color?: string }) => {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill={color}>
      <Path d="M8.5 8.5L21.5 21.5M21.5 8.5L8.5 21.5" stroke={Colors.main.textSecondary} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
};
