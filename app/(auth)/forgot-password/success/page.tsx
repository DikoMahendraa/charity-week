import Image from "next/image";
import Link  from "next/link";

export default function ResetSuccessPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[400px] flex-col items-center justify-center px-6 py-12">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src="/assets/svg/iruk-logo.svg" alt="IRUK" width={32} height={40} />
        <span className="text-lg font-extrabold text-gray-900">IRUK</span>
      </div>

      {/* Illustration: concentric rings + shield */}
      <div className="relative mt-10 flex h-48 w-48 items-center justify-center">
        {/* Outermost ring */}
        <div className="absolute h-48 w-48 rounded-full bg-orange-50" />
        {/* Middle ring */}
        <div className="absolute h-36 w-36 rounded-full bg-orange-100" />
        {/* Inner ring */}
        <div className="absolute h-24 w-24 rounded-full bg-orange-200" />
        {/* Center circle */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#EC8900] shadow-lg">
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>

        {/* Sparkles */}
        {/* Top-left */}
        <svg className="absolute -left-3 top-2 h-6 w-6 text-[#EC8900] opacity-80" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l1.09 3.26L16 6l-2.91 2.09L14 11l-2-1.5L10 11l.91-2.91L9 6l2.91-.74z" />
        </svg>
        {/* Top-right */}
        <svg className="absolute -right-2 top-4 h-5 w-5 text-amber-400 opacity-70" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l1.09 3.26L16 6l-2.91 2.09L14 11l-2-1.5L10 11l.91-2.91L9 6l2.91-.74z" />
        </svg>
        {/* Bottom-left */}
        <svg className="absolute bottom-3 -left-4 h-5 w-5 text-orange-300 opacity-70" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l1.09 3.26L16 6l-2.91 2.09L14 11l-2-1.5L10 11l.91-2.91L9 6l2.91-.74z" />
        </svg>
        {/* Bottom-right */}
        <svg className="absolute -bottom-1 -right-3 h-7 w-7 text-amber-300 opacity-60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l1.09 3.26L16 6l-2.91 2.09L14 11l-2-1.5L10 11l.91-2.91L9 6l2.91-.74z" />
        </svg>
        {/* Heart / small decoration */}
        <svg className="absolute -left-6 bottom-10 h-5 w-5 text-orange-400 opacity-50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Text */}
      <h1 className="mt-8 text-center text-xl font-extrabold leading-snug text-gray-900">
        Your password has been successfully reset!
      </h1>
      <p className="mt-3 text-center text-sm leading-relaxed text-gray-500">
        You&apos;re all set! Your account is now secure with your new password.
        You can now use it to log back in.
      </p>

      {/* CTA */}
      <div className="mt-8 w-full">
        <Link
          href="/login"
          className="flex w-full items-center justify-center rounded-2xl bg-[#EC8900] py-4 text-base font-bold text-white transition-colors hover:bg-[#d47a00]"
        >
          Go back to login page
        </Link>
      </div>

    </div>
  );
}
