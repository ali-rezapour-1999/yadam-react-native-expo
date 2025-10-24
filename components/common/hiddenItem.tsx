import React from 'react';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/authState/authState';
import { HStack } from '../ui/hstack';
import { Button } from '../ui/button';
import { TaskStatus } from '@/constants/enums/TaskEnum';
import { Text } from '../Themed';
import { Task } from '@/types/database-type';
import { CheckCheck, X } from 'lucide-react-native';
import { Icon } from '../ui/icon';

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
      className="items-center justify-between"
      style={{
        flexDirection: isFa ? 'row' : 'row-reverse',
        marginVertical: 4,
        width: size?.width || "100%",
        height: size?.height - 5,
      }}
    >
      <Button
        onPress={() => onCompleteTask(item)}
        disabled={item.status === TaskStatus.COMPLETED}
        className="h-full w-1/5 justify-center"
        style={{
          backgroundColor: item.status === TaskStatus.COMPLETED ? Colors.main.border : Colors.main.primary,
          borderRadius: 16,
        }}
      >
        <Icon as={CheckCheck} size="3xl" color={Colors.main.background} />
      </Button>

      <Button
        onPress={() => onCancelTask(item)}
        disabled={item.status === TaskStatus.CANCELLED}
        className="h-full w-1/5 justify-center"
        style={{
          backgroundColor: item.status === TaskStatus.CANCELLED ? Colors.main.border : Colors.main.accent,
          borderRadius: 16,
        }}
      >
        <Icon as={X} size="3xl" color={Colors.main.background} />
      </Button>
    </HStack>
  );
});

export default HiddenItem;
