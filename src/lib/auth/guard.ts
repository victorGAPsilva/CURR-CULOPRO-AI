import { redirect } from "next/navigation";
import type { UserRecord } from "@/lib/db/users";
import { getCurrentUser } from "./session";

/** Usado em Server Components/páginas para exigir autenticação. */
export async function requireUser(): Promise<UserRecord> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  return user;
}

/** Usado em route handlers; retorna null em vez de redirecionar. */
export async function getApiUser(): Promise<UserRecord | null> {
  return getCurrentUser();
}
