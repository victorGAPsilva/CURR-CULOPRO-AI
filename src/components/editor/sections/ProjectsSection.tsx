"use client";

import { Field, Input, Textarea } from "@/components/ui/fields";
import { createEmptyProject } from "@/lib/resume/defaults";
import {
  AddItemButton,
  ItemCard,
  Section,
  moveItem,
  updateItemById,
} from "../Section";
import type { EditorSectionProps } from "../types";

export function ProjectsSection({ content, update }: EditorSectionProps) {
  const items = content.projects;
  const set = (next: typeof items) => update({ projects: next });

  return (
    <Section
      id="projetos"
      title="Projetos e trabalhos relevantes"
      description="Use esta seção se ainda não tem experiência formal ou para destacar trabalhos específicos."
    >
      {items.map((item, index) => (
        <ItemCard
          key={item.id}
          title={`Projeto ${index + 1}`}
          index={index}
          total={items.length}
          onMoveUp={() => set(moveItem(items, index, index - 1))}
          onMoveDown={() => set(moveItem(items, index, index + 1))}
          onRemove={() => set(items.filter((entry) => entry.id !== item.id))}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nome do projeto" htmlFor={`proj-name-${item.id}`}>
              <Input
                id={`proj-name-${item.id}`}
                value={item.name}
                onChange={(event) =>
                  set(updateItemById(items, item.id, { name: event.target.value }))
                }
                maxLength={160}
              />
            </Field>
            <Field label="Link (opcional)" htmlFor={`proj-link-${item.id}`}>
              <Input
                id={`proj-link-${item.id}`}
                value={item.link}
                onChange={(event) =>
                  set(updateItemById(items, item.id, { link: event.target.value }))
                }
                placeholder="github.com/..."
                maxLength={160}
              />
            </Field>
          </div>
          <Field label="Descrição" htmlFor={`proj-desc-${item.id}`}>
            <Textarea
              id={`proj-desc-${item.id}`}
              value={item.description}
              onChange={(event) =>
                set(
                  updateItemById(items, item.id, { description: event.target.value }),
                )
              }
              rows={3}
              maxLength={600}
            />
          </Field>
        </ItemCard>
      ))}

      <AddItemButton
        label="Adicionar projeto"
        onClick={() => set([...items, createEmptyProject()])}
      />
    </Section>
  );
}
