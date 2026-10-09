import { getApiUser } from "@/lib/auth/guard";
import { duplicateResume } from "@/lib/db/resumes";
import { jsonError, jsonOk } from "@/lib/utils/http";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const user = await getApiUser();
  if (!user) return jsonError("Não autenticado.", 401);

  const { id } = await context.params;
  const copy = duplicateResume(id, user.id);
  if (!copy) return jsonError("Currículo não encontrado.", 404);

  return jsonOk({ resume: copy }, 201);
}
