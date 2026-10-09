"use client";

import { Field, Input, Label, Textarea } from "@/components/ui/fields";
import { createEmptyExperience } from "@/lib/resume/defaults";
import {
  AddItemButton,
  ItemCard,
  Section,
  moveItem,
  updateItemById,
} from "../Section";
import { AiSuggestButton } from "../AiSuggestButton";
import type { EditorSectionProps } from "../types";

export function ExperienceSection({ content, update }: EditorSectionProps) {
  const items = content.experiences;
  const set = (next: typeof items) => update({ experiences: next });

  return (
    <Section
      id="experiencias"
      title="Experiência profissional"
      description="Liste da mais recente para a mais antiga. Use verbos de ação nas atividades."
    >
      {items.map((item, index) => (
        <ItemCard
          key={item.id}
          title={`Experiência ${index + 1}`}
          index={index}
          total={items.length}
          onMoveUp={() => set(moveItem(items, index, index - 1))}
          onMoveDown={() => set(moveItem(items, index, index + 1))}
          onRemove={() => set(items.filter((entry) => entry.id !== item.id))}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Cargo" htmlFor={`role-${item.id}`}>
              <Input
                id={`role-${item.id}`}
                value={item.role}
                onChange={(event) =>
                  set(updateItemById(items, item.id, { role: event.target.value }))
                }
                maxLength={160}
              />
            </Field>
            <Field label="Empresa" htmlFor={`company-${item.id}`}>
              <Input
                id={`company-${item.id}`}
                value={item.company}
                onChange={(event) =>
                  set(
                    updateItemById(items, item.id, { company: event.target.value }),
                  )
                }
                maxLength={160}
              />
            </Field>
            <Field label="Local" htmlFor={`exp-loc-${item.id}`}>
              <Input
                id={`exp-loc-${item.id}`}
                value={item.location}
                onChange={(event) =>
                  set(
                    updateItemById(items, item.id, { location: event.target.value }),
                  )
                }
                placeholder="Cidade, UF"
                maxLength={160}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Início" htmlFor={`exp-start-${item.id}`}>
                <Input
                  id={`exp-start-${item.id}`}
                  type="month"
                  value={item.startDate}
                  onChange={(event) =>
                    set(
                      updateItemById(items, item.id, {
                        startDate: event.target.value,
                      }),
                    )
                  }
                />
              </Field>
              <Field label="Término" htmlFor={`exp-end-${item.id}`}>
                <Input
                  id={`exp-end-${item.id}`}
                  type="month"
                  value={item.endDate}
                  disabled={item.current}
                  onChange={(event) =>
                    set(
                      updateItemById(items, item.id, { endDate: event.target.value }),
                    )
                  }
                />
              </Field>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id={`exp-current-${item.id}`}
              type="checkbox"
              checked={item.current}
              onChange={(event) =>
                set(
                  updateItemById(items, item.id, {
                    current: event.target.checked,
                    endDate: event.target.checked ? "" : item.endDate,
                  }),
                )
              }
              className="h-4 w-4 rounded border-line"
            />
            <Label htmlFor={`exp-current-${item.id}`} className="font-normal">
              Trabalho aqui atualmente
            </Label>
          </div>

          <Field
            label="Atividades e responsabilidades"
            htmlFor={`exp-desc-${item.id}`}
            hint="Uma atividade por linha. Não inclua resultados que você não pode comprovar."
          >
            <Textarea
              id={`exp-desc-${item.id}`}
              value={item.description}
              onChange={(event) =>
                set(
                  updateItemById(items, item.id, { description: event.target.value }),
                )
              }
              rows={4}
              maxLength={4000}
            />
          </Field>

          <AiSuggestButton
            action="rewrite_experience"
            label="Melhorar descrição"
            sectionLabel="Experiência profissional"
            targetRole={content.personal.headline}
            getText={() => item.description}
            onApply={(text) =>
              set(updateItemById(items, item.id, { description: text }))
            }
            disabled={item.description.trim().length === 0}
          />
        </ItemCard>
      ))}

      <AddItemButton
        label="Adicionar experiência"
        onClick={() => set([...items, createEmptyExperience()])}
      />
    </Section>
  );
}
