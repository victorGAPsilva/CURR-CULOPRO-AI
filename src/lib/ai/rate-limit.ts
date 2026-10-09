/**
 * Limitador de requisições em memória para a rota de IA.
 * Protege contra rajadas enquanto o limite de consumo diário é controlado no
 * banco. Em produção com múltiplas instâncias, substituir por um store
 * compartilhado (Redis ou similar) — documentado nas limitações.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;

const buckets = new Map<string, number[]>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((ts) => now - ts < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0]!;
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - oldest) };
  }

  recent.push(now);
  buckets.set(key, recent);
  return { allowed: true, retryAfterMs: 0 };
}
