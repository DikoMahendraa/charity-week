"use client";

import Image           from "next/image";
import { useRouter }   from "next/navigation";
import { useForm }     from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z }           from "zod";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    await new Promise(r => setTimeout(r, 900));
    // Pass email to verify step via search param
    router.push(`/forgot-password/verify?email=${encodeURIComponent(data.email)}`);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[400px] flex-col px-6">

      {/* Logo */}
      <div className="flex items-center gap-2 pt-10">
        <Image src="/assets/svg/iruk-logo.svg" alt="IRUK" width={28} height={34} />
        <span className="text-base font-extrabold text-gray-900">IRUK</span>
      </div>

      {/* Progress bar: step 1 of 2 */}
      <div className="mt-4 flex gap-1.5">
        <div className="h-1 flex-1 rounded-full bg-[#EC8900]" />
        <div className="h-1 flex-1 rounded-full bg-gray-200" />
      </div>

      {/* Heading */}
      <div className="mt-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Forgot Password</h1>
        <p className="mt-1.5 text-sm text-gray-500">Enter your email to reset your password</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-gray-800">Email Address</label>
          <input
            {...register("email")}
            type="email"
            inputMode="email"
            placeholder="e.g. name@domain.com"
            className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-gray-300 ${
              errors.email ? "border-red-400" : "border-gray-200 focus:border-[#EC8900]"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
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
          {isSubmitting ? "Sending…" : "Submit"}
        </button>
      </div>

    </div>
  );
}
