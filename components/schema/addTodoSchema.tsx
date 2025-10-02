import z from 'zod';
import { t } from 'i18next';

export const addTodoSchema = z.object({
  title: z.string().min(1, { message: t('event.append_title_required') }),
  startTime: z.string().min(1, { message: t('append_time_required') }),
  endTime: z.string().min(1, { message: t('append_time_required') }),
  status: z.string().optional(),
  topicId: z.string().optional(),
  goalId: z.string().optional(),
  date: z.string().min(1, { message: t('append_date_required') }),
  description: z.string().optional(),
  createdAt: z.string(),
  reminderDays: z.array(z.string()).optional(),
  isDeleted: z.boolean().optional(),
});

export type AddTodoSchemaType = z.infer<typeof addTodoSchema>;
