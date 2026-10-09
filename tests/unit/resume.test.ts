import { describe, expect, it } from "vitest";
import { createEmptyContent } from "@/lib/resume/defaults";
import { normalizeContent } from "@/lib/resume/normalize";
import { assessCompletion, completionPercent } from "@/lib/resume/progress";
import { formatMonth, formatPeriod } from "@/lib/resume/format";

describe("normalização de conteúdo", () => {
  it("remove itens vazios e espaços excedentes", () => {
    const content = createEmptyContent();
    content.personal.fullName = "  Maria  ";
    content.experiences = [
      { id: "1", role: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" },
      { id: "2", role: "Analista", company: "ACME", location: "SP", startDate: "2020-01", endDate: "", current: true, description: " Tarefas " },
    ];
    content.skills = [
      { id: "s1", name: "  " },
      { id: "s2", name: " Excel " },
    ];

    const normalized = normalizeContent(content);
    expect(normalized.personal.fullName).toBe("Maria");
    expect(normalized.experiences).toHaveLength(1);
    expect(normalized.experiences[0]!.description).toBe("Tarefas");
    expect(normalized.skills).toEqual([{ id: "s2", name: "Excel" }]);
  });
});

describe("progresso", () => {
  it("começa em 0 e aumenta conforme seções são preenchidas", () => {
    const content = createEmptyContent();
    expect(completionPercent(content)).toBe(0);

    content.personal.fullName = "Ana";
    content.personal.email = "ana@exemplo.com";
    content.personal.headline = "Analista";
    const partial = completionPercent(content);
    expect(partial).toBeGreaterThan(0);
    expect(partial).toBeLessThan(100);

    content.summary = "Resumo";
    content.experiences = [
      { id: "1", role: "Analista", company: "X", location: "", startDate: "", endDate: "", current: false, description: "" },
    ];
    content.education = [
      { id: "2", degree: "Curso", institution: "Y", location: "", startDate: "", endDate: "", current: false, description: "" },
    ];
    content.skills = [{ id: "3", name: "Excel" }];
    content.languages = [{ id: "4", name: "Inglês", level: "Intermediário" }];

    expect(completionPercent(content)).toBe(100);
    expect(assessCompletion(content).steps.every((step) => step.done)).toBe(true);
  });

  it("considera projetos como preenchimento de seção extra", () => {
    const content = createEmptyContent();
    content.projects = [{ id: "p", name: "App", link: "", description: "" }];
    const extra = assessCompletion(content).steps.find((step) => step.id === "extra");
    expect(extra?.done).toBe(true);
  });
});

describe("formatação de datas", () => {
  it("formata mês/ano e períodos", () => {
    expect(formatMonth("2023-05")).toBe("05/2023");
    expect(formatMonth("")).toBe("");
    expect(formatPeriod("2020-01", "", true)).toBe("01/2020 – Atual");
    expect(formatPeriod("2018-02", "2020-12", false)).toBe("02/2018 – 12/2020");
  });
});
