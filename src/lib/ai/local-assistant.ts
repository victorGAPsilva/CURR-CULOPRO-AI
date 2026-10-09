import { newId } from "@/lib/resume/defaults";
import type { AiAction, AiRequest, AiSuggestion } from "./schema";

/**
 * Assistente local determinístico.
 * Usado quando a IA generativa não está configurada. NUNCA cria fatos:
 * apenas formata, detecta informações já presentes e oferece orientações
 * genéricas de redação.
 */

const COMMON_SKILLS = [
  "Excel",
  "Word",
  "PowerPoint",
  "Google Sheets",
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "SQL",
  "HTML",
  "CSS",
  "Git",
  "PHP",
  "Java",
  "atendimento ao cliente",
  "vendas",
  "negociação",
  "comunicação",
  "organização",
  "liderança",
  "trabalho em equipe",
  "gestão de tempo",
  "proatividade",
  "resolução de problemas",
];

const ACTION_VERBS = [
  "Organizei",
  "Desenvolvi",
  "Atendi",
  "Implantei",
  "Coordenei",
  "Otimizei",
  "Planejei",
  "Reduzi",
  "Aumentei",
  "Gerenciei",
  "Criei",
  "Treinei",
  "Acompanhei",
  "Resolvi",
];

function collapseWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function tidySentences(text: string): string {
  return collapseWhitespace(text)
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/(^|[.!?]\s+|\n)([a-záéíóúâêôãõç])/g, (_m, prefix: string, letter: string) =>
      `${prefix}${letter.toUpperCase()}`,
    );
}

function detectSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return COMMON_SKILLS.filter((skill) => lower.includes(skill.toLowerCase()));
}

function replacement(
  action: AiAction,
  text: string,
  note: string,
): AiSuggestion | null {
  const cleaned = tidySentences(text);
  if (!cleaned) return null;
  return {
    id: newId(),
    kind: "replacement",
    title: action === "fix_grammar" ? "Revisão de formatação" : "Versão ajustada",
    text: cleaned,
    notes: [note],
  };
}

export function localSuggestions(
  action: AiAction,
  request: AiRequest,
): AiSuggestion[] {
  const text = request.text;
  const noAiNote =
    "IA generativa não configurada. Sugestão produzida localmente, sem criar informações novas.";

  switch (action) {
    case "improve_summary":
    case "rewrite_experience":
    case "adapt_to_job":
    case "fix_grammar": {
      const suggestion = replacement(action, text, noAiNote);
      const notes: string[] = [
        "Para sugestões de redação com IA, configure AI_API_KEY no ambiente.",
        "Verbos de ação ajudam a iniciar cada atividade: " +
          ACTION_VERBS.slice(0, 6).join(", ") +
          ".",
      ];
      return [
        ...(suggestion ? [suggestion] : []),
        { id: newId(), kind: "advisory", title: "Orientações", notes },
      ];
    }

    case "action_verbs":
      return [
        {
          id: newId(),
          kind: "advisory",
          title: "Verbos de ação sugeridos",
          notes: [
            "Comece cada atividade com um verbo de ação: " + ACTION_VERBS.join(", ") + ".",
            "Prefira frases curtas e objetivas, uma ideia por linha.",
          ],
        },
      ];

    case "extract_skills": {
      const detected = detectSkills(text);
      return [
        {
          id: newId(),
          kind: "advisory",
          title:
            detected.length > 0
              ? "Habilidades identificadas no texto"
              : "Nenhuma habilidade conhecida identificada",
          notes:
            detected.length > 0
              ? detected.map((skill) => `Já citada: ${skill}`)
              : [
                  "Nenhuma habilidade da nossa lista aparece no texto analisado.",
                  "Adicione ao texto as ferramentas e competências que você realmente usa.",
                ],
        },
      ];
    }

    case "no_experience_help":
      return [
        {
          id: newId(),
          kind: "advisory",
          title: "Como valorizar quem ainda não tem experiência formal",
          notes: [
            "Inclua projetos pessoais, acadêmicos ou voluntários na seção de Projetos.",
            "Destaque formação, cursos e certificações reais.",
            "Liste habilidades técnicas e interpessoais que você realmente possui.",
            "Descreva atividades concretas em vez de adjetivos genéricos.",
          ],
        },
      ];

    case "missing_info":
      return [
        {
          id: newId(),
          kind: "advisory",
          title: "Informações que costumam faltar",
          notes: [
            "Confirme se nome e e-mail estão preenchidos.",
            "Um resumo de 2 a 4 linhas ajuda o recrutador a entender seu foco.",
            "Adicione ao menos uma experiência, ou um projeto se ainda não trabalhou.",
            "Liste habilidades e idiomas que você realmente possui.",
          ],
        },
      ];

    default:
      return [
        {
          id: newId(),
          kind: "advisory",
          title: "Sem sugestões",
          notes: ["Não foi possível gerar sugestões para esta ação."],
        },
      ];
  }
}
