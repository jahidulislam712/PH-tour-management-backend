import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
      .string({error: "Name is required."})
      .min(2, {error: "Name must be at least 2 characters long."})
      .max(50, {error: "Name cannot exceed 50 characters."}),
  email: z.email({pattern: z.regexes.email}),
  password: z
          .string({error: "Password must be string."})
          .min(8, {error: "Password must be at least 8 characters long."})
          .regex(/[A-Z]/, {
            error: "Password must contain at least one uppercase letter.",
          })
          .regex(/[a-z]/, {
            error: "Password must contain at least one lowercase letter.",
          })
          .regex(/[0-9]/, {
            error: "Password must contain at least one number.",
          })
          .regex(/[@$!%*?&]/, {
            error: "Password must contain at least one special character.",
          }),
  phone: z
        .string({error: "Phone Number must be string"})
        .regex(/^(?:\+880|880|0)1[3-9]\d{8}$/, {
          error: "Phone Number must be a valid Bangladesh mobile number.",
        })
        .optional(),
  address: z
          .string({error: "Address must be string"})
          .max(200, {error: "Address cannot exceed 200 chracters"})
          .optional()
}
)

export const updateUserZodSchema = z.object({
  name: z
      .string({error: "Name is required."})
      .min(2, {error: "Name must be at least 2 characters long."})
      .max(50, {error: "Name cannot exceed 50 characters."})
      .optional(),
  phone: z
        .string({error: "Phone Number must be string"})
        .regex(/^(?:\+880|880|0)1[3-9]\d{8}$/, {
          error: "Phone Number must be a valid Bangladesh mobile number.",
        })
        .optional(),
  role: z
        .enum(Object.values(Role))
        .optional(),
  isDelete: z
            .boolean({error: "isDeleted must be true or false"})
            .optional(),
  isVerified: z
            .boolean({error: "isDeleted must be true or false"})
            .optional(),
  isActive: z
            .enum(Object.values(IsActive))
            .optional(),
  address: z
          .string({error: "Address must be string"})
          .max(200, {error: "Address cannot exceed 200 chracters"})
          .optional()
})