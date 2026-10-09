"use client";

import { Input } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";
import { createEmptySkill } from "@/lib/resume/defaults";
import { IconPlus, IconTrash } from "@/components/ui/icons";
import { Section, updateItemById } from "../Section";
import type { EditorSectionProps } from "../types";
import type { Skill } from "@/lib/resume/schema";

function SkillList({
  title,
  hint,
  items,
  onChange,
  placeholder,
}: {
  title: string;
  hint: string;
  items: Skill[];
  onChange: (next: Skill[]) => void;
  placeholder: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-brand-900">{title}</h3>
      <p className="mt-0.5 text-xs text-brand-500">{hint}</p>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <Input
              aria-label={`${title} ${index + 1}`}
              value={item.name}
              placeholder={placeholder}
              maxLength={160}
              onChange={(event) =>
                onChange(updateItemById(items, item.id, { name: event.target.value }))
              }
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
              className="rounded-md p-2 text-danger-600 hover:bg-danger-50"
              aria-label={`Remover ${item.name || title}`}
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, createEmptySkill()])}
        >
          <IconPlus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}

export function SkillsSection({ content, update }: EditorSectionProps) {
  return (
    <Section
      id="habilidades"
      title="Habilidades"
      description="Separe ferramentas e competências técnicas das habilidades comportamentais."
    >
      <SkillList
        title="Habilidades técnicas"
        hint="Ferramentas, tecnologias e conhecimentos específicos."
        items={content.skills}
        onChange={(skills) => update({ skills })}
        placeholder="Ex.: Excel, Python, CRM"
      />
      <div className="border-t border-line pt-4">
        <SkillList
          title="Habilidades interpessoais"
          hint="Competências comportamentais que você demonstra no trabalho."
          items={content.softSkills}
          onChange={(softSkills) => update({ softSkills })}
          placeholder="Ex.: Comunicação, organização"
        />
      </div>
    </Section>
  );
}
