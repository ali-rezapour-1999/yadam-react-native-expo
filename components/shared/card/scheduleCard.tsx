import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable, StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { Box } from '../../ui/box';
import { Colors } from '@/constants/Colors';
import { Icon } from '../../ui/icon';
import { useAppStore } from '@/store/appState';
import { TaskStatus } from '@/constants/TaskEnum';
import { TaskWithCategory } from '@/types/database-type';
import { Category } from '@/constants/Category';
import { Text } from '../../Themed';
import { Clock } from 'lucide-react-native';
import React, { useRef, useState } from 'react';

interface ScheduleCardProps {
  task: TaskWithCategory;
  onPress?: (task: TaskWithCategory) => void;
  style?: StyleProp<ViewStyle>;
  onLayoutChange?: (id: string, layout: { width: number; height: number }) => void;
}

const ScheduleCard = ({ task, onPress, style, onLayoutChange }: ScheduleCardProps) => {
  const { language } = useAppStore();
  const cardRef = useRef<View>(null);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });

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
          borderColor: Colors.main.textPrimary,
          backgroundColor: Colors.main.cardBackground,
          statusTextColor: Colors.main.textSecondary,
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
          setCardSize((prev) => {
            if (prev.width !== width || prev.height !== height) {
              onLayoutChange?.(task.id, { width, height });
              return { width, height };
            }
            return prev;
          });
        }}
        style={[
          styles.cardContainer,
          {
            backgroundColor: !isFinished ? Colors.main.cardBackground : Colors.main.border,
          },
          getBorderStyle(),
          style,
        ]}
      >
        <HStack style={styles.cardHeader}>
          <VStack style={{ flex: 1 }}>
            <Text numberOfLines={1}>{task.title}</Text>
            {task.description && task.description !== '' && <Text numberOfLines={2}>{task.description}</Text>}
          </VStack>
        </HStack>

        <HStack style={styles.cardFooter}>
          <HStack style={styles.timeContainer}>
            <Icon as={Clock} size="sm" color={Colors.main.textSecondary} />
            <Text
              style={[
                styles.timeText,
                { color: !isFinished ? Colors.main.textPrimary : Colors.main.textSecondary },
              ]}
            >
              {task.startTime} - {task.endTime}
            </Text>
          </HStack>
          {category && (
            <Text
              className="px-2 rounded-xl text-sm"
              style={{
                backgroundColor: isFinished
                  ? Colors.main.background
                  : category?.color
                    ? category.color + '40'
                    : Colors.main.border,
                color: Colors.main.textPrimary,
              }}
            >
              {language === 'fa' ? category?.fa ?? '' : category?.name ?? ''}
            </Text>
          )}
        </HStack>
      </Box>
    </Pressable>
  );
};

export default ScheduleCard;

const styles = StyleSheet.create({
  cardContainer: {
    minHeight: 78,
    minWidth: 230,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  cardHeader: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardFooter: {
    alignItems: 'center',
    justifyContent: 'space-between',
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
