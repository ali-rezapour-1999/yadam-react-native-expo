import { Task } from '@/types/database-type';
import { useMemo, useCallback } from 'react';

export interface GroupedHour {
  hour: string;
  tasks: Task[];
}

export const useGroupedTodos = (todos: Task[]): GroupedHour[] => {
  const getHourFromTime = useCallback((timeString?: string): number => {
    if (!timeString) return 0;
    const [hour] = timeString.split(':').map(Number);
    return hour || 0;
  }, []);

  const getMinutesFromTime = useCallback((timeString?: string): number => {
    if (!timeString) return 0;
    const [h, m] = timeString.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }, []);

  const formatHourLabel = useCallback((hour: number): string => {
    return `${hour.toString().padStart(2, '0')}:00`;
  }, []);

  return useMemo(() => {
    if (!todos || todos.length === 0) {
      const currentHour = new Date().getHours();

      return [
        {
          hour: formatHourLabel(currentHour),
          tasks: [],
        },
      ];
    }

    const now = new Date();
    const currentHour = now.getHours();

    const tasksByHour = new Map<number, Task[]>();

    todos.forEach((todo) => {
      const taskHour = getHourFromTime(todo.startTime);
      if (!tasksByHour.has(taskHour)) {
        tasksByHour.set(taskHour, []);
      }
      tasksByHour.get(taskHour)!.push(todo);
    });

    tasksByHour.forEach((tasks) => {
      tasks.sort((a, b) => getMinutesFromTime(a.startTime) - getMinutesFromTime(b.startTime));
    });

    if (!tasksByHour.has(currentHour)) {
      tasksByHour.set(currentHour, []);
    }

    const groupedHours: GroupedHour[] = [];

    const sortedHours = Array.from(tasksByHour.keys()).sort((a, b) => a - b);

    for (const hour of sortedHours) {
      const tasks = tasksByHour.get(hour)!;
      groupedHours.push({
        hour: formatHourLabel(hour),
        tasks,
      });
    }

    return groupedHours;
  }, [todos, getHourFromTime, getMinutesFromTime, formatHourLabel]);
};
