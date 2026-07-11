import z from "zod";

export const createDivisionZodValidation = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  thumbnail: z.string().optional()  
}).strict()

export const updateDivisionZodValidation = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional()  
}).strict()