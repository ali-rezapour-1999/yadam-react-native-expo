import { Colors } from '@/constants/Colors';
import { Svg, Path } from 'react-native-svg';

const ChevronDown = () => {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24">
      <Path
        d="M4 10 L12 14 L20 10"
        fill="none"
        stroke={Colors.main.textDisabled}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChevronDown;
