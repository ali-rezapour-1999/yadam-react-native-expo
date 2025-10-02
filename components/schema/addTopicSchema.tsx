import { t } from 'i18next';
import z from 'zod';

export const addTopicSchema = z.object({
  title: z.string().min(1, { message: t('activity.title_required') }),
  status: z.string().optional(),
  categoryId: z.string().min(1, { message: t('activity.category_required') }),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  likes: z.number().optional(),
  isPublic: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export type AddTopicSchemaType = z.infer<typeof addTopicSchema>;
