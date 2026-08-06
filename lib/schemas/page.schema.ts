import { z } from "zod";

export const pageStatusSchema = z.enum(["live", "flagged"]);

export const fundraisingPageSchema = z.object({
  id:          z.string(),
  slug:        z.string().min(1),
  creator:     z.string(),
  institution: z.string(),
  raised:      z.number().min(0),
  goal:        z.number().min(1),
  status:      pageStatusSchema,
  tags:        z.array(z.string()).default([]),
  createdAt:   z.string().optional(),
});

export const pageCampaignSchema = z.object({
  id:              z.string(),
  rank:            z.number().int().min(1),
  title:           z.string(),
  raised:          z.number().min(0),
  goal:            z.number().min(1),
  raisedFormatted: z.string(),
  enabled:         z.boolean(),
});

export const reorderCampaignsSchema = z.object({
  orderedIds: z.array(z.string()).min(1, "At least one campaign required"),
});

export type FundraisingPage      = z.infer<typeof fundraisingPageSchema>;
export type PageCampaign         = z.infer<typeof pageCampaignSchema>;
export type ReorderCampaignsInput = z.infer<typeof reorderCampaignsSchema>;
