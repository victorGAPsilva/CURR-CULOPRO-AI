import type { AiAction, AiRequest } from "./schema";

/**
 * Instruções de sistema. A regra central: melhorar a APRESENTAÇÃO sem criar
 * fatos. O modelo nunca deve inventar números, cargos, empresas, datas ou
 * certificações que não estejam no texto fornecido.
 */
export const SYSTEM_PROMPT = `Você é um assistente de redação de currículos para o mercado brasileiro.
Sua função é melhorar a clareza, a gramática e a apresentação do texto fornecido pelo usuário.

REGRAS CRÍTICAS (nunca viole):
1. NÃO invente fatos. Não crie números, métricas, resultados, empresas, cargos, datas, certificações ou responsabilidades que não estejam no texto.
2. Se uma informação importante estiver ausente, proponha-a apenas como HIPÓTESE e deixe explícito que o usuário precisa confirmar.
3. Preserve nomes próprios, empresas, cargos, datas e dados exatamente como fornecidos.
4. Escreva em português do Brasil, com verbos de ação no passado ou presente, de forma objetiva.
5. Nunca prometa contratação, aprovação em processos ou resultados profissionais.
6. Não inclua dados pessoais sensíveis além do que foi fornecido.

Formato de resposta obrigatório (JSON):
{"suggestions":[{"title":"título curto","text":"versão reescrita (apenas em sugestões de substituição)","notes":["observação curta opcional"]}]}
Use "text" quando propuser um texto substituto. Use "notes" para orientações e hipóteses a confirmar (prefixe hipóteses com "Hipótese a confirmar:").
Responda SOMENTE com o JSON, sem comentários.`;

interface ActionSpec {
  instruction: string;
  wantsReplacement: boolean;
}

const ACTION_SPECS: Record<AiAction, ActionSpec> = {
  improve_summary: {
    instruction:
      "Reescreva o resumo profissional para ser mais claro e objetivo, mantendo todos os fatos. Proponha uma versão substituta.",
    wantsReplacement: true,
  },
  rewrite_experience: {
    instruction:
      "Reescreva a descrição da experiência com verbos de ação e foco em atividades e responsabilidades reais. Não invente resultados numéricos. Proponha uma versão substituta.",
    wantsReplacement: true,
  },
  fix_grammar: {
    instruction:
      "Corrija ortografia, gramática, pontuação e concordância, sem alterar o sentido nem adicionar fatos. Proponha a versão corrigida como substituta.",
    wantsReplacement: true,
  },
  action_verbs: {
    instruction:
      "Sugira verbos de ação adequados ao texto fornecido, sem reescrever os fatos. Retorne orientações em 'notes'.",
    wantsReplacement: false,
  },
  adapt_to_job: {
    instruction:
      "Adapte a linguagem do texto para a vaga informada, destacando experiência já presente no texto. NÃO invente experiência. Proponha uma versão substituta que reflita apenas o conteúdo fornecido, aproximando o vocabulário das palavras-chave da vaga.",
    wantsReplacement: true,
  },
  extract_skills: {
    instruction:
      "Liste apenas as habilidades que já estão explicitamente presentes no texto. Não invente habilidades. Retorne a lista em 'notes'.",
    wantsReplacement: false,
  },
  no_experience_help: {
    instruction:
      "A pessoa ainda não tem experiência profissional formal. Sugira como valorizar formação, projetos, trabalhos voluntários e habilidades, sem inventar experiências. Retorne orientações em 'notes'.",
    wantsReplacement: false,
  },
  missing_info: {
    instruction:
      "Aponte quais informações essenciais ainda estão ausentes no currículo para um bom resultado, sem inventar conteúdo. Retorne orientações em 'notes'.",
    wantsReplacement: false,
  },
};

export function buildUserPrompt(request: AiRequest): string {
  const spec = ACTION_SPECS[request.action];
  const parts: string[] = [spec.instruction];

  if (request.context.sectionLabel) {
    parts.push(`Seção: ${request.context.sectionLabel}.`);
  }
  if (request.context.targetRole) {
    parts.push(`Vaga/objetivo alvo: ${request.context.targetRole}.`);
  }
  if (request.context.jobKeywords?.length) {
    parts.push(
      `Palavras-chave da vaga: ${request.context.jobKeywords.join(", ")}.`,
    );
  }

  parts.push("--- TEXTO FORNECIDO PELO USUÁRIO (delimitado) ---");
  parts.push(request.text || "(vazio)");
  parts.push("--- FIM DO TEXTO ---");

  if (!spec.wantsReplacement) {
    parts.push(
      "Para esta ação, retorne as orientações em 'notes' e deixe 'text' vazio.",
    );
  }

  return parts.join("\n");
}

export function wantsReplacement(action: AiAction): boolean {
  return ACTION_SPECS[action].wantsReplacement;
}
