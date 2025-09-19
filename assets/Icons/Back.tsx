import { Svg, Path } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

const BackIcon = ({ color = Colors.main.textPrimary, strokeWidth = 2 }) => {
  return (
    <Svg width="30" height="27" viewBox="0 0 30 27" fill="none">
      <Path
        d="M19.5017 20.9022C19.5017 20.9022 11.0348 16.5099 11.0348 13.4828C11.0348 10.4568 19.5017 6.06348 19.5017 6.06348"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default BackIcon;
