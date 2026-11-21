import { AppShell } from "@/components/app-shell";
import { getShellData } from "@/lib/shell-data";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const { shellUser, enrolledExams, unreadNotifications } = await getShellData();

  return (
    <AppShell
      user={shellUser}
      enrolledExams={enrolledExams}
      unreadNotifications={unreadNotifications}
    >
      {children}
    </AppShell>
  );
}
