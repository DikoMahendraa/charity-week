"use client";

import { useState, forwardRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Settings } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

// ─── Schema ───────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterInput = z.infer<typeof registerSchema>;

// ─── Password strength ────────────────────────────────────────────────────────

function getStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthMeta: Record<number, { label: string; color: string }> = {
  0: { label: "", color: "bg-gray-200" },
  1: { label: "Weak", color: "bg-red-400" },
  2: { label: "Fair", color: "bg-orange-400" },
  3: { label: "Good", color: "bg-amber-400" },
  4: { label: "Strong", color: "bg-[#EC8900]" },
};

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getStrength(password);
  const { label, color } = strengthMeta[strength];
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i < strength ? color : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs">
        <span className={cn("font-medium", strength >= 3 ? "text-[#EC8900]" : "text-gray-400")}>
          {label && `${label} password`}
        </span>
        <span className="text-gray-400">Min 8 characters</span>
      </div>
    </div>
  );
}

// ─── Custom checkbox ──────────────────────────────────────────────────────────

const CheckboxField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function CheckboxField({ className, ...props }, ref) {
  return (
    <span className="relative mt-0.5 shrink-0 inline-flex h-5 w-5">
      <input
        type="checkbox"
        ref={ref}
        {...props}
        className={cn("peer absolute inset-0 h-5 w-5 cursor-pointer opacity-0", className)}
      />
      {/* Visual box  reacts to the peer checkbox state */}
      <span className="pointer-events-none flex h-5 w-5 items-center justify-center rounded border-2 border-gray-300 transition-colors peer-checked:border-[#EC8900] peer-checked:bg-[#EC8900]">
        <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity">
          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span >
  );
});

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const { switchRole } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeToTerms: false },
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (_data: RegisterInput) => {
    setIsSubmitting(true);
    // ── Mock register ────────────────────────────────────────────────────────
    // Replace with a real API call when the backend is ready:
    //   const res = await api.post<AuthResponse>(ENDPOINTS.auth.register, {
    //     name: _data.fullName, email: _data.email, password: _data.password,
    //   });
    //   useAuthStore.getState().setToken(res.token);
    //   useAuthStore.getState().setUser(res.user);
    await new Promise((r) => setTimeout(r, 800));
    switchRole("fundraiser"); // new accounts default to fundraiser
    router.push("/campaign/pages");
    // ────────────────────────────────────────────────────────────────────────
  };

  return (
    <div className="w-full max-w-[420px] py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#EC8900] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex items-center gap-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EC8900]">
            <Settings className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-[#EC8900]">IRUK</span>
        </div>
      </div>

      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#161616]">Create your account</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Join over 20,000+ active fundraisers supporting IRUK.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-[#161616] mb-1.5">Full Name</label>
          <input
            type="text"
            placeholder="e.g. Sarah Jenkins"
            {...register("fullName")}
            className={cn(
              "w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400",
              errors.fullName
                ? "border-red-400 focus:border-red-400"
                : "border-gray-200 focus:border-[#EC8900]"
            )}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#161616] mb-1.5">Email Address</label>
          <input
            type="email"
            placeholder="e.g. sarah@jenkins.com"
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
          <label className="block text-sm font-medium text-[#161616] mb-1.5">Choose Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              {...register("password")}
              className={cn(
                "w-full rounded-lg border px-4 py-3 pr-16 text-sm outline-none transition-colors placeholder:text-gray-300",
                errors.password
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-200 focus:border-[#EC8900]"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#EC8900] hover:opacity-70"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <PasswordStrengthBar password={passwordValue} />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-[#161616] mb-1.5">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••••••"
              {...register("confirmPassword")}
              className={cn(
                "w-full rounded-lg border px-4 py-3 pr-16 text-sm outline-none transition-colors placeholder:text-gray-300",
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-200 focus:border-[#EC8900]"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#EC8900] hover:opacity-70"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <CheckboxField {...register("agreeToTerms")} />
            <span className="text-sm text-gray-600 leading-snug">
              I agree to the IRUK{" "}
              <a href="#" className="font-medium text-[#EC8900] hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="font-medium text-[#EC8900] hover:underline">Privacy Policy</a>.
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1.5 text-xs text-red-500">{errors.agreeToTerms.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#EC8900] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#d47800] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      {/* Sign in link */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#EC8900] hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
