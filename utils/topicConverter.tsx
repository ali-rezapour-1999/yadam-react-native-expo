import { TopicWithCount } from '@/types/database-type';

interface TopicBackend {
  id: string;
  title: string;
  description: string;
  category_id?: number | null;
  is_public: boolean;
  likes?: number;
  status?: string;
  created_at: string;
  updated_at: string;
  tasksCount: number
  user_id: string
}

export const mapTopicFromBackend = (topic: TopicBackend): TopicWithCount => ({
  id: topic.id,
  title: topic.title,
  description: topic.description || "",
  categoryId: topic.category_id?.toString(),
  isPublic: topic.is_public,
  status: topic.status || "active",
  likes: topic.likes ?? 0,
  createdAt: topic.created_at,
  updatedAt: topic.updated_at,
  tasksCount: topic.tasksCount,
  userId: topic.user_id
});
