import { beforeEach, describe, expect, it } from "vitest";
import { localSuggestions } from "@/lib/ai/local-assistant";
import { getSuggestions } from "@/lib/ai/service";
import type { AiRequest } from "@/lib/ai/schema";

function request(partial: Partial<AiRequest>): AiRequest {
  return { action: "improve_summary", text: "", context: {}, ...partial };
}

describe("assistente local", () => {
  it("detecta apenas habilidades presentes no texto", () => {
    const [suggestion] = localSuggestions(
      "extract_skills",
      request({ action: "extract_skills", text: "Uso Excel e atendo clientes." }),
    );
    const notes = suggestion!.notes!.join(" ");
    expect(notes).toContain("Excel");
    expect(notes).not.toContain("Python");
  });

  it("não cria fatos ao reescrever: mantém o conteúdo original", () => {
    const [first] = localSuggestions(
      "improve_summary",
      request({ text: "trabalhei com atendimento ao cliente" }),
    );
    if (first?.kind === "replacement") {
      expect(first.text!.toLowerCase()).toContain("atendimento ao cliente");
    }
  });

  it("oferece orientações para quem não tem experiência", () => {
    const [suggestion] = localSuggestions(
      "no_experience_help",
      request({ action: "no_experience_help" }),
    );
    expect(suggestion!.notes!.join(" ")).toMatch(/projetos/i);
  });
});

describe("serviço de sugestões", () => {
  beforeEach(() => {
    delete process.env.AI_API_KEY;
  });

  it("usa o assistente local quando a IA não está configurada", async () => {
    const result = await getSuggestions({
      request: request({ text: "organizado e proativo" }),
      plan: "free",
      userId: "user-sem-ia",
    });
    expect(result.source).toBe("local");
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.notice.toLowerCase()).toContain("ia generativa não configurada");
  });
});
