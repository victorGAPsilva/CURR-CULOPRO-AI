"use client";

import { Field, Input } from "@/components/ui/fields";
import { Section } from "../Section";
import type { EditorSectionProps } from "../types";

export function PersonalSection({ content, update }: EditorSectionProps) {
  const { personal } = content;
  const set = (patch: Partial<typeof personal>) =>
    update({ personal: { ...personal, ...patch } });

  return (
    <Section
      id="dados"
      title="Dados pessoais"
      description="Apenas o necessário. Não pedimos endereço completo nem documentos."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome completo" htmlFor="fullName" required className="sm:col-span-2">
          <Input
            id="fullName"
            value={personal.fullName}
            onChange={(event) => set({ fullName: event.target.value })}
            autoComplete="name"
            maxLength={120}
          />
        </Field>
        <Field
          label="Cargo ou objetivo profissional"
          htmlFor="headline"
          hint="Ex.: Analista de dados, Assistente administrativo"
          className="sm:col-span-2"
        >
          <Input
            id="headline"
            value={personal.headline}
            onChange={(event) => set({ headline: event.target.value })}
            maxLength={160}
          />
        </Field>
        <Field label="E-mail" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            value={personal.email}
            onChange={(event) => set({ email: event.target.value })}
            autoComplete="email"
            maxLength={160}
          />
        </Field>
        <Field label="Telefone" htmlFor="phone">
          <Input
            id="phone"
            value={personal.phone}
            onChange={(event) => set({ phone: event.target.value })}
            autoComplete="tel"
            placeholder="(11) 90000-0000"
            maxLength={160}
          />
        </Field>
        <Field label="Cidade e estado" htmlFor="location">
          <Input
            id="location"
            value={personal.location}
            onChange={(event) => set({ location: event.target.value })}
            placeholder="São Paulo, SP"
            maxLength={160}
          />
        </Field>
        <Field label="LinkedIn" htmlFor="linkedin">
          <Input
            id="linkedin"
            value={personal.linkedin}
            onChange={(event) => set({ linkedin: event.target.value })}
            placeholder="linkedin.com/in/seu-perfil"
            maxLength={160}
          />
        </Field>
        <Field label="Site ou portfólio" htmlFor="website" className="sm:col-span-2">
          <Input
            id="website"
            value={personal.website}
            onChange={(event) => set({ website: event.target.value })}
            placeholder="github.com/seu-usuario"
            maxLength={160}
          />
        </Field>
      </div>
    </Section>
  );
}
