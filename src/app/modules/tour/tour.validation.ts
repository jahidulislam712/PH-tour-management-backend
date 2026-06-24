import { z } from "zod";

export const tourTypeZodSchema = z.object({
  name: z.string()
}).strict();
