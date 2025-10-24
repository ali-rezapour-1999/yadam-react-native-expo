import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { addTodoSchema, AddTodoSchemaType } from '@/components/schema/addTodoSchema';
import { TaskStatus } from '@/constants/enums/TaskEnum';
import { router } from 'expo-router';
import { Task } from '@/types/database-type';
import { useGenerateNumericId } from './useGenerateId';
import { useLocalChangeTaskStore } from '@/store/taskState/localChange';
import { useUserState } from '@/store/authState/userState';

interface Props {
  selectedDate: string;
  topicNumber?: string;
  task?: Task | null;
}

export const useTaskForm = ({ selectedDate, task, topicNumber }: Props) => {
  const { createTask, updateTask } = useLocalChangeTaskStore();
  const user = useUserState().user;
  const id = useGenerateNumericId();

  const isEditMode = Boolean(task?.id);

  const form = useForm<AddTodoSchemaType>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: {
      title: task?.title || '',
      startTime: task?.startTime || '',
      endTime: task?.endTime || '',
      description: task?.description || '',
      topicId: isEditMode ? task?.topicId || '' : topicNumber || '',
      goalId: task?.goalId || '',
      date: task?.date || selectedDate,
      createdAt: task?.createdAt || new Date().toISOString(),
      reminderDays: task?.reminderDays || [],
      isDeleted: task?.isDeleted || false,
    },
    mode: 'onSubmit',
  });

  const { reset } = form;

  useEffect(() => {
    if (isEditMode && task) {
      reset({
        title: task.title,
        startTime: task.startTime,
        endTime: task.endTime,
        description: task.description,
        topicId: task.topicId,
        goalId: task.goalId,
        date: task.date,
        createdAt: task.createdAt,
        reminderDays: task.reminderDays || [],
        isDeleted: task.isDeleted || false,
      });
    } else {
      const now = new Date();
      const endTime = new Date(now.getTime() + 10 * 60 * 1000);
      const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      reset({
        title: '',
        startTime: formatTime(now),
        endTime: formatTime(endTime),
        description: '',
        topicId: topicNumber || '',
        goalId: '',
        date: selectedDate,
        createdAt: now.toISOString(),
        reminderDays: [],
        isDeleted: false,
      });
    }
  }, [reset, selectedDate, task, isEditMode, topicNumber]);

  const onSubmit = useCallback(
    async (data: AddTodoSchemaType) => {
      try {
        const todoData = {
          id: isEditMode ? task!.id : id,
          userId: user?.id as string,
          title: data.title.trim(),
          description: data.description?.trim() || '',
          startTime: data.startTime,
          endTime: data.endTime,
          date: data.date,
          status: task?.status ?? TaskStatus.PENDING,
          topicId: data.topicId ?? '',
          goalId: data.goalId ?? '',
          createdAt: data.createdAt,
          updatedAt: new Date().toISOString(),
          reminderDays: data.reminderDays?.map(String),
          isDeleted: data.isDeleted || false,
        };

        console.log('todoData', todoData);
        if (isEditMode) {
          await updateTask(todoData);
        } else {
          await createTask(todoData);
        }

        reset();
        router.push('/tabs/(tabs)/tasks');
      } catch (error) {
        console.error('Error saving task:', error);
      }
    },
    [createTask, updateTask, reset, task, isEditMode, user],
  );

  const onDelete = useCallback(async () => {
    try {
      if (isEditMode && task) {
        router.push('/tabs/(tabs)/tasks');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [isEditMode, task]);

  return {
    form,
    onSubmit,
    onDelete,
    isEditMode,
  };
};
