"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowDown, IconArrowUp, IconPlus, IconTrash } from "@/components/ui/icons";

/** Move um item de/para uma posição em um array imutável. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return items;
  next.splice(to, 0, moved);
  return next;
}

/** Atualiza um item por id, retornando um novo array. */
export function updateItemById<T extends { id: string }>(
  items: T[],
  id: string,
  patch: Partial<T>,
): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

/** Cartão de seção do editor, com âncora e ação opcional no cabeçalho. */
export function Section({
  id,
  title,
  description,
  action,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={`secao-${id}`}
      aria-labelledby={`titulo-${id}`}
      className="scroll-mt-24 rounded-lg border border-line bg-white shadow-[var(--shadow-card)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 id={`titulo-${id}`} className="text-sm font-semibold text-brand-900">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-xs text-brand-500">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

interface ItemCardProps {
  title: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  children: ReactNode;
}

/** Item repetível com controles de ordem e remoção. */
export function ItemCard({
  title,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
  children,
}: ItemCardProps) {
  return (
    <div className="rounded-md border border-line bg-brand-50/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
          {title}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded-md p-1.5 text-brand-500 hover:bg-white disabled:opacity-40"
            aria-label={`Mover ${title} para cima`}
          >
            <IconArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="rounded-md p-1.5 text-brand-500 hover:bg-white disabled:opacity-40"
            aria-label={`Mover ${title} para baixo`}
          >
            <IconArrowDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md p-1.5 text-danger-600 hover:bg-danger-50"
            aria-label={`Remover ${title}`}
          >
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/** Botão padrão para adicionar um novo item a uma seção repetível. */
export function AddItemButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <IconPlus className="h-4 w-4" />
      {label}
    </Button>
  );
}
