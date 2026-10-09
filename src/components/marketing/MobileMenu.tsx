"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { IconClose, IconMenu } from "@/components/ui/icons";

interface NavLink {
  href: string;
  label: string;
}

export function MobileMenu({
  links,
  isAuthenticated,
}: {
  links: NavLink[];
  isAuthenticated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Fecha com Escape e devolve o foco ao botão que abriu o menu.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-2 text-brand-800 transition-colors duration-fast ease-standard hover:bg-brand-50"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
      </button>

      {open ? (
        <div
          id="menu-mobile"
          className="absolute left-0 right-0 top-full border-b border-line bg-white px-4 py-4 shadow-[var(--shadow-card)] animate-menu-in"
        >
          <nav className="flex flex-col gap-1" aria-label="Navegação principal">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-brand-800 transition-colors duration-fast ease-standard hover:bg-brand-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
            {isAuthenticated ? (
              <Link href="/painel" className={buttonStyles("primary", "md")} onClick={() => setOpen(false)}>
                Ir para o painel
              </Link>
            ) : (
              <>
                <Link href="/entrar" className={buttonStyles("outline", "md")} onClick={() => setOpen(false)}>
                  Entrar
                </Link>
                <Link href="/criar-conta" className={buttonStyles("primary", "md")} onClick={() => setOpen(false)}>
                  Criar currículo
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
