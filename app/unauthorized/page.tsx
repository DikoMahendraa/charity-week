import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F7F9FB] text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
        <span className="text-3xl">🔒</span>
      </div>
      <h1 className="text-2xl font-bold text-[#161616]">Access Denied</h1>
      <p className="max-w-sm text-sm text-[#475467]">
        You don&apos;t have permission to view this page. Contact your administrator if you
        think this is a mistake.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-[#EC8900] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d47800] transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
