import React from 'react';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { HStack } from '../ui/hstack';
import { Button } from '../ui/button';
import { TaskStatus } from '@/constants/TaskEnum';
import { Text } from '../Themed';
import { Task } from '@/types/database-type';

interface HiddenItemProps {
  item: Task;
  swipedRows: Set<string>;
  onCompleteTask: (item: Task) => void;
  onCancelTask: (item: Task) => void;
  size: { width: number; height: number };
}

const HiddenItem = React.memo(({ item, swipedRows, onCompleteTask, onCancelTask, size }: HiddenItemProps) => {
  const { language } = useAppStore();
  const isRowSwiped = swipedRows.has(item.id);

  if (!isRowSwiped) {
    return null;
  }

  const isFa = language === 'fa';

  return (
    <HStack
      className="items-center"
      style={{
        flexDirection: isFa ? 'row' : 'row-reverse',
        marginVertical: 4,
        width: size?.width || '100%',
        height: size?.height - 2 || 80,
      }}
    >
      <Button
        onPress={() => onCompleteTask(item)}
        disabled={item.status === TaskStatus.COMPLETED}
        className="h-full w-1/2"
        style={{
          backgroundColor: item.status === TaskStatus.COMPLETED ? Colors.main.border : Colors.main.primary,
          justifyContent: isFa ? 'flex-start' : 'flex-end',
          borderRadius: 0,
        }}
      >
        <Text
          style={{
            color: Colors.main.textPrimary,
            fontSize: 12,
            textAlign: isFa ? 'right' : 'left',
            paddingHorizontal: 10,
          }}
        >
          ✓ {isFa ? 'تکمیل' : 'Done'}
        </Text>
      </Button>

      <Button
        onPress={() => onCancelTask(item)}
        disabled={item.status === TaskStatus.CANCELLED}
        className="h-full w-1/2"
        style={{
          backgroundColor: item.status === TaskStatus.CANCELLED ? Colors.main.border : Colors.main.accent,
          justifyContent: isFa ? 'flex-end' : 'flex-start',
          borderRadius: 0,
        }}
      >
        <Text
          style={{
            color: Colors.main.textPrimary,
            fontSize: 12,
            textAlign: isFa ? 'left' : 'right',
            paddingHorizontal: 10,
          }}
        >
          ✖ {isFa ? 'لغو' : 'Canceled'}
        </Text>
      </Button>
    </HStack>
  );
});

export default HiddenItem;
