import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable, StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { Box } from '../../ui/box';
import { Colors } from '@/constants/Colors';
import { TaskStatus } from '@/constants/enums/TaskEnum';
import { TaskWithCategory } from '@/types/database-type';
import { Category } from '@/constants/Category';
import { Text } from '../../Themed';
import React, { useRef } from 'react';
import { useBaseStore } from '@/store/baseState/base';

interface ScheduleCardProps {
  task: TaskWithCategory;
  onPress?: (task: TaskWithCategory) => void;
  style?: StyleProp<ViewStyle>;
  onLayoutChange?: (id: string, layout: { width: number; height: number }) => void;
}

const ScheduleCard = ({ task, onPress, style, onLayoutChange }: ScheduleCardProps) => {
  const language = useBaseStore.getState().language;
  const cardRef = useRef<View>(null);

  const handlePress = () => {
    if (onPress && task.id != null) {
      onPress(task);
    }
  };

  const getStatusConfig = () => {
    switch (task.status) {
      case TaskStatus.COMPLETED:
        return {
          borderColor: Colors.main.primary,
          backgroundColor: Colors.main.primary + '10',
          statusTextColor: Colors.main.primary,
        };
      case TaskStatus.CANCELLED:
        return {
          borderColor: Colors.main.accent,
          backgroundColor: Colors.main.accent + '10',
          statusTextColor: Colors.main.accent,
        };
      default:
        return {
          borderColor: Colors.main.textSecondary,
          backgroundColor: Colors.main.cardBackground,
          statusTextColor: Colors.main.primary,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getBorderStyle = () => {
    const isRTL = language === 'fa';
    return {
      [isRTL ? 'borderRightWidth' : 'borderLeftWidth']: 8,
      [isRTL ? 'borderRightColor' : 'borderLeftColor']: statusConfig.borderColor,
    };
  };

  const category = Category.find((c) => c.id === task?.topicsCategoryId);
  const isFinished = task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Box
        ref={cardRef}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          if (onLayoutChange && task.id) {
            onLayoutChange(task.id, { width, height });
          }
        }}
        style={[
          styles.cardContainer,
          { backgroundColor: !isFinished ? Colors.main.cardBackground : Colors.main.border },
          getBorderStyle(),
          style,
        ]}
      >
        <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <VStack>
            <Text numberOfLines={2} className='text-lg' style={{ fontFamily: 'DanaBold' }}>{task.title}</Text>
            {task.description && task.description !== '' && <Text numberOfLines={2}>{task.description}</Text>}
          </VStack>

          <HStack style={styles.timeContainer}>
            <Text
              style={[
                styles.timeText,
                { color: !isFinished ? Colors.main.textPrimary : Colors.main.textSecondary, fontFamily: 'DanaBold' },
              ]}
            >
              {task.startTime} - {task.endTime}
            </Text>
          </HStack>
        </HStack>
        {category && (
          <HStack>
            <Text
              className="px-2 rounded-xl text-sm"
              style={{
                backgroundColor: isFinished ? Colors.main.background : category?.color ? category.color + '40' : Colors.main.border, color: Colors.main.textPrimary,
              }}
            >
              {language === 'fa' ? category?.fa ?? '' : category?.name ?? ''}
            </Text>
          </HStack>
        )}
      </Box>
    </Pressable>
  );
};

export default ScheduleCard;

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  timeContainer: {
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    color: Colors.main.textSecondary,
  },
});
