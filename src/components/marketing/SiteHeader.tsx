import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { buttonStyles } from "@/components/ui/button";
import { LogoLink } from "@/components/ui/logo";
import { MobileMenu } from "./MobileMenu";

const LINKS = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#modelos", label: "Modelos" },
  { href: "/precos", label: "Preços" },
  { href: "/#duvidas", label: "Dúvidas" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page relative flex h-16 items-center justify-between">
        <LogoLink />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navegação principal"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 hover:text-brand-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <Link href="/painel" className={buttonStyles("primary", "md")}>
              Ir para o painel
            </Link>
          ) : (
            <>
              <Link href="/entrar" className={buttonStyles("ghost", "md")}>
                Entrar
              </Link>
              <Link href="/criar-conta" className={buttonStyles("primary", "md")}>
                Criar currículo
              </Link>
            </>
          )}
        </div>

        <MobileMenu links={LINKS} isAuthenticated={Boolean(user)} />
      </div>
    </header>
  );
}
