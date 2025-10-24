import { TaskStatus } from '@/constants/enums/TaskEnum';

// Base Entity Interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Category Interface
export interface Category extends BaseEntity {
  title: string;
  description?: string;
  isPublic: boolean;
  status?: string;
  likes: number;
}

// Topic Interface (for backward compatibility)
export interface Topic extends BaseEntity {
  title: string;
  description: string;
  categoryId?: string;
  isPublic: boolean;
  status?: string;
  likes: number;
  isDeleted?: boolean;
}

export interface TopicWithCount extends Topic {
  tasksCount: number;
}

// Task Interface
export interface Task extends BaseEntity {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  status: TaskStatus | string;
  reminderDays?: string[];
  topicId?: string;
  goalId?: string;
  isDeleted?: boolean;
}

// Combined Task with Category Info
export interface TaskWithCategory extends Task {
  topicsTitle?: string;
  topicsCategoryId?: string;
}
