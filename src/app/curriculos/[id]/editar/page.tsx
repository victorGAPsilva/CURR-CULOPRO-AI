import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EditorShell } from "@/components/editor/EditorShell";
import { requireUser } from "@/lib/auth/guard";
import { getResumeById } from "@/lib/db/resumes";

export const metadata: Metadata = {
  title: "Editar currículo",
  robots: { index: false, follow: false },
};

export default async function EditResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const resume = getResumeById(id, user.id);
  if (!resume) notFound();

  return <EditorShell resume={resume} plan={user.plan} />;
}
