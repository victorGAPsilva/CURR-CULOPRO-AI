import type { ReactNode } from "react";
import type { ResumeContent } from "@/lib/resume/schema";
import { formatMonth, formatPeriod } from "@/lib/resume/format";

/** Linha de contato: emite apenas os itens preenchidos. */
export function contactItems(content: ResumeContent): string[] {
  const { personal } = content;
  return [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter((item) => item.trim().length > 0);
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={className} data-resume-heading>
      {children}
    </h2>
  );
}

export function hasAnySection(content: ResumeContent): boolean {
  return (
    content.summary.trim().length > 0 ||
    content.experiences.length > 0 ||
    content.education.length > 0 ||
    content.courses.length > 0 ||
    content.skills.length > 0 ||
    content.softSkills.length > 0 ||
    content.languages.length > 0 ||
    content.projects.length > 0
  );
}

export { formatMonth, formatPeriod };
