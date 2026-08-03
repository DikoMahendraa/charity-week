import { AuthProvider } from "@/contexts/auth-context";
import { DashboardGuard } from "@/components/dashboard/dashboard-guard";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex p-4 h-full overflow-hidden bg-[#F7F9FB]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <DashboardGuard>{children}</DashboardGuard>
        </main>
      </div>
    </AuthProvider>
  );
}
