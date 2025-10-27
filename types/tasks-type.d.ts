import { Task, TaskWithCategory } from "./database-type";
import { TaskStatus } from "@/constants/enums/TaskEnum";

export interface LocalChangeStateType {
  isLoading: boolean;
  task: TaskWithCategory | null;
  tasks: TaskWithCategory[];
  todayTasks: TaskWithCategory[];
  allTaskByTopicId: Task[];
  selectedTask: Task | null;

  setTask: (task: Task) => void;

  loadTasks: (date: string, status?: TaskStatus) => Promise<void>;
  createTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  getCompletionPercentage: () => Promise<number>;
  getTaskById: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  getAllTask: () => Promise<Task[]>;

  getTodayAllTask: () => Promise<void>;
  getTaskByTopicIdAndDate: (categoryId: string) => Promise<void>;
  getTaskByTopicId: (categoryId: string) => Promise<void>;
}


export interface ServerChangeStateType {
  isLoading: boolean
  createWithAi: (description: string) => Promise<void>;
  createTaskByAi: (description: string) => Promise<void>;
}
