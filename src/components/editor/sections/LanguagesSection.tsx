"use client";

import { Input, Select } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";
import { createEmptyLanguage } from "@/lib/resume/defaults";
import { IconPlus, IconTrash } from "@/components/ui/icons";
import { LANGUAGE_LEVELS } from "@/lib/resume/schema";
import { Section, updateItemById } from "../Section";
import type { EditorSectionProps } from "../types";

export function LanguagesSection({ content, update }: EditorSectionProps) {
  const items = content.languages;
  const set = (next: typeof items) => update({ languages: next });

  return (
    <Section
      id="idiomas"
      title="Idiomas"
      description="Informe apenas o nível que você realmente tem."
    >
      {items.map((item, index) => (
        <div key={item.id} className="flex flex-wrap items-center gap-2">
          <Input
            aria-label={`Idioma ${index + 1}`}
            value={item.name}
            placeholder="Ex.: Inglês"
            maxLength={160}
            className="min-w-40 flex-1"
            onChange={(event) =>
              set(updateItemById(items, item.id, { name: event.target.value }))
            }
          />
          <Select
            aria-label={`Nível do idioma ${index + 1}`}
            value={item.level}
            className="w-40"
            onChange={(event) =>
              set(
                updateItemById(items, item.id, {
                  level: event.target.value as (typeof LANGUAGE_LEVELS)[number],
                }),
              )
            }
          >
            {LANGUAGE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
          <button
            type="button"
            onClick={() => set(items.filter((entry) => entry.id !== item.id))}
            className="rounded-md p-2 text-danger-600 hover:bg-danger-50"
            aria-label={`Remover ${item.name || "idioma"}`}
          >
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => set([...items, createEmptyLanguage()])}
      >
        <IconPlus className="h-4 w-4" />
        Adicionar idioma
      </Button>
    </Section>
  );
}
