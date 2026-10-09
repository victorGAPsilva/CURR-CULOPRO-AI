import type { ResumeContent } from "./schema";

export interface CompletionStep {
  id: string;
  label: string;
  done: boolean;
  /** Peso relativo no cálculo de progresso. */
  weight: number;
}

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Avalia o preenchimento das seções essenciais sem obrigar campos opcionais.
 * Retorna o percentual e o detalhamento por seção (para orientar o usuário).
 */
export function assessCompletion(content: ResumeContent): {
  percent: number;
  steps: CompletionStep[];
} {
  const steps: CompletionStep[] = [
    {
      id: "personal",
      label: "Dados de contato",
      done: hasText(content.personal.fullName) && hasText(content.personal.email),
      weight: 2,
    },
    {
      id: "headline",
      label: "Cargo ou objetivo",
      done: hasText(content.personal.headline),
      weight: 1,
    },
    {
      id: "summary",
      label: "Resumo profissional",
      done: hasText(content.summary),
      weight: 2,
    },
    {
      id: "experience",
      label: "Experiência",
      done: content.experiences.length > 0,
      weight: 2,
    },
    {
      id: "education",
      label: "Formação acadêmica",
      done: content.education.length > 0,
      weight: 1,
    },
    {
      id: "skills",
      label: "Habilidades",
      done: content.skills.length > 0 || content.softSkills.length > 0,
      weight: 1,
    },
    {
      id: "extra",
      label: "Cursos, idiomas ou projetos",
      done:
        content.courses.length > 0 ||
        content.languages.length > 0 ||
        content.projects.length > 0,
      weight: 1,
    },
  ];

  const total = steps.reduce((sum, step) => sum + step.weight, 0);
  const done = steps.reduce((sum, step) => sum + (step.done ? step.weight : 0), 0);

  return { percent: Math.round((done / total) * 100), steps };
}

export function completionPercent(content: ResumeContent): number {
  return assessCompletion(content).percent;
}
