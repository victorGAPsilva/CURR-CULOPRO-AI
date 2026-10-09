"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo />
      <h1 className="mt-8 text-2xl font-bold text-brand-950">
        Algo deu errado
      </h1>
      <p className="mt-2 max-w-md text-sm text-brand-600">
        Não foi possível exibir esta página. Tente novamente. Se o problema
        continuar, volte ao painel e retome seu currículo.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-brand-400">
          Código do erro: {error.digest}
        </p>
      ) : null}
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Tentar novamente</Button>
        <a
          href="/painel"
          className="inline-flex h-10 items-center rounded-md border border-brand-200 bg-white px-4 text-sm font-medium text-brand-900 hover:bg-brand-50"
        >
          Ir para o painel
        </a>
      </div>
    </div>
  );
}
