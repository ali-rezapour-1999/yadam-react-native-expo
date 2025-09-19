import React from 'react';
import { MotiView } from 'moti';
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
      className="w-full h-full items-center justify-between"
      style={{
        flexDirection: isFa ? 'row' : 'row-reverse',
      }}
    >
      <MotiView
        className="w-1/2 h-[90%]"
        style={{
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}
        from={{
          opacity: 0,
          translateX: isFa ? 50 : -50,
        }}
        animate={{
          opacity: isRowSwiped ? 1 : 0,
          translateX: isRowSwiped ? 0 : isFa ? 50 : -50,
        }}
        transition={{
          type: 'timing',
          duration: 100,
        }}
      >
        <Button
          onPress={() => onCompleteTask(item)}
          disabled={item.status === TaskStatus.COMPLETED}
          className="h-full w-full"
          style={{
            backgroundColor: item.status === TaskStatus.COMPLETED ? Colors.main.border : Colors.main.primary,
            justifyContent: isFa ? 'flex-start' : 'flex-end',
            borderRadius: 10,
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
      </MotiView>

      <MotiView
        className="w-1/2 h-[90%]"
        style={{
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}
        from={{
          opacity: 0,
          translateX: isFa ? -50 : 50,
        }}
        animate={{
          opacity: isRowSwiped ? 1 : 0,
          translateX: isRowSwiped ? 0 : isFa ? -50 : 50,
        }}
        transition={{
          type: 'timing',
          duration: 100,
        }}
      >
        <Button
          onPress={() => onCancelTask(item)}
          disabled={item.status === TaskStatus.CANCELLED}
          className="h-full w-full"
          style={{
            backgroundColor: item.status === TaskStatus.CANCELLED ? Colors.main.border : Colors.main.accent,
            justifyContent: isFa ? 'flex-end' : 'flex-start',
            borderRadius: 10,
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
      </MotiView>
    </HStack>
  );
});

export default HiddenItem;
