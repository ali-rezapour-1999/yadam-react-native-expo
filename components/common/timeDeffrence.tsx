import { MotiView } from 'moti';
import { Colors } from '@/constants/Colors';
import { useMemo } from 'react';
import { Box } from '../ui/box';
import { Text } from '../Themed';
import { t } from 'i18next';

const TimeDeffrence = ({ startTime, endTime }: { startTime: string; endTime: string }) => {
  const timeDifference = useMemo(() => {
    if (!startTime || !endTime) return '';

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;

    let diffMin = endTotalMin - startTotalMin;

    if (diffMin < 0) {
      diffMin += 24 * 60;
    }

    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin % 60;

    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  }, [startTime, endTime]);

  return (
    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }}>
      <Box className="items-center">
        <Text className="text-lg " style={{ color: Colors.main.button }}>
          {t('todos.time_deffrence')}: {timeDifference}
        </Text>
      </Box>
    </MotiView>
  );
};

export default TimeDeffrence;
