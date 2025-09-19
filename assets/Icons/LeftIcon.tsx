import { Colors } from '@/constants/Colors';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

const LeftIcon = ({ color = Colors.main.background, width, height }: { color?: string; width?: number; height?: number }) => {
  return (
    <Svg viewBox="0 0 24 24" fill="none" width={width} height={height}>
      <Path
        d="M19.5025 20.835L2.99281 13.4725C1.66906 12.8822 1.66906 11.1178 2.99281 10.5275L19.5025 3.16496C20.9984 2.49789 22.5499 3.97914 21.809 5.36689L18.657 11.2706C18.4118 11.7298 18.4118 12.2702 18.657 12.7294L21.809 18.6331C22.5499 20.0209 20.9984 21.5021 19.5025 20.835Z"
        fill={color}
      />
    </Svg>
  );
};

export default LeftIcon;
