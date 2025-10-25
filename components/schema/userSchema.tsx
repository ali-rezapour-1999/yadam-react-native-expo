import z from "zod";

export const UsernameSchema = z.object({
  firstName: z.string().min(1, { message: 'auth.first_name_needed' }),
  lastName: z.string().optional(),
});
