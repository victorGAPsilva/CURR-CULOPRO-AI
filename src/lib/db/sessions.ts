import { randomUUID } from "node:crypto";
import { getDb } from "./client";

interface SessionRow {
  id: string;
  user_id: string;
  expires_at: string;
}

export function createSession(
  userId: string,
  tokenHash: string,
  expiresAt: Date,
): void {
  getDb()
    .prepare(
      `INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(
      randomUUID(),
      userId,
      tokenHash,
      new Date().toISOString(),
      expiresAt.toISOString(),
    );
}

export function findUserIdBySession(tokenHash: string): string | null {
  const row = getDb()
    .prepare("SELECT id, user_id, expires_at FROM sessions WHERE token_hash = ?")
    .get(tokenHash) as SessionRow | undefined;

  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    deleteSessionByToken(tokenHash);
    return null;
  }
  return row.user_id;
}

export function deleteSessionByToken(tokenHash: string): void {
  getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
}

export function deleteExpiredSessions(): void {
  getDb()
    .prepare("DELETE FROM sessions WHERE expires_at <= ?")
    .run(new Date().toISOString());
}
