import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { createEmptyContent } from "@/lib/resume/defaults";
import { SAMPLE_RESUME } from "@/lib/resume/sample";

describe("renderização dos modelos", () => {
  it("omite seções vazias no currículo final", () => {
    const content = createEmptyContent();
    content.personal.fullName = "João Silva";

    for (const templateId of ["classic", "modern", "minimal"] as const) {
      const html = renderToStaticMarkup(
        <ResumeDocument content={content} templateId={templateId} />,
      );
      expect(html).toContain("João Silva");
      expect(html).not.toMatch(/Experiência profissional/i);
      expect(html).not.toMatch(/Formação acadêmica/i);
      expect(html).not.toMatch(/Projetos/i);
    }
  });

  it("renderiza o conteúdo real quando preenchido", () => {
    const html = renderToStaticMarkup(
      <ResumeDocument content={SAMPLE_RESUME} templateId="modern" />,
    );
    expect(html).toContain("Ana Carolina Souza");
    expect(html).toContain("Analista de Atendimento");
    expect(html).toContain("Empresa Exemplo Ltda.");
    expect(html).toContain("Excel");
  });

  it("os três modelos compartilham os mesmos dados", () => {
    const classic = renderToStaticMarkup(
      <ResumeDocument content={SAMPLE_RESUME} templateId="classic" />,
    );
    const minimal = renderToStaticMarkup(
      <ResumeDocument content={SAMPLE_RESUME} templateId="minimal" />,
    );
    for (const token of ["Ana Carolina Souza", "Instituição Exemplo", "Inglês"]) {
      expect(classic).toContain(token);
      expect(minimal).toContain(token);
    }
  });
});
