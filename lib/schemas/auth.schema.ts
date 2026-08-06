import { z } from "zod";

export const loginSchema = z.object({
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const userSchema = z.object({
  id:             z.string(),
  name:           z.string(),
  email:          z.string().email(),
  role:           z.enum(["super_admin", "admin", "fundraiser"]),
  avatarInitials: z.string().optional(),
});

export const authResponseSchema = z.object({
  user:  userSchema,
  token: z.string(),
});

export type LoginInput    = z.infer<typeof loginSchema>;
export type UserSchema    = z.infer<typeof userSchema>;
export type AuthResponse  = z.infer<typeof authResponseSchema>;
