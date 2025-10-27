import { generateTasksWithAi, generateTaskAi } from '@/api/aiRequest';
import { ServerChangeStateType } from '@/types/tasks-type';
import { create } from 'zustand';
import { useUserState } from '../authState/userState';
import { useLocalChangeTaskStore } from './localChange';

export const useServerChangeTaskStore = create<ServerChangeStateType>((set) => ({
  isLoading: false,

  createWithAi: async (description: string | undefined) => {
    set({ isLoading: true });

    try {
      const tasks = await generateTasksWithAi(
        description,
        useUserState.getState().token as string
      );
      if (tasks.success) {
        tasks.data.forEach((task: any) => {
          useLocalChangeTaskStore.getState().createTask(task);
        });
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createTaskByAi: async (description: string) => {
    set({ isLoading: true });
    try {
      const task = await generateTaskAi(description, useUserState.getState().token as string);
      if (task.success) {
        useLocalChangeTaskStore.getState().createTask(task.data);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

}));


