import type { ResumeContent, TemplateId } from "@/lib/resume/schema";
import { normalizeContent } from "@/lib/resume/normalize";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";

/**
 * Seleciona o componente de apresentação conforme o modelo escolhido.
 * Todos os modelos consomem a mesma estrutura de dados (ResumeContent).
 */
export function ResumeDocument({
  content,
  templateId,
}: {
  content: ResumeContent;
  templateId: TemplateId;
}) {
  const normalized = normalizeContent(content);

  if (templateId === "modern") return <ModernTemplate content={normalized} />;
  if (templateId === "minimal") return <MinimalTemplate content={normalized} />;
  return <ClassicTemplate content={normalized} />;
}
