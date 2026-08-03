import { z } from "zod";

export const paymentStatusSchema = z.enum([
  "completed", "failed", "refunded", "abandoned", "pending", "renewal",
]);

export const paymentSchema = z.object({
  id:          z.string(),
  createdDate: z.string(),
  donorName:   z.string(),
  page:        z.string(),
  amount:      z.string(),
  tipFee:      z.string(),
  paymentType: z.string(),
  status:      paymentStatusSchema,
});

export const paymentDetailSchema = z.object({
  id:                   z.string(),
  totalAmount:          z.string(),
  transactionFee:       z.string(),
  tipFee:               z.string(),
  processingFee:        z.string(),
  adminFee:             z.string(),
  processor:            z.string(),
  processorPaymentId:   z.string(),
  paymentMethod:        z.string(),
  creditCard:           z.string().optional(),
  feeCovered:           z.string(),
  effectiveFee:         z.string(),
  giftAid:              z.boolean(),
  legalText:            z.string().optional(),
  donorName:            z.string(),
  donorEmail:           z.string().email(),
  mailingList:          z.string().optional(),
  mailingAddress:       z.string().optional(),
  source:               z.string().optional(),
  page:                 z.string().optional(),
  element:              z.string().optional(),
  ipAddress:            z.string().optional(),
  ipGeolocation:        z.string().optional(),
  browser:              z.string().optional(),
  device:               z.string().optional(),
  os:                   z.string().optional(),
});

export const paymentFiltersSchema = z.object({
  status:  paymentStatusSchema.optional(),
  search:  z.string().optional(),
  dateRange: z.string().optional(),
});

export type Payment        = z.infer<typeof paymentSchema>;
export type PaymentDetail  = z.infer<typeof paymentDetailSchema>;
export type PaymentFilters = z.infer<typeof paymentFiltersSchema>;
