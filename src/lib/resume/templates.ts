import type { TemplateId } from "./schema";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  /** Nível de acesso: "free" disponível no plano gratuito. */
  tier: "free" | "premium";
  highlights: string[];
}

/**
 * Registro de modelos. A mesma estrutura de dados alimenta todos os modelos;
 * apenas os componentes de apresentação (HTML e PDF) mudam.
 */
export const TEMPLATES: TemplateMeta[] = [
  {
    id: "classic",
    name: "Clássico",
    tagline: "Conservador e direto",
    description:
      "Coluna única, tipografia sóbria e seções bem demarcadas. Adequado a ambientes tradicionais e instituições.",
    tier: "free",
    highlights: ["Coluna única", "Cabeçalho centrado", "Ideal para ATS"],
  },
  {
    id: "modern",
    name: "Moderno",
    tagline: "Hierarquia contemporânea",
    description:
      "Cabeçalho destacado e títulos de seção com ênfase de cor, mantendo leitura linear para sistemas automáticos.",
    tier: "premium",
    highlights: ["Cabeçalho em destaque", "Títulos com cor", "Boa densidade"],
  },
  {
    id: "minimal",
    name: "Minimalista",
    tagline: "Leve e de leitura rápida",
    description:
      "Economia de elementos gráficos, muito espaço em branco controlado e foco total no conteúdo.",
    tier: "premium",
    highlights: ["Sem ornamento", "Rótulos discretos", "Leitura rápida"],
  },
];

export function getTemplate(id: TemplateId): TemplateMeta {
  return TEMPLATES.find((template) => template.id === id) ?? TEMPLATES[0]!;
}

export function isTemplateId(value: string): value is TemplateId {
  return TEMPLATES.some((template) => template.id === value);
}
