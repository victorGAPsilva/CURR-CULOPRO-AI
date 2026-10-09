"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/surfaces";
import { IconDownload } from "@/components/ui/icons";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

function slugify(value: string): string {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase()
      .slice(0, 60) || "curriculo"
  );
}

/**
 * Gera o PDF no navegador a partir do conteúdo real do currículo
 * (não é uma captura de tela). O pacote é carregado sob demanda.
 */
export function PdfDownloadButton({
  content,
  templateId,
  title,
}: {
  content: ResumeContent;
  templateId: TemplateId;
  title: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setLoading(true);
    setError(null);
    try {
      const [{ pdf }, { ResumePdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./ResumePdf"),
      ]);

      const blob = await pdf(
        <ResumePdf content={content} templateId={templateId} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${slugify(title)}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError(
        "Não foi possível gerar o PDF. Você ainda pode usar a opção Imprimir e escolher 'Salvar como PDF'.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button onClick={download} loading={loading}>
        <IconDownload className="h-4 w-4" />
        Baixar PDF
      </Button>
      {error ? (
        <Alert tone="danger" className="max-w-xs">
          {error}
        </Alert>
      ) : null}
    </div>
  );
}
