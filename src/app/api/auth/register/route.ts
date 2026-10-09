import { hashPassword } from "@/lib/auth/password";
import { validatePasswordStrength } from "@/lib/auth/password";
import { startSession } from "@/lib/auth/session";
import { createUser, findUserByEmail } from "@/lib/db/users";
import { fieldErrors, registerSchema } from "@/lib/validation/auth";
import { jsonError, jsonOk, readJson } from "@/lib/utils/http";

export async function POST(request: Request) {
  const body = await readJson(request);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Verifique os campos informados.", 422, {
      fields: fieldErrors(parsed.error),
    });
  }

  const { name, email, password } = parsed.data;

  const strengthError = validatePasswordStrength(password);
  if (strengthError) {
    return jsonError("Senha inválida.", 422, { fields: { password: strengthError } });
  }

  if (findUserByEmail(email)) {
    return jsonError("Já existe uma conta com este e-mail.", 409, {
      fields: { email: "Este e-mail já está cadastrado." },
    });
  }

  const passwordHash = await hashPassword(password);
  const user = createUser({ email, passwordHash, name });
  await startSession(user.id);

  return jsonOk({ user }, 201);
}
