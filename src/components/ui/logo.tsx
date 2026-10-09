import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * Logotipo da marca. O símbolo é um "C" formado por duas folhas de papel
 * sobrepostas, remetendo a currículo/documento.
 */
export function Logo({
  className,
  size = "md",
  withWordmark = true,
}: {
  className?: string;
  size?: "sm" | "md";
  withWordmark?: boolean;
}) {
  const dimension = size === "sm" ? 28 : 32;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 32 32"
        aria-hidden
        className="shrink-0"
      >
        <rect x="1" y="1" width="30" height="30" rx="8" fill="var(--color-brand-900)" />
        <path
          d="M13.5 10.5a6 6 0 1 0 0 11"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M17 17.5h6"
          fill="none"
          stroke="var(--color-accent-400)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M17 21h4"
          fill="none"
          stroke="var(--color-accent-400)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      {withWordmark ? (
        <span className="text-base font-semibold tracking-tight text-brand-950">
          Currículo<span className="text-accent-600">Pro</span>
          <span className="ml-1 text-[0.7rem] font-medium uppercase tracking-widest text-brand-400">
            AI
          </span>
        </span>
      ) : null}
    </span>
  );
}

export function LogoLink({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-600"
      aria-label="CurrículoPro AI — página inicial"
    >
      <Logo />
    </Link>
  );
}
