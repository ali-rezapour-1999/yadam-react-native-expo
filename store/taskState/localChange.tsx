import { create } from "zustand";
import { TaskStatus } from "@/constants/enums/TaskEnum";
import { Task } from "@/types/database-type";
import { taskStorage } from "@/storage/database";
import { LocalChangeStateType } from "@/types/tasks-type";
import { useUserState } from "../authState/userState";
import { useBaseStore } from "../baseState/base";
import { generateReminderTasks } from "./generateReminderTask";

// 🕒 Utility: Get current date in YYYY-MM-DD
const getCurrentDate = (): string => new Date().toISOString().split("T")[0];


export const useLocalChangeTaskStore = create<LocalChangeStateType>((set, get) => ({
  // ====== STATE ======
  task: null,
  tasks: [],
  todayTasks: [],
  allTaskByTopicId: [],
  selectedTask: null,
  isLoading: false,

  // ====== SIMPLE SETTERS ======
  setTask: async (data: Task) => set({ task: data }),

  // ====== LOADERS ======
  loadTasks: async (date: string, status?: TaskStatus) => {
    try {
      const tasks = status
        ? await taskStorage.loadTasksByDateStatus(date, status)
        : await taskStorage.loadTasksByDateStatus(date);
      set({ tasks });
    } catch (error) {
      console.error("❌ Failed to load tasks:", error);
    }
  },

  getAllTask: async (): Promise<Task[]> => {
    try {
      const userId = useUserState.getState().user?.id as string;
      return await taskStorage.getAllTaskByUserId(userId);
    } catch (error) {
      console.error("❌ Failed to load all tasks:", error);
      return [];
    }
  },


  // ====== CREATE ======
  createTask: async (task: Task) => {
    set({ isLoading: true });
    try {
      await taskStorage.createTask(task);
      await generateReminderTasks(task);
      await get().loadTasks(task.date);
      await get().getTodayAllTask();
    } catch (error) {
      console.error("❌ Failed to create task:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ====== UPDATE ======
  updateTask: async (task: Task) => {
    set({ isLoading: true });
    try {
      await taskStorage.updateTask(task);
      await generateReminderTasks(task);
      await get().loadTasks(task.date);
      await get().getTodayAllTask();
    } catch (error) {
      console.error("❌ Failed to update task:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ====== REMOVE ======
  removeTask: async (id: string) => {
    set({ isLoading: true });
    try {
      await taskStorage.removeTask(id);
      const selectedDate = useBaseStore.getState().selectedDate;
      await get().loadTasks(selectedDate);
    } catch (error) {
      console.error("❌ Failed to remove task:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ====== CALCULATIONS ======
  getCompletionPercentage: async () => {
    const today = getCurrentDate();
    const validTasks = await taskStorage.loadTasksByDateStatus(today);
    const completedTasks = await taskStorage.loadTasksByDateStatus(today, TaskStatus.COMPLETED);

    if (validTasks.length === 0) return 0;
    return Math.round((completedTasks.length / validTasks.length) * 100);
  },

  // ====== GETTERS ======
  getTodayAllTask: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskStorage.loadTasksByDateStatus(getCurrentDate());
      set({ todayTasks: tasks });
    } catch (error) {
      console.error("❌ Failed to load today tasks:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getTaskByTopicIdAndDate: async (topicId: string) => {
    set({ isLoading: true });
    try {
      const tasks = await taskStorage.loadTasksByDateTopic(getCurrentDate(), topicId);
      set({ todayTasks: tasks });
    } catch (error) {
      console.error("❌ Failed to load tasks by topic/date:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getTaskByTopicId: async (topicId: string) => {
    set({ isLoading: true });
    try {
      const tasks = await taskStorage.loadTasksByTopicId(topicId);
      set((state) =>
        JSON.stringify(state.allTaskByTopicId) === JSON.stringify(tasks)
          ? { isLoading: false }
          : { allTaskByTopicId: tasks, isLoading: false }
      );
    } catch (error) {
      console.error("❌ Failed to load tasks by topic:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getTaskById: async (id: string) => {
    set({ isLoading: true });
    try {
      const task = await taskStorage.getTaskById(id);
      set({ task });
    } catch (error) {
      console.error("❌ Failed to load task by ID:", error);
    } finally {
      set({ isLoading: false });
    }
  },

}));
