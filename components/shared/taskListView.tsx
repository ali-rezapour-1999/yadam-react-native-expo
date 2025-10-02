import React, { useCallback, useState } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { FlatList } from 'react-native';
import { useGroupedTodos } from '@/hooks/useGroupedTodos';
import ScheduleCard from './card/scheduleCard';
import HiddenItem from '../common/hiddenItem';
import HourlyRow from '../common/hourlyRow';
import { useTodoStore } from '@/store/todoState';
import { TaskStatus } from '@/constants/TaskEnum';
import { router } from 'expo-router';
import { Loading } from '../common/loading';
import { Task } from '@/types/database-type';

interface TaskListViewProps {
  mode: 'flat' | 'grouped';
  enableSwipeActions?: boolean;
}

const ROW_HEIGHT = 80;

const TaskListView = ({ mode, enableSwipeActions = true }: TaskListViewProps) => {
  const { isLoading, updateTask, todayTasks, tasks } = useTodoStore();
  const groupedTodos = useGroupedTodos(mode === 'grouped' ? tasks : []);
  const [swipedRows, setSwipedRows] = useState<Set<string>>(new Set());

  const handleUpdateTaskStatus = useCallback(
    async (task: Task, newStatus: TaskStatus) => {
      try {
        await updateTask({ ...task, status: newStatus });
        setSwipedRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(task.id);
          return newSet;
        });
      } catch (error) {
        console.error(`Error updating task status to ${newStatus}:`, error);
      }
    },
    [updateTask],
  );

  const handleCompleteTask = useCallback((task: Task) => handleUpdateTaskStatus(task, TaskStatus.COMPLETED), [handleUpdateTaskStatus]);

  const handleCancelTask = useCallback((task: Task) => handleUpdateTaskStatus(task, TaskStatus.CANCELLED), [handleUpdateTaskStatus]);

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <ScheduleCard
        task={item}
        onPress={() => router.push(`/tabs/(tabs)/tasks/detail/${item.id}`)}
        style={{
          marginVertical: 4,
          borderRadius: 0,
        }}
      />
    ),
    [],
  );

  const renderHiddenItemWrapper = useCallback(
    ({ item }: { item: Task }) => <HiddenItem item={item} swipedRows={swipedRows} onCompleteTask={handleCompleteTask} onCancelTask={handleCancelTask} />,
    [swipedRows, handleCompleteTask, handleCancelTask],
  );

  const renderGroupedItem = useCallback(
    ({ item }: { item: any }) => <HourlyRow hour={item.hour} tasks={item.tasks} isCurrentHour={item.hour.split(':')[0] === new Date().getHours().toString().padStart(2, '0')} />,
    [],
  );

  const handleRowOpen = useCallback((rowKey: string) => setSwipedRows((prev) => new Set(prev).add(rowKey)), []);

  const handleRowClose = useCallback(() => setSwipedRows(new Set()), []);

  if (isLoading) {
    return <Loading style={{ marginVertical: 40 }} />;
  }

  /** --- Flat mode --- */
  if (mode === 'flat') {
    return (
      <SwipeListView
        data={todayTasks}
        renderItem={renderItem}
        renderHiddenItem={enableSwipeActions ? renderHiddenItemWrapper : undefined}
        leftOpenValue={100}
        rightOpenValue={-100}
        keyExtractor={(item) => item.id}
        onRowOpen={handleRowOpen}
        onRowClose={handleRowClose}
        disableLeftSwipe={!enableSwipeActions}
        disableRightSwipe={!enableSwipeActions}
        closeOnRowBeginSwipe
        closeOnRowPress={false}
        initialNumToRender={10}
        swipeToOpenPercent={30}
        swipeToClosePercent={30}
      />
    );
  }

  /** --- Grouped mode --- */
  if (mode === 'grouped') {
    return (
      <FlatList
        data={groupedTodos}
        renderItem={renderGroupedItem}
        keyExtractor={(item) => item.hour}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
        getItemLayout={(_, index) => ({
          length: ROW_HEIGHT,
          offset: ROW_HEIGHT * index,
          index,
        })}
      />
    );
  }

  return null;
};

export default TaskListView;
