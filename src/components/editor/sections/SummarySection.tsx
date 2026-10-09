"use client";

import { Field, Textarea } from "@/components/ui/fields";
import { Section } from "../Section";
import { AiSuggestButton } from "../AiSuggestButton";
import type { EditorSectionProps } from "../types";

export function SummarySection({ content, update }: EditorSectionProps) {
  const hasText = content.summary.trim().length > 0;

  return (
    <Section
      id="resumo"
      title="Resumo profissional"
      description="De 2 a 4 linhas sobre quem você é profissionalmente e o que busca."
      action={
        <AiSuggestButton
          action="improve_summary"
          label="Melhorar redação"
          sectionLabel="Resumo profissional"
          targetRole={content.personal.headline}
          getText={() => content.summary}
          onApply={(text) => update({ summary: text })}
        />
      }
    >
      <Field
        label="Resumo"
        htmlFor="summary"
        hint={
          hasText
            ? `${content.summary.trim().length} caracteres`
            : "Escreva livremente. A IA pode ajudar a clarear depois."
        }
      >
        <Textarea
          id="summary"
          value={content.summary}
          onChange={(event) => update({ summary: event.target.value })}
          rows={5}
          maxLength={4000}
          placeholder="Ex.: Profissional de atendimento com experiência em suporte ao cliente, organizada e focada em resolver problemas."
        />
      </Field>
    </Section>
  );
}
