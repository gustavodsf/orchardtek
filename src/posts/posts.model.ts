import { z } from 'zod';

export const GetPostsSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((data) => !isNaN(Number(data)), 'id must be a numeric value')
      .transform(Number)
      .refine((num) => num > 0, 'id must be a positive number'),
  }),
});
