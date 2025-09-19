import { Colors } from '@/constants/Colors';
import { Svg, Path, G } from 'react-native-svg';

interface TodoIconProps {
  color?: string;
  size?: number;
}

export const TodoIcon = ({ color = Colors.main.primary, size = 24 }: TodoIconProps) => {
  return (
    <Svg fill={color} viewBox="0 0 24 24" width={size} height={size}>
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <Path d="M21,14.5H13v-5h8ZM4,21h7V3H4A1,1,0,0,0,3,4V20A1,1,0,0,0,4,21ZM21,4a1,1,0,0,0-1-1H13V8h8Zm0,16V16H13v5h7A1,1,0,0,0,21,20Z"></Path>
      </G>
    </Svg>
  );
};
