import { getApiUser } from "@/lib/auth/guard";
import { createResume, listResumesByUser } from "@/lib/db/resumes";
import { canUseTemplate } from "@/lib/plans/rules";
import { resumeInputSchema } from "@/lib/resume/schema";
import { jsonError, jsonOk, readJson } from "@/lib/utils/http";

export async function GET() {
  const user = await getApiUser();
  if (!user) return jsonError("Não autenticado.", 401);
  return jsonOk({ resumes: listResumesByUser(user.id) });
}

export async function POST(request: Request) {
  const user = await getApiUser();
  if (!user) return jsonError("Não autenticado.", 401);

  const parsed = resumeInputSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return jsonError("Dados do currículo inválidos.", 422, {
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (!canUseTemplate(user.plan, parsed.data.templateId)) {
    return jsonError(
      "O modelo escolhido está disponível apenas no plano Premium.",
      403,
    );
  }

  const resume = createResume(user.id, parsed.data);
  return jsonOk({ resume }, 201);
}
