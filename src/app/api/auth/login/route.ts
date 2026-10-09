import { verifyPassword } from "@/lib/auth/password";
import { startSession } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/db/users";
import { fieldErrors, loginSchema } from "@/lib/validation/auth";
import { jsonError, jsonOk, readJson } from "@/lib/utils/http";

export async function POST(request: Request) {
  const body = await readJson(request);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Verifique os campos informados.", 422, {
      fields: fieldErrors(parsed.error),
    });
  }

  const { email, password } = parsed.data;
  const user = findUserByEmail(email);

  // Mensagem genérica para não revelar se o e-mail existe.
  const invalid = jsonError("E-mail ou senha incorretos.", 401);
  if (!user) return invalid;

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return invalid;

  await startSession(user.id);

  return jsonOk({
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
  });
}
