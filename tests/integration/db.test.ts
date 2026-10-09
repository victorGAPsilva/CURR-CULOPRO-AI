import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "@/lib/db/users";
import {
  createResume,
  deleteResume,
  duplicateResume,
  getResumeById,
  listResumesByUser,
  updateResume,
} from "@/lib/db/resumes";
import { createSession, findUserIdBySession } from "@/lib/db/sessions";
import {
  currentDayKey,
  getUsageCount,
  incrementUsage,
} from "@/lib/db/ai-usage";
import { createEmptyContent } from "@/lib/resume/defaults";

async function makeUser(label: string) {
  const email = `${label}-${randomUUID()}@exemplo.com`;
  const passwordHash = await hashPassword("Senha1234");
  return createUser({ email, passwordHash, name: label });
}

describe("usuários e autenticação", () => {
  it("cria usuário, normaliza e-mail e verifica senha", async () => {
    const email = `Teste-${randomUUID()}@Exemplo.com`;
    const passwordHash = await hashPassword("Senha1234");
    const user = createUser({ email, passwordHash, name: "Teste" });

    expect(user.email).toBe(email.toLowerCase());
    const found = findUserByEmail(email.toUpperCase());
    expect(found?.id).toBe(user.id);
    await expect(verifyPassword("Senha1234", found!.passwordHash)).resolves.toBe(
      true,
    );
    expect(findUserById(user.id)?.name).toBe("Teste");
  });

  it("cria e resolve sessões pelo hash do token", async () => {
    const user = await makeUser("sessao");
    const tokenHash = randomUUID();
    createSession(user.id, tokenHash, new Date(Date.now() + 60_000));

    expect(findUserIdBySession(tokenHash)).toBe(user.id);
    expect(findUserIdBySession("inexistente")).toBeNull();
  });

  it("ignora e descarta sessões expiradas", async () => {
    const user = await makeUser("expirada");
    const tokenHash = randomUUID();
    createSession(user.id, tokenHash, new Date(Date.now() - 1000));
    expect(findUserIdBySession(tokenHash)).toBeNull();
  });
});

describe("currículos: ciclo de vida e isolamento", () => {
  it("cria, lista, atualiza, duplica e exclui", async () => {
    const user = await makeUser("dono");
    const content = createEmptyContent();
    content.personal.fullName = "Dono Teste";

    const created = createResume(user.id, {
      title: "Currículo A",
      templateId: "classic",
      content,
    });

    expect(listResumesByUser(user.id).map((r) => r.id)).toContain(created.id);
    expect(getResumeById(created.id, user.id)?.content.personal.fullName).toBe(
      "Dono Teste",
    );

    const updated = updateResume(created.id, user.id, {
      title: "Currículo A+",
      templateId: "modern",
      content: { ...content, summary: "Atualizado" },
    });
    expect(updated?.title).toBe("Currículo A+");
    expect(updated?.templateId).toBe("modern");

    const copy = duplicateResume(created.id, user.id);
    expect(copy?.id).not.toBe(created.id);
    expect(copy?.title).toContain("cópia");

    expect(deleteResume(created.id, user.id)).toBe(true);
    expect(getResumeById(created.id, user.id)).toBeNull();
  });

  it("impede acesso de outro usuário às operações", async () => {
    const owner = await makeUser("owner");
    const intruder = await makeUser("intruder");
    const created = createResume(owner.id, {
      title: "Privado",
      templateId: "classic",
      content: createEmptyContent(),
    });

    expect(getResumeById(created.id, intruder.id)).toBeNull();
    expect(
      updateResume(created.id, intruder.id, {
        title: "Hackeado",
        templateId: "classic",
        content: createEmptyContent(),
      }),
    ).toBeNull();
    expect(duplicateResume(created.id, intruder.id)).toBeNull();
    expect(deleteResume(created.id, intruder.id)).toBe(false);

    // O dono continua com acesso e conteúdo intacto.
    expect(getResumeById(created.id, owner.id)?.title).toBe("Privado");
    expect(listResumesByUser(intruder.id)).toHaveLength(0);
  });
});

describe("consumo de IA", () => {
  it("conta e incrementa o uso diário", async () => {
    const user = await makeUser("consumo");
    const day = currentDayKey();
    expect(getUsageCount(user.id, day)).toBe(0);
    expect(incrementUsage(user.id, day)).toBe(1);
    expect(incrementUsage(user.id, day)).toBe(2);
    expect(getUsageCount(user.id, day)).toBe(2);
  });
});
