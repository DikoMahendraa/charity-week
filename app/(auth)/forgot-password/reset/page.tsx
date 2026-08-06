"use client";

import Image           from "next/image";
import { useRouter }   from "next/navigation";
import { useState }    from "react";
import { useForm }     from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z }           from "zod";

const schema = z
  .object({
    password:        z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit() {
    await new Promise(r => setTimeout(r, 1000));
    router.push("/forgot-password/success");
  }

  const inputBase =
    "w-full rounded-xl border bg-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-gray-300 pr-16";

  return (
    <div className="mx-auto flex min-h-screen max-w-[400px] flex-col px-6">

      {/* Logo */}
      <div className="flex items-center gap-2 pt-10">
        <Image src="/assets/svg/iruk-logo.svg" alt="IRUK" width={28} height={34} />
        <span className="text-base font-extrabold text-gray-900">IRUK</span>
      </div>

      {/* Heading */}
      <div className="mt-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Reset Your Password</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
          Go ahead and set your new password—just be sure to remember it!
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
        {/* New password */}
        <div>
          <label className="mb-1.5 block text-sm font-bold text-gray-800">New Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showNew ? "text" : "password"}
              placeholder="••••••••••••"
              className={`${inputBase} ${errors.password ? "border-red-400" : "border-gray-200 focus:border-[#EC8900]"}`}
            />
            <button
              type="button"
              onClick={() => setShowNew(v => !v)}
              className="absolute inset-y-0 right-4 text-sm font-bold text-[#EC8900]"
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="mb-1.5 block text-sm font-bold text-gray-800">
            Confirm your new password
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••••••"
              className={`${inputBase} ${errors.confirmPassword ? "border-red-400" : "border-gray-200 focus:border-[#EC8900]"}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              className="absolute inset-y-0 right-4 text-sm font-bold text-[#EC8900]"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
      </form>

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA */}
      <div className="pb-10 pt-4">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#EC8900] py-4 text-base font-bold text-white transition-colors hover:bg-[#d47a00] disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : "Set New Password"}
        </button>
      </div>

    </div>
  );
}
