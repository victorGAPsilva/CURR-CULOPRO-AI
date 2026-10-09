import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "CurrículoPro AI — Currículos profissionais com ajuda da IA",
    template: "%s · CurrículoPro AI",
  },
  description:
    "Organize suas experiências, destaque suas habilidades e crie um currículo profissional com ajuda da inteligência artificial.",
  applicationName: "CurrículoPro AI",
  openGraph: {
    title: "CurrículoPro AI",
    description:
      "Crie um currículo profissional, adapte para cada vaga e exporte em PDF.",
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={[inter.variable, fraunces.variable].join(" ")}>
      <body className="min-h-screen antialiased">
        <a href="#conteudo" className="sr-only sr-only-focusable">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
