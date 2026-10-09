"use client";

import { assessCompletion } from "@/lib/resume/progress";
import { IconCheck } from "@/components/ui/icons";
import { Badge } from "@/components/ui/surfaces";
import { AiSuggestButton } from "./AiSuggestButton";
import type { ResumeContent } from "@/lib/resume/schema";

function digest(content: ResumeContent): string {
  const { personal } = content;
  const line = (label: string, value: string) => `${label}: ${value}`;
  return [
    line("Nome", personal.fullName.trim() ? "preenchido" : "vazio"),
    line("Cargo/objetivo", personal.headline.trim() ? "preenchido" : "vazio"),
    line("E-mail", personal.email.trim() ? "preenchido" : "vazio"),
    line("Resumo", content.summary.trim() ? "preenchido" : "vazio"),
    line("Experiências", String(content.experiences.length)),
    line("Formação", String(content.education.length)),
    line("Cursos", String(content.courses.length)),
    line("Habilidades técnicas", String(content.skills.length)),
    line("Habilidades interpessoais", String(content.softSkills.length)),
    line("Idiomas", String(content.languages.length)),
    line("Projetos", String(content.projects.length)),
  ].join("\n");
}

function experiencesText(content: ResumeContent): string {
  return content.experiences
    .map((exp) => [exp.role, exp.company, exp.description].filter(Boolean).join(" — "))
    .join("\n");
}

function allText(content: ResumeContent): string {
  return [
    content.summary,
    experiencesText(content),
    content.skills.map((s) => s.name).join(", "),
    content.softSkills.map((s) => s.name).join(", "),
    content.projects.map((p) => `${p.name} ${p.description}`).join("\n"),
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Painel de diagnóstico + ações gerais do assistente.
 * O diagnóstico é calculado localmente (sem enviar dados a terceiros).
 */
export function EditorAssistant({ content }: { content: ResumeContent }) {
  const { percent, steps } = assessCompletion(content);

  return (
    <div className="rounded-lg border border-brand-100 bg-brand-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-brand-900">
          Assistente do currículo
        </h2>
        <Badge tone={percent === 100 ? "success" : "accent"}>
          {percent}% essencial
        </Badge>
      </div>

      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {steps.map((step) => (
          <li key={step.id} className="flex items-center gap-2 text-xs">
            {step.done ? (
              <IconCheck className="h-4 w-4 shrink-0 text-success-600" />
            ) : (
              <span
                aria-hidden
                className="h-4 w-4 shrink-0 rounded-full border border-brand-300"
              />
            )}
            <span className={step.done ? "text-brand-600" : "text-brand-500"}>
              {step.label}
              <span className="sr-only">
                {step.done ? ": preenchido" : ": pendente"}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <AiSuggestButton
          action="missing_info"
          label="O que ainda falta"
          getText={() => digest(content)}
        />
        <AiSuggestButton
          action="action_verbs"
          label="Verbos de ação"
          getText={() => experiencesText(content) || content.summary}
          disabled={!experiencesText(content) && !content.summary}
        />
        <AiSuggestButton
          action="extract_skills"
          label="Identificar habilidades"
          getText={() => allText(content)}
          disabled={!allText(content)}
        />
        <AiSuggestButton
          action="no_experience_help"
          label="Não tenho experiência"
          getText={() => digest(content)}
        />
      </div>
    </div>
  );
}
