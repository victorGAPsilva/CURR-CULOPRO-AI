import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";
import { IconCheck } from "@/components/ui/icons";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-brand-950 p-10 text-white lg:flex">
        <Link href="/" aria-label="CurrículoPro AI — página inicial">
          <span className="inline-flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight">
              Currículo<span className="text-accent-300">Pro</span> AI
            </span>
          </span>
        </Link>

        <div className="max-w-md">
          <h2 className="text-2xl font-bold leading-snug">
            Um currículo claro aumenta suas chances de ser lido com atenção.
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-brand-100">
            {[
              "Três modelos profissionais prontos para A4",
              "Assistente de IA que não inventa fatos",
              "Exportação em PDF com conteúdo real",
              "Seus currículos salvos e fáceis de retomar",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-brand-300">
          Ferramenta de organização e redação. Não garante contratação nem
          aprovação em processos seletivos.
        </p>
      </aside>

      <main className="flex items-center justify-center bg-white px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/" aria-label="CurrículoPro AI — página inicial">
              <Logo />
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
