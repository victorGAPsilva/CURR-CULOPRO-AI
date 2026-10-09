import Link from "next/link";
import type { UserRecord } from "@/lib/db/users";
import { LogoLink } from "@/components/ui/logo";
import { LogoutButton } from "./LogoutButton";

export function AppHeader({ user }: { user: UserRecord }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <LogoLink href="/painel" />
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Navegação">
            <Link
              href="/painel"
              className="rounded-md px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
            >
              Meus currículos
            </Link>
            <Link
              href="/precos"
              className="rounded-md px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
            >
              Planos
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-brand-500 sm:inline">
            {user.name || user.email}
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
