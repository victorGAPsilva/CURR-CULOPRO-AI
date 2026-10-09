"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Largura de uma página A4 a 96 dpi (210 mm). */
export const A4_WIDTH_PX = 794;
const A4_MIN_HEIGHT_PX = 1123;

/**
 * Renderiza o currículo como uma folha A4 real, redimensionada para caber na
 * largura disponível. A altura acompanha o conteúdo, então currículos longos
 * não são cortados na pré-visualização.
 */
export function ResumePaper({
  children,
  className,
  maxWidth,
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(A4_MIN_HEIGHT_PX);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const recompute = () => {
      const available = Math.min(outer.clientWidth, maxWidth ?? Infinity);
      const nextScale = Math.min(1, available / A4_WIDTH_PX);
      setScale(nextScale);
      setHeight(Math.max(A4_MIN_HEIGHT_PX, inner.scrollHeight));
    };

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [maxWidth]);

  return (
    <div
      ref={outerRef}
      className={cn("w-full", className)}
      style={{ height: height * scale }}
    >
      <div
        ref={innerRef}
        className="resume-paper origin-top-left bg-white text-neutral-800 shadow-[0_1px_3px_rgba(12,37,66,0.12),0_12px_32px_rgba(12,37,66,0.10)] ring-1 ring-line"
        style={{ width: A4_WIDTH_PX, minHeight: A4_MIN_HEIGHT_PX, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
