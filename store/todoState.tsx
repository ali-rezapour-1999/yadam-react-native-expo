import { TaskStatus } from '@/constants/TaskEnum';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskWithCategory } from '@/types/database-type';
import { taskStorage } from '@/storage/database';

export interface TodoState {
  task: TaskWithCategory | null;
  tasks: TaskWithCategory[];
  todayTasks: TaskWithCategory[];
  allTaskByTopicId: Task[];
  selectedDate: string;
  isLoading: boolean;
  selectedTask: Task | null;
  isEditDrawerOpen: boolean;
  today: string;

  setSelectedDate: (date: string) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;
  setEditDrawerOpen: (open: boolean) => void;

  loadTasks: (date: string, status?: TaskStatus) => Promise<void>;
  createTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  getCompletionPercentage: () => Promise<number>;
  getTaskById: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;

  getTodayAllTask: () => Promise<void>;
  getTaskByTopicIdAndDate: (categoryId: string) => Promise<void>;
  getTaskByTopicId: (categoryId: string) => Promise<void>;
}

const getCurrentDate = (): string => new Date().toISOString().split('T')[0];

export const useTodoStore = create<TodoState>((set, get) => ({
  task: null,
  tasks: [],
  todayTasks: [],
  allTaskByTopicId: [],
  selectedDate: getCurrentDate(),
  today: getCurrentDate(),
  isLoading: false,
  selectedTask: null,
  isEditDrawerOpen: false,

  setSelectedDate: async (date: string) => {
    set({ selectedDate: date });
    await get().loadTasks(date);
  },

  setSelectedTask: (task: Task | null) => {
    set({ selectedTask: task });
  },

  setEditDrawerOpen: (open: boolean) => {
    const state = get();
    set({
      isEditDrawerOpen: open,
      selectedTask: open ? state.selectedTask : null,
    });
  },

  loadTasks: async (date: string, status?: TaskStatus) => {
    try {
      let tasks: Task[] = [];
      if (status) {
        tasks = await taskStorage.loadTasksByDateStatus(date, status);
      } else {
        tasks = await taskStorage.loadTasksByDateStatus(date);
      }
      set({ tasks });
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  },

  createTask: async (task: Task) => {
    set({ isLoading: true });
    try {
      const state = get();
      await taskStorage.createTask(task);
      if (task.reminderDays && task.reminderDays.length > 0) {
        const baseDate = new Date(task.date);
        for (let i = 1; i <= 7; i++) {
          const nextDate = new Date(baseDate);
          nextDate.setDate(baseDate.getDate() + i);
          const weekdayName = nextDate.toLocaleDateString('en-US', { weekday: 'long' });
          if (task.reminderDays.includes(weekdayName) && nextDate.toISOString().split('T')[0] !== task.date) {
            const clonedTask: Task = {
              ...task,
              id: uuidv4(),
              date: nextDate.toISOString().split('T')[0],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await taskStorage.createTask(clonedTask);
          }
        }
      }
      await state.loadTasks(task.date);
      await state.getTodayAllTask();
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to create task:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateTask: async (task: Task) => {
    set({ isLoading: true });
    try {
      await taskStorage.updateTask(task);
      const state = get();
      await state.loadTasks(task.date);
      await state.getTodayAllTask();
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to update task:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getCompletionPercentage: async () => {
    const validTasks = await taskStorage.loadTasksByDateStatus(getCurrentDate());
    const completedTasks = await taskStorage.loadTasksByDateStatus(getCurrentDate(), TaskStatus.COMPLETED);
    if (validTasks.length === 0) return 0;
    return Math.round((completedTasks.length / validTasks.length) * 100);
  },

  getTodayAllTask: async () => {
    try {
      const tasks = await taskStorage.loadTasksByDateStatus(getCurrentDate());
      set({ todayTasks: tasks });
    } catch (error) {
      console.error('Failed to load today tasks:', error);
    }
  },

  getTaskByTopicIdAndDate: async (categoryId: string) => {
    set({ isLoading: true });
    try {
      const tasks = await taskStorage.loadTasksByDateTopic(getCurrentDate(), categoryId);
      set({ todayTasks: tasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to load today tasks:', error);
    }
  },

  getTaskByTopicId: async (categoryId: string) => {
    set({ isLoading: true });
    try {
      const tasks = await taskStorage.loadTasksByTopicId(categoryId);
      set((state) => {
        if (JSON.stringify(state.allTaskByTopicId) === JSON.stringify(tasks)) {
          return { isLoading: false };
        }
        return { allTaskByTopicId: tasks, isLoading: false };
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to load today tasks:', error);
    }
  },

  getTaskById: async (id: string) => {
    set({ isLoading: true });
    try {
      const task = await taskStorage.getTaskById(id);
      set({ task, isLoading: false });
    } catch (error) {
      console.error('Failed to load task:', error);
      set({ isLoading: false });
    }
  },

  removeTask: async (id: string) => {
    set({ isLoading: true });
    try {
      await taskStorage.removeTask(id);
      const state = get();
      await state.loadTasks(state.selectedDate);
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to remove task:', error);
      set({ isLoading: false });
    }
  },
}));
