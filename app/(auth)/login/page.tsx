"use client";

import { useState }    from "react";
import Image           from "next/image";
import Link            from "next/link";
import { useRouter }   from "next/navigation";
import { useForm }     from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z }           from "zod";
import { useAuth }     from "@/contexts/auth-context";
import { defaultRouteForRole } from "@/lib/permissions";

const schema = z.object({
  email:      z.string().email("Enter a valid email address"),
  password:   z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  async function onSubmit(_data: FormValues) {
    await new Promise(r => setTimeout(r, 600));
    switchRole("admin");
    router.push(defaultRouteForRole("admin"));
  }

  const inputCls = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-gray-300 ${
      hasError
        ? "border-red-400 focus:border-red-400"
        : "border-gray-200 focus:border-[#EC8900]"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px]">

        {/* Logo */}
        <div className="mb-8 flex items-center gap-2.5">
          <Image
            src="/assets/svg/iruk-logo.svg"
            alt="IRUK"
            width={36}
            height={44}
            priority
          />
          <span className="text-xl font-extrabold text-gray-900">IRUK</span>
        </div>

        {/* Heading */}
        <h1 className="text-[2rem] font-extrabold leading-tight text-gray-900">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter your credentials below to access your account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-800">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="e.g. name@domain.com"
              className={inputCls(!!errors.email)}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-800">Password</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className={`${inputCls(!!errors.password)} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-4 text-sm font-bold text-[#EC8900] hover:text-[#d47a00]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                {...register("rememberMe")}
                type="checkbox"
                className="h-4 w-4 cursor-pointer accent-[#EC8900]"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-bold text-[#EC8900] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#EC8900] py-4 text-base font-bold text-white transition-colors hover:bg-[#d47a00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
}
