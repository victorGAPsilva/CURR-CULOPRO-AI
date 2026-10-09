import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const columns = [
  {
    title: "Produto",
    links: [
      { href: "/#como-funciona", label: "Como funciona" },
      { href: "/#modelos", label: "Modelos" },
      { href: "/precos", label: "Preços" },
      { href: "/criar-conta", label: "Criar currículo" },
    ],
  },
  {
    title: "Conta",
    links: [
      { href: "/entrar", label: "Entrar" },
      { href: "/criar-conta", label: "Criar conta" },
      { href: "/painel", label: "Meus currículos" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-brand-500">
            Ferramenta para organizar sua trajetória e criar currículos claros,
            personalizados e prontos para processos seletivos.
          </p>
          <p className="mt-4 text-xs text-brand-400">
            O CurrículoPro AI ajuda você a apresentar melhor suas informações.
            Não garante contratação nem resultados em processos seletivos.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold text-brand-900">{column.title}</h2>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-600 hover:text-accent-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-brand-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} CurrículoPro AI.</p>
          <p>
            Seus dados ficam na sua conta. Você pode excluir seus currículos a
            qualquer momento.
          </p>
        </div>
      </div>
    </footer>
  );
}
