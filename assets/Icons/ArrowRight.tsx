import { Colors } from '@/constants/Colors';
import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const ArrowRightIcon = ({ color = Colors.main.background }) => {
  return (
    <Svg width="27" height="27" viewBox="0 0 14 14" fill="none">
      <Path d="M10.8924 7.10927L2.97223 7.10927" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M7.69775 3.91515C7.69775 3.91515 10.8922 5.64407 10.8922 7.10842C10.8922 8.57384 7.69775 10.3033 7.69775 10.3033"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
