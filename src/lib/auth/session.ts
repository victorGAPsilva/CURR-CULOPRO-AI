import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getServerConfig } from "@/lib/config";
import { findUserIdBySession } from "@/lib/db/sessions";
import { findUserById, type UserRecord } from "@/lib/db/users";
import {
  createSession as persistSession,
  deleteExpiredSessions,
} from "@/lib/db/sessions";

export const SESSION_COOKIE = "cp_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 dias

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function cookieOptions() {
  const config = getServerConfig();
  return {
    httpOnly: true,
    // `Secure` só quando a aplicação é servida por HTTPS. Assim, ambientes
    // locais sobre http:// funcionam sem enfraquecer a configuração em produção.
    secure: config.appUrl.startsWith("https://"),
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

/** Cria uma sessão e grava o cookie httpOnly. Retorna o token em claro. */
export async function startSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  // Limpeza oportunista de sessões expiradas.
  deleteExpiredSessions();
  persistSession(userId, hashToken(token), expiresAt);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, cookieOptions());
}

/** Encerra a sessão atual: remove do banco e limpa o cookie. */
export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const { deleteSessionByToken } = await import("@/lib/db/sessions");
    deleteSessionByToken(hashToken(token));
  }
  store.delete(SESSION_COOKIE);
}

/** Resolve o usuário autenticado a partir do cookie de sessão. */
export async function getCurrentUser(): Promise<UserRecord | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const userId = findUserIdBySession(hashToken(token));
  if (!userId) return null;

  return findUserById(userId);
}
