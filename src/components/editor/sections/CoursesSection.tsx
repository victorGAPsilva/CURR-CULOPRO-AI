"use client";

import { Field, Input } from "@/components/ui/fields";
import { createEmptyCourse } from "@/lib/resume/defaults";
import {
  AddItemButton,
  ItemCard,
  Section,
  moveItem,
  updateItemById,
} from "../Section";
import type { EditorSectionProps } from "../types";

export function CoursesSection({ content, update }: EditorSectionProps) {
  const items = content.courses;
  const set = (next: typeof items) => update({ courses: next });

  return (
    <Section
      id="cursos"
      title="Cursos e certificações"
      description="Cursos livres, técnicos e certificações que você realmente concluiu."
    >
      {items.map((item, index) => (
        <ItemCard
          key={item.id}
          title={`Curso ${index + 1}`}
          index={index}
          total={items.length}
          onMoveUp={() => set(moveItem(items, index, index - 1))}
          onMoveDown={() => set(moveItem(items, index, index + 1))}
          onRemove={() => set(items.filter((entry) => entry.id !== item.id))}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Curso" htmlFor={`course-name-${item.id}`} className="sm:col-span-2">
              <Input
                id={`course-name-${item.id}`}
                value={item.name}
                onChange={(event) =>
                  set(updateItemById(items, item.id, { name: event.target.value }))
                }
                maxLength={160}
              />
            </Field>
            <Field label="Instituição" htmlFor={`course-inst-${item.id}`}>
              <Input
                id={`course-inst-${item.id}`}
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
            <div className="grid grid-cols-2 gap-3">
              <Field label="Carga horária" htmlFor={`course-hours-${item.id}`}>
                <Input
                  id={`course-hours-${item.id}`}
                  value={item.hours}
                  onChange={(event) =>
                    set(
                      updateItemById(items, item.id, { hours: event.target.value }),
                    )
                  }
                  placeholder="40"
                  maxLength={160}
                />
              </Field>
              <Field label="Conclusão" htmlFor={`course-date-${item.id}`}>
                <Input
                  id={`course-date-${item.id}`}
                  type="month"
                  value={item.date}
                  onChange={(event) =>
                    set(updateItemById(items, item.id, { date: event.target.value }))
                  }
                />
              </Field>
            </div>
          </div>
        </ItemCard>
      ))}

      <AddItemButton
        label="Adicionar curso"
        onClick={() => set([...items, createEmptyCourse()])}
      />
    </Section>
  );
}
