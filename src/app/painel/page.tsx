import type { Metadata } from "next";
import { AppHeader } from "@/components/app/AppHeader";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { requireUser } from "@/lib/auth/guard";
import { listResumesByUser } from "@/lib/db/resumes";

export const metadata: Metadata = {
  title: "Meus currículos",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await requireUser();
  const resumes = listResumesByUser(user.id);

  return (
    <div className="min-h-screen bg-canvas">
      <AppHeader user={user} />
      <main className="container-page py-10">
        <DashboardClient resumes={resumes} plan={user.plan} />
      </main>
    </div>
  );
}
