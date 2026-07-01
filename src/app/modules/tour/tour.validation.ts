import { z } from "zod";

export const tourTypeZodSchema = z.object({
  name: z.string()
}).strict();


export const createTourZodSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    images : z.string().array().optional(),
    location: z.string().optional(),
    costFrom: z.number().optional(),
    startDate: z.date().min(Date.now()).optional(),
    endDate: z.date().optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    included: z.string().array().optional(),
    excluded: z.string().array().optional(),
    amenities: z.string().array().optional(),
    tourPlan: z.string().array().optional(),
    maxGuest: z.number().optional(),
    minAge: z.number().optional(),
    division: z.string(),
    tourType: z.string(),
    deleteImages: z.string().array().optional()
}).strict()

export const updateTourZodSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    images : z.string().array().optional(),
    location: z.string().optional(),
    costFrom: z.number().optional(),
    startDate: z.string().optional().optional(),
    endDate: z.string().optional().optional(),
    tourType: z.string().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number().optional(),
    minAge: z.number().optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    deleteImages: z.array(z.string()).optional()
}).strict()