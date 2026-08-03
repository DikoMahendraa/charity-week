import { z } from "zod";

export const institutionStatusSchema = z.enum(["invited", "live", "exit", "funded"]);

export const institutionSchema = z.object({
  id:        z.string(),
  name:      z.string().min(1, "Institution name is required"),
  type:      z.string().min(1, "Type is required"),
  region:    z.string().min(1, "Region is required"),
  tags:      z.array(z.string()).default([]),
  status:    institutionStatusSchema,
  createdAt: z.string().optional(),
});

export const createInstitutionSchema = institutionSchema.omit({ id: true, createdAt: true });

export const updateInstitutionSchema = createInstitutionSchema.partial();

export const institutionListResponseSchema = z.object({
  data:  z.array(institutionSchema),
  total: z.number(),
  page:  z.number(),
  limit: z.number(),
});

export type Institution             = z.infer<typeof institutionSchema>;
export type CreateInstitutionInput  = z.infer<typeof createInstitutionSchema>;
export type UpdateInstitutionInput  = z.infer<typeof updateInstitutionSchema>;
export type InstitutionListResponse = z.infer<typeof institutionListResponseSchema>;
