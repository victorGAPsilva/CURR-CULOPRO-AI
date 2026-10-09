import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo />
      <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-accent-600">
        Erro 404
      </p>
      <h1 className="mt-2 text-2xl font-bold text-brand-950">
        Não encontramos esta página
      </h1>
      <p className="mt-2 max-w-md text-sm text-brand-600">
        O endereço pode estar incorreto ou o conteúdo foi removido. Se você
        procurava um currículo, ele continua disponível no seu painel.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/painel" className={buttonStyles("primary", "md")}>
          Ir para o painel
        </Link>
        <Link href="/" className={buttonStyles("outline", "md")}>
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
