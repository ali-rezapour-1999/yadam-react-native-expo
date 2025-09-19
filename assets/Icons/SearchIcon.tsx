import React from 'react';
import { Svg, G, Path, Line } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

export const SearchIcons = () => {
  return (
    <Svg viewBox="0 0 24 24" fill="none">
      <G fill="none" stroke="none">
        <Path
          d="M10.5,19 C15.1944,19 19,15.1944 19,10.5 C19,5.8056 15.1944,2 10.5,2 C5.8056,2 2,5.8056 2,10.5 C2,15.1944 5.8056,19 10.5,19 Z"
          stroke={Colors.main.textSecondary}
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <Path
          d="M13.3284,7.17155 C12.60455,6.4477 11.60455,6 10.5,6 C9.39545,6 8.39545,6.4477 7.67155,7.17155"
          stroke={Colors.main.textSecondary}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <Line x1="16.6109" y1="16.6109" x2="20.85355" y2="20.85355" stroke={Colors.main.textSecondary} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </G>
    </Svg>
  );
};
