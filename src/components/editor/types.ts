import type { ResumeContent } from "@/lib/resume/schema";

export interface EditorSectionProps {
  content: ResumeContent;
  /** Aplica um patch parcial ao conteúdo do currículo. */
  update: (patch: Partial<ResumeContent>) => void;
}
