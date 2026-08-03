import { z } from "zod";

export const challengeStatusSchema = z.enum(["live", "exit", "funded"]);

export const challengeSchema = z.object({
  id:              z.string(),
  title:           z.string().min(1, "Title is required"),
  institution:     z.string().min(1, "Institution is required"),
  dateOfEvent:     z.string().min(1, "Date of event is required"),
  registrations:   z.number().int().min(0),
  maxRegistrations: z.number().int().min(1),
  status:          challengeStatusSchema,
  createdAt:       z.string().optional(),
});

export const createChallengeSchema = z.object({
  title:            z.string().min(1, "Title is required"),
  institution:      z.string().min(1, "Institution is required"),
  dateOfEvent:      z.string().min(1, "Date of event is required"),
  maxRegistrations: z.number({ required_error: "Max registrations is required" }).int().min(1),
});

export const updateChallengeSchema = createChallengeSchema.partial();

export type Challenge            = z.infer<typeof challengeSchema>;
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeInput = z.infer<typeof updateChallengeSchema>;
