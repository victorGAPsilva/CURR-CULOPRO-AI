import { z } from "zod";

/** Ações oferecidas pelo assistente, com o que cada uma faz. */
export const AI_ACTIONS = [
  "improve_summary",
  "rewrite_experience",
  "fix_grammar",
  "action_verbs",
  "adapt_to_job",
  "extract_skills",
  "no_experience_help",
  "missing_info",
] as const;

export const aiActionSchema = z.enum(AI_ACTIONS);
export type AiAction = z.infer<typeof aiActionSchema>;

/** Entrada aceita pela rota de IA. Limite rígido de tamanho. */
export const aiRequestSchema = z.object({
  action: aiActionSchema,
  /** Texto que será trabalhado (resumo, descrição de experiência, etc.). */
  text: z.string().trim().max(4000).default(""),
  /** Contexto opcional e não sensível. */
  context: z
    .object({
      sectionLabel: z.string().trim().max(60).optional(),
      targetRole: z.string().trim().max(120).optional(),
      /** Sugestões de habilidades/interesses para adaptar a linguagem. */
      jobKeywords: z.array(z.string().trim().max(40)).max(20).optional(),
    })
    .prefault({}),
});

export type AiRequest = z.infer<typeof aiRequestSchema>;

/** Formato estruturado devolvido pelo provedor generativo. */
export const aiModelOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(120),
        text: z.string().trim().max(4000).optional(),
        notes: z.array(z.string().trim().max(300)).max(10).optional(),
      }),
    )
    .max(5),
});

export type AiModelOutput = z.infer<typeof aiModelOutputSchema>;

export interface AiSuggestion {
  id: string;
  kind: "replacement" | "advisory";
  title: string;
  /** Texto proposto (presente em sugestões de substituição). */
  text?: string;
  /** Observações para o usuário (presentes em sugestões de orientação). */
  notes?: string[];
}

export interface AiResult {
  source: "ai" | "local";
  /** Aviso para a interface sobre o modo em uso. */
  notice: string;
  suggestions: AiSuggestion[];
}
