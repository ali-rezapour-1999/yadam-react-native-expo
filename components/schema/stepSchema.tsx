import z from 'zod';

export const StepOneSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string(),
  height: z.string().min(1),
  weight: z.string().min(1),
  age: z.string().min(1),
  gender: z.string(),
  description: z.string(),
});
