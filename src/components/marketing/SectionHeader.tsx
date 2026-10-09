import { cn } from "@/lib/utils/cn";

/**
 * Cabeçalho de seção da home com identidade editorial: numeral serifado
 * (motivo de página/documento) + keyline de acento + título em Fraunces.
 */
export function SectionHeader({
  index,
  title,
  text,
  className,
}: {
  index: string;
  title: string;
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="flex items-center gap-3 text-accent-700">
        <span className="font-display text-lg italic leading-none">{index}</span>
        <span aria-hidden className="h-px w-10 bg-accent-400/60" />
      </p>
      <h2 className="mt-3 font-display text-3xl font-medium leading-[1.12] tracking-tight text-brand-950 sm:text-[2.5rem]">
        {title}
      </h2>
      {text ? (
        <p className="mt-3 leading-relaxed text-brand-600 sm:text-lg">{text}</p>
      ) : null}
    </div>
  );
}