import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/guard";
import { getResumeById } from "@/lib/db/resumes";
import { getTemplate } from "@/lib/resume/templates";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { ResumePaper } from "@/components/resume/ResumePaper";
import { PdfDownloadButton } from "@/components/pdf/PdfDownloadButton";
import { PrintButton } from "@/components/pdf/PrintButton";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/surfaces";
import { IconArrowLeft, IconEdit } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Visualizar e exportar",
  robots: { index: false, follow: false },
};

export default async function ResumeViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const resume = getResumeById(id, user.id);
  if (!resume) notFound();

  const template = getTemplate(resume.templateId);

  return (
    <div className="min-h-screen bg-canvas">
      <header className="no-print sticky top-0 z-30 border-b border-line bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Link href="/painel" className={buttonStyles("ghost", "sm")}>
              <IconArrowLeft className="h-4 w-4" />
              Painel
            </Link>
            <div>
              <h1 className="text-sm font-semibold text-brand-900">
                {resume.title}
              </h1>
              <div className="mt-0.5 flex items-center gap-2">
                <Badge tone="neutral">{template.name}</Badge>
                <span className="text-xs text-brand-500">Formato A4</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/curriculos/${resume.id}/editar`}
              className={buttonStyles("outline", "sm")}
            >
              <IconEdit className="h-4 w-4" />
              Editar
            </Link>
            <PrintButton />
            <PdfDownloadButton
              content={resume.content}
              templateId={resume.templateId}
              title={resume.title}
            />
          </div>
        </div>
      </header>

      <main className="container-page py-8">
        <p className="no-print mb-4 text-xs text-brand-500">
          Confira o resultado antes de enviar. As margens mostradas aqui são as
          mesmas aplicadas na impressão e no PDF.
        </p>

        {/* Pré-visualização em tela, escalada para caber na largura */}
        <div className="no-print">
          <ResumePaper maxWidth={820}>
            <ResumeDocument
              content={resume.content}
              templateId={resume.templateId}
            />
          </ResumePaper>
        </div>

        {/* Conteúdo real impresso (oculto na tela, visível no papel) */}
        <div className="print-area hidden print:block">
          <ResumeDocument
            content={resume.content}
            templateId={resume.templateId}
          />
        </div>
      </main>
    </div>
  );
}
