import { getApiUser } from "@/lib/auth/guard";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { aiRequestSchema } from "@/lib/ai/schema";
import { AiQuotaExceededError, getSuggestions } from "@/lib/ai/service";
import { jsonError, jsonOk, readJson } from "@/lib/utils/http";

export async function POST(request: Request) {
  const user = await getApiUser();
  if (!user) return jsonError("Não autenticado.", 401);

  const parsed = aiRequestSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return jsonError("Pedido inválido para o assistente.", 422);
  }

  const rate = checkRateLimit(user.id);
  if (!rate.allowed) {
    return jsonError("Muitas solicitações em pouco tempo. Aguarde um momento.", 429, {
      retryAfterMs: rate.retryAfterMs,
    });
  }

  try {
    const result = await getSuggestions({
      request: parsed.data,
      plan: user.plan,
      userId: user.id,
    });
    return jsonOk(result);
  } catch (error) {
    if (error instanceof AiQuotaExceededError) {
      return jsonError(
        `Você atingiu o limite diário de ${error.limit} usos de IA. O uso volta a ficar disponível amanhã.`,
        429,
      );
    }
    console.error("[ai] erro inesperado:", (error as Error).message);
    return jsonError("Não foi possível consultar o assistente agora.", 502);
  }
}
