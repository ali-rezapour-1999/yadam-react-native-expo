import React, { useCallback, useState } from "react";
import { SwipeListView } from "react-native-swipe-list-view";
import { useGroupedTodos } from "@/hooks/useGroupedTodos";
import ScheduleCard from "./card/scheduleCard";
import HiddenItem from "../common/hiddenItem";
import HourlyRow from "../common/hourlyRow";
import { useTodoStore } from "@/store/todoState";
import { TaskStatus } from "@/constants/enums/TaskEnum";
import { router } from "expo-router";
import { Loading } from "../common/loading";
import { Task } from "@/types/database-type";
import Animated from "react-native-reanimated";
import { useAppStore } from "@/store/authState/authState";
import { useScrollHandler } from "@/hooks/useScrollHandler";
interface TaskListViewProps {
  mode: "flat" | "grouped";
  enableSwipeActions?: boolean;
}

const ROW_HEIGHT = 80;

const TaskListView = ({
  mode,
  enableSwipeActions = true,
}: TaskListViewProps) => {
  const { isLoading, updateTask, todayTasks, tasks } = useTodoStore();
  const groupedTodos = useGroupedTodos(mode === "grouped" ? tasks : []);
  const [swipedRows, setSwipedRows] = useState<Set<string>>(new Set());
  const [cardSizes, setCardSizes] = useState<Record<string, { width: number; height: number }>>({});
  const { handleScroll } = useScrollHandler();
  const { hideScroll } = useAppStore();

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
    [updateTask]
  );

  const handleCardLayout = useCallback(
    (id: string, layout: { width: number; height: number }) => {
      setCardSizes((prev) => ({ ...prev, [id]: layout }));
    },
    []
  );

  const handleCompleteTask = useCallback(
    (task: Task) => handleUpdateTaskStatus(task, TaskStatus.COMPLETED),
    [handleUpdateTaskStatus]
  );

  const handleCancelTask = useCallback(
    (task: Task) => handleUpdateTaskStatus(task, TaskStatus.CANCELLED),
    [handleUpdateTaskStatus]
  );

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <ScheduleCard
        task={item}
        onPress={() => router.push(`/tabs/(tabs)/tasks/detail/${item.id}`)}
        onLayoutChange={handleCardLayout}
        style={{
          marginVertical: 2,
          borderRadius: 10,
        }}
      />
    ),
    [handleCardLayout]
  );

  const renderHiddenItemWrapper = useCallback(
    ({ item }: { item: Task }) => (
      <HiddenItem
        item={item}
        swipedRows={swipedRows}
        onCompleteTask={handleCompleteTask}
        onCancelTask={handleCancelTask}
        size={cardSizes[item.id]}
      />
    ),
    [swipedRows, handleCompleteTask, handleCancelTask]
  );

  const renderGroupedItem = useCallback(
    ({ item }: { item: any }) => (
      <HourlyRow
        hour={item.hour}
        tasks={item.tasks}
        isCurrentHour={
          item.hour.split(":")[0] ===
          new Date().getHours().toString().padStart(2, "0")
        }
      />
    ),
    []
  );

  const handleRowOpen = useCallback(
    (rowKey: string) => setSwipedRows((prev) => new Set(prev).add(rowKey)),
    []
  );

  const handleRowClose = useCallback(() => setSwipedRows(new Set()), []);

  if (isLoading) {
    return <Loading style={{ marginVertical: 40 }} />;
  }

  if (mode === "flat") {
    return (
      <SwipeListView
        data={todayTasks}
        renderItem={renderItem}
        renderHiddenItem={
          enableSwipeActions ? renderHiddenItemWrapper : undefined
        }
        className="px-4"
        leftOpenValue={100}
        rightOpenValue={-100}
        keyExtractor={(item) => item.id}
        onRowOpen={handleRowOpen}
        onRowClose={handleRowClose}
        disableLeftSwipe={!enableSwipeActions}
        disableRightSwipe={!enableSwipeActions}
        closeOnRowBeginSwipe={false}
        closeOnRowPress={false}
        initialNumToRender={10}
        swipeToOpenPercent={30}
        swipeToClosePercent={30}
        onScroll={handleScroll}
        contentContainerStyle={{
          marginBottom: 20,
          paddingRight: 16,
          paddingBottom: hideScroll ? 120 : 70,
        }}
      />
    );
  }

  /** --- Grouped mode --- */
  if (mode === "grouped") {
    return (
      <Animated.FlatList
        nestedScrollEnabled
        scrollEventThrottle={16}
        data={groupedTodos}
        renderItem={renderGroupedItem}
        keyExtractor={(item) => item.hour}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginBottom: 80 }}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={15}
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
