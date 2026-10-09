import { getApiUser } from "@/lib/auth/guard";
import { deleteResume, getResumeById, updateResume } from "@/lib/db/resumes";
import { canUseTemplate } from "@/lib/plans/rules";
import { resumeInputSchema } from "@/lib/resume/schema";
import { jsonError, jsonOk, readJson } from "@/lib/utils/http";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const user = await getApiUser();
  if (!user) return jsonError("Não autenticado.", 401);

  const { id } = await context.params;
  const resume = getResumeById(id, user.id);
  if (!resume) return jsonError("Currículo não encontrado.", 404);

  return jsonOk({ resume });
}

export async function PUT(request: Request, context: RouteContext) {
  const user = await getApiUser();
  if (!user) return jsonError("Não autenticado.", 401);

  const { id } = await context.params;
  const body = await readJson(request);
  const parsed = resumeInputSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Dados do currículo inválidos.", 422, {
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (!canUseTemplate(user.plan, parsed.data.templateId)) {
    return jsonError("O modelo escolhido está disponível apenas no plano Premium.", 403);
  }

  // Concorrência otimista: se o cliente informou a versão que conhece, ela
  // precisa bater com a versão atual. Caso contrário, outra sessão salvou antes.
  const current = getResumeById(id, user.id);
  if (!current) return jsonError("Currículo não encontrado.", 404);

  const baseUpdatedAt =
    body && typeof body === "object" && "updatedAt" in body
      ? (body as { updatedAt?: unknown }).updatedAt
      : undefined;
  if (typeof baseUpdatedAt === "string" && baseUpdatedAt !== current.updatedAt) {
    return jsonError(
      "O currículo foi alterado em outra sessão. Recarregue a página para continuar.",
      409,
    );
  }

  const updated = updateResume(id, user.id, parsed.data);
  if (!updated) return jsonError("Currículo não encontrado.", 404);

  return jsonOk({ resume: updated });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getApiUser();
  if (!user) return jsonError("Não autenticado.", 401);

  const { id } = await context.params;
  const removed = deleteResume(id, user.id);
  if (!removed) return jsonError("Currículo não encontrado.", 404);

  return jsonOk({ ok: true });
}
