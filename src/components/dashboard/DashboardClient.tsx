"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonStyles } from "@/components/ui/button";
import { ConfirmDialog, Modal } from "@/components/ui/dialog";
import { EmptyState, Alert, Badge, Card } from "@/components/ui/surfaces";
import { Field, Input } from "@/components/ui/fields";
import {
  IconCopy,
  IconDocument,
  IconEdit,
  IconEye,
  IconLock,
  IconPlus,
  IconTrash,
} from "@/components/ui/icons";
import { TEMPLATES } from "@/lib/resume/templates";
import { formatRelative } from "@/lib/resume/format";
import type { ResumeSummary, TemplateId } from "@/lib/resume/schema";
import type { PlanId } from "@/lib/db/users";
import { createEmptyContent } from "@/lib/resume/defaults";

export function DashboardClient({
  resumes,
  plan,
}: {
  resumes: ResumeSummary[];
  plan: PlanId;
}) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResumeSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function createResume() {
    setCreating(true);
    setError(null);
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Currículo sem título",
          templateId,
          content: createEmptyContent(),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        resume?: { id: string };
        error?: string;
      };
      if (!response.ok || !data.resume) {
        setError(data.error ?? "Não foi possível criar o currículo.");
        return;
      }
      router.push(`/curriculos/${data.resume.id}/editar`);
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setCreating(false);
    }
  }

  async function duplicate(resume: ResumeSummary) {
    setBusyId(resume.id);
    try {
      const response = await fetch(`/api/resumes/${resume.id}/duplicate`, {
        method: "POST",
      });
      if (response.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/resumes/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDeleteTarget(null);
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-950">
            Meus currículos
          </h1>
          <p className="mt-1 text-sm text-brand-600">
            Retome um currículo existente ou crie um novo para uma vaga.
          </p>
        </div>
        <Button size="lg" onClick={() => setCreateOpen(true)}>
          <IconPlus className="h-4 w-4" />
          Criar currículo
        </Button>
      </div>

      <div className="mt-8">
        {resumes.length === 0 ? (
          <EmptyState
            icon={<IconDocument className="h-6 w-6" />}
            title="Você ainda não tem currículos"
            description="Crie seu primeiro currículo escolhendo um modelo. Leva poucos minutos e você pode salvar e continuar depois."
            action={
              <Button size="lg" onClick={() => setCreateOpen(true)}>
                <IconPlus className="h-4 w-4" />
                Criar meu primeiro currículo
              </Button>
            }
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume) => {
              const template = TEMPLATES.find((t) => t.id === resume.templateId);
              const busy = busyId === resume.id;
              return (
                <li key={resume.id}>
                  <Card className="flex h-full flex-col">
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-base font-semibold text-brand-900">
                          {resume.title}
                        </h2>
                        <Badge tone="neutral">{template?.name ?? "Modelo"}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-brand-500">
                        Editado {formatRelative(resume.updatedAt)}
                      </p>

                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-brand-500">
                          <span>Preenchimento</span>
                          <span>{resume.completion}%</span>
                        </div>
                        <div
                          className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-brand-100"
                          role="progressbar"
                          aria-valuenow={resume.completion}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Preenchimento do currículo: ${resume.completion}%`}
                        >
                          <div
                            className="h-full rounded-full bg-accent-500 transition-[width]"
                            style={{ width: `${resume.completion}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 border-t border-line px-3 py-3">
                      <Link
                        href={`/curriculos/${resume.id}/editar`}
                        className={buttonStyles("outline", "sm")}
                      >
                        <IconEdit className="h-4 w-4" />
                        Editar
                      </Link>
                      <Link
                        href={`/curriculos/${resume.id}/visualizar`}
                        className={buttonStyles("ghost", "sm")}
                      >
                        <IconEye className="h-4 w-4" />
                        Ver
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicate(resume)}
                        disabled={busy}
                        aria-label={`Duplicar ${resume.title}`}
                      >
                        <IconCopy className="h-4 w-4" />
                        Duplicar
                      </Button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(resume)}
                        className={`${buttonStyles("ghost", "sm")} ml-auto text-danger-600 hover:bg-danger-50`}
                        aria-label={`Excluir ${resume.title}`}
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Modal
        open={createOpen}
        onClose={() => (!creating ? setCreateOpen(false) : undefined)}
        title="Criar novo currículo"
        description="Dê um nome e escolha um modelo. Você pode trocar o modelo depois."
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              Cancelar
            </Button>
            <Button onClick={createResume} loading={creating}>
              Criar e editar
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {error ? <Alert tone="danger">{error}</Alert> : null}
          <Field label="Título do currículo" htmlFor="resume-title" required>
            <Input
              id="resume-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Currículo — Analista de dados"
              maxLength={120}
              autoFocus
            />
          </Field>

          <fieldset>
            <legend className="text-sm font-medium text-brand-900">Modelo</legend>
            <div className="mt-2 grid gap-2">
              {TEMPLATES.map((template) => {
                const locked = template.tier === "premium" && plan !== "premium";
                const selected = templateId === template.id;
                return (
                  <label
                    key={template.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 ${
                      selected ? "border-accent-500 bg-accent-50" : "border-line"
                    } ${locked ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={selected}
                      disabled={locked}
                      onChange={() => setTemplateId(template.id)}
                      className="mt-1"
                    />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-medium text-brand-900">
                          {template.name}
                        </span>
                        {template.tier === "premium" ? (
                          locked ? (
                            <Badge tone="warning">
                              <IconLock className="h-3 w-3" />
                              Premium
                            </Badge>
                          ) : (
                            <Badge tone="accent">Premium</Badge>
                          )
                        ) : (
                          <Badge tone="success">Grátis</Badge>
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs text-brand-500">
                        {template.tagline}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Excluir currículo"
        description={
          deleteTarget
            ? `Tem certeza que deseja excluir "${deleteTarget.title}"? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
