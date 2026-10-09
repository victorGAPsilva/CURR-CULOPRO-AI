import { getDb } from "./client";

export function getUsageCount(userId: string, day: string): number {
  const row = getDb()
    .prepare("SELECT count FROM ai_usage WHERE user_id = ? AND day = ?")
    .get(userId, day) as { count: number } | undefined;
  return row?.count ?? 0;
}

/** Incrementa o consumo do dia e retorna o total atualizado. */
export function incrementUsage(userId: string, day: string): number {
  const row = getDb()
    .prepare(
      `INSERT INTO ai_usage (user_id, day, count) VALUES (?, ?, 1)
       ON CONFLICT(user_id, day) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .get(userId, day) as { count: number } | undefined;
  return row?.count ?? 1;
}

/** Retorna o dia atual no formato AAAA-MM-DD (UTC). */
export function currentDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
