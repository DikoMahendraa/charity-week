import { z } from "zod";

export const giftAidSchema  = z.enum(["yes", "no"]);
export const donorTabSchema = z.enum(["donations", "page-created", "per-challenge", "institution-level"]);

export const donorSchema = z.object({
  id:       z.string(),
  reportId: z.string(),
  date:     z.string(),
  amount:   z.string(),
  donor:    z.string(),
  comment:  z.string().optional(),
  giftAid:  giftAidSchema,
  page:     z.string(),
  tags:     z.array(z.string()).default([]),
});

export const donationSchema = z.object({
  id:        z.string(),
  supporter: z.string(),
  status:    z.enum(["covered", "pending", "failed"]),
  fund:      z.string(),
  amount:    z.string(),
});

export const donorDetailSchema = z.object({
  id:        z.string(),
  name:      z.string(),
  email:     z.string().email(),
  mailingList:    z.boolean(),
  mailingAddress: z.string().optional(),
  donations:      z.array(donationSchema).default([]),
});

export const donorFiltersSchema = z.object({
  tab:         donorTabSchema.optional(),
  dateRange:   z.string().optional(),
  region:      z.string().optional(),
  institution: z.string().optional(),
  pageType:    z.string().optional(),
  search:      z.string().optional(),
});

export type Donor        = z.infer<typeof donorSchema>;
export type DonorDetail  = z.infer<typeof donorDetailSchema>;
export type Donation     = z.infer<typeof donationSchema>;
export type DonorFilters = z.infer<typeof donorFiltersSchema>;
