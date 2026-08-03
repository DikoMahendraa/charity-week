"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, User, Building2, Settings } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { defaultRouteForRole } from "@/lib/permissions";
import type { Role } from "@/lib/auth";
import { cn } from "@/lib/utils";

// ─── Schema ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;

// ─── Role cards ───────────────────────────────────────────────────────────────

const roles: { value: Role; label: string; icon: React.ElementType }[] = [
  { value: "fundraiser",   label: "I'm a Fundraiser",   icon: User      },
  { value: "admin",        label: "Institution Admin",   icon: Building2 },
  { value: "super_admin",  label: "IRUK Admin",          icon: Settings  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState<Role>("fundraiser");
  const [showPassword, setShowPassword]   = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (_data: LoginInput) => {
    setIsSubmitting(true);
    // ── Mock login ───────────────────────────────────────────────────────────
    // Replace this block with a real API call when the backend is ready:
    //   const res = await api.post<AuthResponse>(ENDPOINTS.auth.login, {
    //     email: _data.email, password: _data.password, role: selectedRole,
    //   });
    //   useAuthStore.getState().setToken(res.token);
    //   useAuthStore.getState().setUser(res.user);
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    switchRole(selectedRole);
    router.push(defaultRouteForRole(selectedRole));
    // ────────────────────────────────────────────────────────────────────────
  };

  return (
    <>
      {/* Card */}
      <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-sm border border-gray-100 px-10 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#161616]">Welcome to Charity Week 2026</h1>
          <p className="mt-1.5 text-sm text-gray-500">Sign in to your account</p>
        </div>

        {/* Role selector */}
        <div className="mb-6">
          <p className="text-sm font-medium text-[#161616] mb-3">Select Your Role</p>
          <div className="grid grid-cols-3 gap-3">
            {roles.map(({ value, label, icon: Icon }) => {
              const active = selectedRole === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedRole(value)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-xl border-2 px-3 py-4 text-xs font-semibold transition-colors",
                    active
                      ? "border-[#EC8900] bg-orange-50/50 text-[#EC8900]"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  <Icon className={cn("h-6 w-6", active ? "text-[#EC8900]" : "text-gray-400")} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#161616] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400",
                errors.email
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-200 focus:border-[#EC8900]"
              )}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#161616] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={cn(
                  "w-full rounded-lg border px-4 py-3 pr-11 text-sm outline-none transition-colors placeholder:text-gray-400",
                  errors.password
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-200 focus:border-[#EC8900]"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#EC8900] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#d47800] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Forgot password */}
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm font-medium text-[#EC8900] hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-100" />

        {/* Sign up */}
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#EC8900] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <Lock className="h-3.5 w-3.5" />
        <span>Secure connection. Islamic Relief UK.</span>
      </div>
    </>
  );
}
