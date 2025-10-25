import { Task } from "@/types/database-type";
import { taskStorage } from "@/storage/database";
import { useGenerateNumericId } from "@/hooks/useGenerateId";

const unifiedDayMap: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,

  "دوشنبه": 1,
  "سه‌شنبه": 2,
  "چهارشنبه": 3,
  "پنجشنبه": 4,
  "جمعه": 5,
  "شنبه": 6,
  "یکشنبه": 7,
};

export const generateReminderTasks = async (task: Task) => {
  if (!task.reminderDays?.length) return;
  if (!task.date) return;

  const baseDate = new Date(task.date + "T00:00:00");
  if (isNaN(baseDate.getTime())) return;

  const baseJsDay = baseDate.getDay();
  const baseIso = baseJsDay === 0 ? 7 : baseJsDay;

  const isoDays = Array.from(
    new Set(
      task.reminderDays
        .map((d) => {
          if (typeof d === "number" && d >= 1 && d <= 7) return d;
          if (typeof d === "string") {
            const trimmed = d.trim();
            const cap = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            return unifiedDayMap[trimmed] ?? unifiedDayMap[cap] ?? null;
          }
          return null;
        })
        .filter((n): n is number => n !== null)
    )
  ).sort((a, b) => a - b);

  for (const isoDay of isoDays) {
    const delta = (isoDay - baseIso + 7) % 7;
    if (delta < 0) continue;

    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() + delta + 1);
    const targetDateStr = targetDate.toISOString().split("T")[0];

    console.log(
      `[generateReminderTasks] isoDay: ${isoDay}, delta: ${delta}, targetDate: ${targetDateStr}, baseDate: ${baseDate.toISOString().split("T")[0]}`
    );

    try {
      const existing = await taskStorage.loadTasksByDateStatus(targetDateStr);
      const isDup = existing.some(
        (t) =>
          !t.isDeleted &&
          t.userId === task.userId &&
          t.title === task.title &&
          t.startTime === task.startTime &&
          t.endTime === task.endTime
      );
      if (isDup) continue;

      const clonedTask: Task = {
        ...task,
        id: useGenerateNumericId(),
        date: targetDateStr,
        parentId: task.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await taskStorage.createTask(clonedTask);
      console.log(`[generateReminderTasks] Created task for ${targetDateStr}`);
    } catch (err) {
      console.error("[generateReminderTasks] create failed for", err);
    }
  }
};
