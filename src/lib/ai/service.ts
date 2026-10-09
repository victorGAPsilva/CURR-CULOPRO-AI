import { getServerConfig } from "@/lib/config";
import { currentDayKey, getUsageCount, incrementUsage } from "@/lib/db/ai-usage";
import type { PlanId } from "@/lib/db/users";
import { newId } from "@/lib/resume/defaults";
import { aiDailyLimitForPlan } from "@/lib/plans/rules";
import { localSuggestions } from "./local-assistant";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompts";
import { completeJson } from "./provider";
import { aiModelOutputSchema, type AiRequest, type AiResult } from "./schema";

export class AiQuotaExceededError extends Error {
  constructor(public readonly limit: number) {
    super("Limite diário de uso da IA atingido.");
    this.name = "AiQuotaExceededError";
  }
}

const LOCAL_NOTICE =
  "Assistente local (IA generativa não configurada). Orientações determinísticas, sem criar fatos.";
const AI_NOTICE =
  "Sugestões geradas por IA. Revise cada trecho antes de aplicar — nenhum fato foi inventado.";

function localResult(request: AiRequest, notice = LOCAL_NOTICE): AiResult {
  return {
    source: "local",
    notice,
    suggestions: localSuggestions(request.action, request),
  };
}

/** Extrai JSON de uma resposta que pode vir embrulhada em blocos de código. */
function extractJson(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("JSON não encontrado na resposta.");
  return JSON.parse(trimmed.slice(start, end + 1));
}

export interface SuggestionArgs {
  request: AiRequest;
  plan: PlanId;
  userId: string;
}

/**
 * Orquestra o assistente: valida cota, chama o provedor (quando configurado),
 * valida a resposta e, em qualquer falha, recorre ao assistente local.
 */
export async function getSuggestions(args: SuggestionArgs): Promise<AiResult> {
  const config = getServerConfig();

  if (!config.ai.apiKey) {
    return localResult(args.request);
  }

  const limit = aiDailyLimitForPlan(args.plan);
  const day = currentDayKey();
  const used = getUsageCount(args.userId, day);
  if (used >= limit) {
    throw new AiQuotaExceededError(limit);
  }

  try {
    const raw = await completeJson([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(args.request) },
    ]);

    const parsed = aiModelOutputSchema.safeParse(extractJson(raw));
    if (!parsed.success || parsed.data.suggestions.length === 0) {
      return localResult(
        args.request,
        "A resposta da IA não pôde ser validada. Exibindo orientações locais seguras.",
      );
    }

    const suggestions = parsed.data.suggestions.map((suggestion) => ({
      id: newId(),
      kind: (suggestion.text ? "replacement" : "advisory") as
        | "replacement"
        | "advisory",
      title: suggestion.title,
      text: suggestion.text,
      notes: suggestion.notes,
    }));

    // Consumo contabilizado apenas após uso bem-sucedido.
    incrementUsage(args.userId, day);

    return { source: "ai", notice: AI_NOTICE, suggestions };
  } catch (error) {
    console.error("[ai] falha ao consultar o provedor:", (error as Error).message);
    return localResult(
      args.request,
      "A IA está indisponível no momento. Exibindo orientações locais; sua edição manual continua funcionando.",
    );
  }
}
