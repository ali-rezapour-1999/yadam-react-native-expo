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
}

const HiddenItem = React.memo(({ item, swipedRows, onCompleteTask, onCancelTask }: HiddenItemProps) => {
  const { language } = useAppStore();
  const isRowSwiped = swipedRows.has(item.id);

  if (!isRowSwiped) {
    return null;
  }

  const isFa = language === 'fa';

  return (
    <HStack
      className="w-full h-full items-center"
      style={{
        flexDirection: isFa ? 'row' : 'row-reverse',
      }}
    >
      <Button
        onPress={() => onCompleteTask(item)}
        disabled={item.status === TaskStatus.COMPLETED}
        className="h-[90%] w-1/2"
        style={{
          backgroundColor: item.status === TaskStatus.COMPLETED ? Colors.main.border : Colors.main.primary,
          justifyContent: isFa ? 'flex-start' : 'flex-end',
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
          ✔ {isFa ? 'تکمیل' : 'Done'}
        </Text>
      </Button>

      <Button
        onPress={() => onCancelTask(item)}
        disabled={item.status === TaskStatus.CANCELLED}
        className="h-[90%] w-1/2"
        style={{
          backgroundColor: item.status === TaskStatus.CANCELLED ? Colors.main.border : Colors.main.accent,
          justifyContent: isFa ? 'flex-end' : 'flex-start',
        }}
      >
        <Text
          style={{
            color: Colors.main.textPrimary,
            fontSize: 12,
            textAlign: isFa ? 'left' : 'right',
          }}
        >
          ✖ {isFa ? 'لغو' : 'Canceled'}
        </Text>
      </Button>
    </HStack>
  );
});

export default HiddenItem;
