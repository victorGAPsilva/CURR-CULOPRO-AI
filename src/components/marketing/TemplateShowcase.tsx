"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/surfaces";
import { SAMPLE_RESUME } from "@/lib/resume/sample";
import type { TemplateId } from "@/lib/resume/schema";
import { TEMPLATES } from "@/lib/resume/templates";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { ResumePaper } from "@/components/resume/ResumePaper";

/** Vitrine interativa dos modelos, usando um currículo de exemplo. */
export function TemplateShowcase() {
  const [active, setActive] = useState<TemplateId>("classic");
  const meta = TEMPLATES.find((template) => template.id === active)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start">
      <div>
        <div
          role="tablist"
          aria-label="Modelos de currículo"
          className="flex flex-col gap-2"
        >
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              role="tab"
              aria-selected={active === template.id}
              onClick={() => setActive(template.id)}
              className={cn(
                "rounded-lg border px-4 py-3 text-left transition-colors",
                active === template.id
                  ? "border-accent-500 bg-accent-50"
                  : "border-line bg-white hover:border-brand-200",
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-brand-900">
                  {template.name}
                </span>
                {template.tier === "premium" ? (
                  <Badge tone="accent">Premium</Badge>
                ) : (
                  <Badge tone="success">Grátis</Badge>
                )}
              </span>
              <span className="mt-0.5 block text-xs text-brand-500">
                {template.tagline}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-brand-600">{meta.description}</p>
      </div>

      <div className="rounded-xl bg-brand-50 p-4 sm:p-6">
        <ResumePaper maxWidth={720}>
          <ResumeDocument content={SAMPLE_RESUME} templateId={active} />
        </ResumePaper>
      </div>
    </div>
  );
}
