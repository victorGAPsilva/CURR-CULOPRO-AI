"use client";

import { Field, Input, Label, Textarea } from "@/components/ui/fields";
import { createEmptyEducation } from "@/lib/resume/defaults";
import {
  AddItemButton,
  ItemCard,
  Section,
  moveItem,
  updateItemById,
} from "../Section";
import type { EditorSectionProps } from "../types";

export function EducationSection({ content, update }: EditorSectionProps) {
  const items = content.education;
  const set = (next: typeof items) => update({ education: next });

  return (
    <Section
      id="formacao"
      title="Formação acadêmica"
      description="Inclua graduação, cursos técnicos, tecnólogos ou ensino médio."
    >
      {items.map((item, index) => (
        <ItemCard
          key={item.id}
          title={`Formação ${index + 1}`}
          index={index}
          total={items.length}
          onMoveUp={() => set(moveItem(items, index, index - 1))}
          onMoveDown={() => set(moveItem(items, index, index + 1))}
          onRemove={() => set(items.filter((entry) => entry.id !== item.id))}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Curso" htmlFor={`degree-${item.id}`} className="sm:col-span-2">
              <Input
                id={`degree-${item.id}`}
                value={item.degree}
                onChange={(event) =>
                  set(updateItemById(items, item.id, { degree: event.target.value }))
                }
                maxLength={160}
              />
            </Field>
            <Field label="Instituição" htmlFor={`institution-${item.id}`}>
              <Input
                id={`institution-${item.id}`}
                value={item.institution}
                onChange={(event) =>
                  set(
                    updateItemById(items, item.id, {
                      institution: event.target.value,
                    }),
                  )
                }
                maxLength={160}
              />
            </Field>
            <Field label="Local" htmlFor={`edu-loc-${item.id}`}>
              <Input
                id={`edu-loc-${item.id}`}
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
            <Field label="Início" htmlFor={`edu-start-${item.id}`}>
              <Input
                id={`edu-start-${item.id}`}
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
            <Field label="Conclusão" htmlFor={`edu-end-${item.id}`}>
              <Input
                id={`edu-end-${item.id}`}
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

          <div className="flex items-center gap-2">
            <input
              id={`edu-current-${item.id}`}
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
            <Label htmlFor={`edu-current-${item.id}`} className="font-normal">
              Cursando atualmente
            </Label>
          </div>

          <Field
            label="Observações (opcional)"
            htmlFor={`edu-desc-${item.id}`}
          >
            <Textarea
              id={`edu-desc-${item.id}`}
              value={item.description}
              onChange={(event) =>
                set(
                  updateItemById(items, item.id, { description: event.target.value }),
                )
              }
              rows={2}
              maxLength={600}
            />
          </Field>
        </ItemCard>
      ))}

      <AddItemButton
        label="Adicionar formação"
        onClick={() => set([...items, createEmptyEducation()])}
      />
    </Section>
  );
}
