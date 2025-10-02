import { Task } from "@/types/database-type";

function normalizeTime(time: string): string {
  if (!time) return time;
  return time.length === 8 ? time.slice(0, 5) : time;
}

export function mapStatusToRN(status: string): string {
  switch (status) {
    case "DONE":
      return "COMPLETED";
    case "SKIPPED":
      return "CANCELLED";
    default:
      return "PENDING";
  }
}

export function mapTaskFromBackend(djangoTask: any): Task {
  return {
    id: String(djangoTask.id),
    title: djangoTask.title,
    description: djangoTask.description || undefined,
    startTime: normalizeTime(djangoTask.start_time),
    endTime: normalizeTime(djangoTask.end_time),
    date: djangoTask.date,
    status: mapStatusToRN(djangoTask.status),
    reminderDays: djangoTask.reminder_days || [],
    topicId: djangoTask.topic_id || undefined,
    goalId: djangoTask.goal_id || undefined,
    userId: String(djangoTask.user_id),
    isDeleted: false,
    createdAt: djangoTask.created_at,
    updatedAt: djangoTask.updated_at,
  };
}
