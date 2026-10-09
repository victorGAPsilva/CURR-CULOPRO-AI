"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/fields";
import { Alert } from "@/components/ui/surfaces";
import { IconArrowLeft, IconArrowRight, IconCheck, IconEye, IconSpinner } from "@/components/ui/icons";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { ResumePaper } from "@/components/resume/ResumePaper";
import { cn } from "@/lib/utils/cn";
import { TEMPLATES } from "@/lib/resume/templates";
import type {
  ResumeContent,
  ResumeInput,
  ResumeRecord,
  TemplateId,
} from "@/lib/resume/schema";
import type { PlanId } from "@/lib/db/users";
import { EditorAssistant } from "./EditorAssistant";
import { PersonalSection } from "./sections/PersonalSection";
import { SummarySection } from "./sections/SummarySection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { CoursesSection } from "./sections/CoursesSection";
import { SkillsSection } from "./sections/SkillsSection";
import { LanguagesSection } from "./sections/LanguagesSection";
import { ProjectsSection } from "./sections/ProjectsSection";

type SaveStatus = "saved" | "dirty" | "saving" | "error";

const AUTOSAVE_DELAY_MS = 1500;

const SECTION_LINKS = [
  { id: "dados", label: "Dados" },
  { id: "resumo", label: "Resumo" },
  { id: "experiencias", label: "Experiência" },
  { id: "formacao", label: "Formação" },
  { id: "cursos", label: "Cursos" },
  { id: "habilidades", label: "Habilidades" },
  { id: "idiomas", label: "Idiomas" },
  { id: "projetos", label: "Projetos" },
];

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EditorShell({
  resume,
  plan,
}: {
  resume: ResumeRecord;
  plan: PlanId;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<ResumeInput>({
    title: resume.title,
    templateId: resume.templateId,
    content: resume.content,
  });
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState(resume.updatedAt);
  const [view, setView] = useState<"edit" | "preview">("edit");

  const draftRef = useRef(draft);
  const savedRef = useRef<ResumeInput>(draft);
  const baseUpdatedAt = useRef(resume.updatedAt);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mantém o ref sincronizado com o rascunho mais recente (fora da renderização).
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const save = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const payload = draftRef.current;
    setStatus("saving");
    setError(null);

    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, updatedAt: baseUpdatedAt.current }),
      });

      if (response.status === 409) {
        setStatus("error");
        setError(
          "Este currículo foi alterado em outro lugar. Recarregue a página antes de salvar para não perder dados.",
        );
        return;
      }

      const data = (await response.json().catch(() => ({}))) as {
        resume?: ResumeRecord;
        error?: string;
      };

      if (!response.ok || !data.resume) {
        setStatus("error");
        setError(data.error ?? "Não foi possível salvar. Tente novamente.");
        return;
      }

      savedRef.current = payload;
      baseUpdatedAt.current = data.resume.updatedAt;
      setLastSavedAt(data.resume.updatedAt);
      // Se nada mudou desde o início do salvamento, está limpo.
      setStatus(
        JSON.stringify(draftRef.current) === JSON.stringify(payload)
          ? "saved"
          : "dirty",
      );
    } catch {
      setStatus("error");
      setError("Falha de conexão ao salvar. Suas alterações continuam nesta tela.");
    }
  }, [resume.id]);

  // Autosave com atraso controlado (evita uma requisição por tecla).
  useEffect(() => {
    if (JSON.stringify(draft) === JSON.stringify(savedRef.current)) return;
    setStatus((current) => (current === "saving" ? current : "dirty"));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void save();
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [draft, save]);

  // Aviso ao sair com alterações pendentes.
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (status === "dirty" || status === "saving" || status === "error") {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [status]);

  function update(patch: Partial<ResumeContent>) {
    setDraft((current) => ({
      ...current,
      content: { ...current.content, ...patch },
    }));
  }

  async function saveThenNavigate(href: string) {
    if (status !== "saved") await save();
    router.push(href);
  }

  const templateLocked = (id: TemplateId) =>
    plan !== "premium" && id !== "classic";

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="container-page flex flex-wrap items-center gap-3 py-3">
          <Link
            href="/painel"
            className={buttonStyles("ghost", "sm")}
            aria-label="Voltar para meus currículos"
          >
            <IconArrowLeft className="h-4 w-4" />
            Painel
          </Link>

          <div className="min-w-40 flex-1">
            <label htmlFor="resume-title" className="sr-only">
              Título do currículo
            </label>
            <Input
              id="resume-title"
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({ ...current, title: event.target.value }))
              }
              maxLength={120}
              className="font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveThenNavigate(`/curriculos/${resume.id}/visualizar`)}
            >
              <IconEye className="h-4 w-4" />
              Visualizar
            </Button>
            <Button size="sm" onClick={save} loading={status === "saving"}>
              Salvar
            </Button>
          </div>
        </div>
      </header>

      <main className="container-page py-6">
        {error ? (
          <Alert tone="danger" className="mb-4">
            {error}
          </Alert>
        ) : null}

        {/* Alternância para telas pequenas */}
        <div className="mb-4 flex gap-2 lg:hidden" role="group" aria-label="Modo de exibição">
          <button
            type="button"
            aria-pressed={view === "edit"}
            onClick={() => setView("edit")}
            className={cn(
              "flex-1 rounded-md border px-3 py-2 text-sm font-medium",
              view === "edit"
                ? "border-accent-500 bg-accent-50 text-accent-700"
                : "border-line bg-white text-brand-700",
            )}
          >
            Editar
          </button>
          <button
            type="button"
            aria-pressed={view === "preview"}
            onClick={() => setView("preview")}
            className={cn(
              "flex-1 rounded-md border px-3 py-2 text-sm font-medium",
              view === "preview"
                ? "border-accent-500 bg-accent-50 text-accent-700"
                : "border-line bg-white text-brand-700",
            )}
          >
            Pré-visualizar
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Coluna de edição */}
          <div className={cn("space-y-5", view === "preview" && "hidden lg:block")}>
            <div className="rounded-lg border border-line bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1">
                  <label htmlFor="template-select" className="text-sm font-medium text-brand-900">
                    Modelo
                  </label>
                  <Select
                    id="template-select"
                    value={draft.templateId}
                    className="mt-1"
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        templateId: event.target.value as TemplateId,
                      }))
                    }
                  >
                    {TEMPLATES.map((template) => (
                      <option
                        key={template.id}
                        value={template.id}
                        disabled={templateLocked(template.id)}
                      >
                        {template.name}
                        {templateLocked(template.id) ? " (Premium)" : ""}
                      </option>
                    ))}
                  </Select>
                </div>
                <p className="text-xs text-brand-500">
                  Trocar de modelo não altera seus dados.
                </p>
              </div>
            </div>

            <EditorAssistant content={draft.content} />

            <nav aria-label="Seções do currículo" className="flex flex-wrap gap-1.5">
              {SECTION_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#secao-${link.id}`}
                  className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-brand-700 hover:border-brand-200 hover:bg-brand-50"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <PersonalSection content={draft.content} update={update} />
            <SummarySection content={draft.content} update={update} />
            <ExperienceSection content={draft.content} update={update} />
            <EducationSection content={draft.content} update={update} />
            <CoursesSection content={draft.content} update={update} />
            <SkillsSection content={draft.content} update={update} />
            <LanguagesSection content={draft.content} update={update} />
            <ProjectsSection content={draft.content} update={update} />

            <div className="flex justify-end pb-4">
              <Button onClick={save} loading={status === "saving"}>
                Salvar currículo
              </Button>
            </div>
          </div>

          {/* Coluna de pré-visualização */}
          <div className={cn("lg:sticky lg:top-24", view === "edit" && "hidden lg:block")}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-brand-900">
                Pré-visualização (A4)
              </h2>
              <button
                type="button"
                onClick={() => saveThenNavigate(`/curriculos/${resume.id}/visualizar`)}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent-700 hover:underline"
              >
                Exportar em PDF
                <IconArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <ResumePaper maxWidth={720}>
              <ResumeDocument
                content={draft.content}
                templateId={draft.templateId}
              />
            </ResumePaper>
          </div>
        </div>
      </main>
    </div>
  );
}

function SaveIndicator({
  status,
  lastSavedAt,
}: {
  status: SaveStatus;
  lastSavedAt: string;
}) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-brand-500" role="status">
        <IconSpinner className="h-4 w-4" />
        Salvando…
      </span>
    );
  }
  if (status === "dirty") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-warning-700" role="status">
        <span aria-hidden className="h-2 w-2 rounded-full bg-warning-600" />
        Não salvo
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-danger-700" role="status">
        <span aria-hidden className="h-2 w-2 rounded-full bg-danger-600" />
        Erro ao salvar
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-success-700" role="status">
      <IconCheck className="h-4 w-4" />
      Salvo às {timeLabel(lastSavedAt)}
    </span>
  );
}
