import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button, buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/surfaces";
import { IconCheck, IconInfo } from "@/components/ui/icons";
import { getPlanDefinition } from "@/lib/plans/rules";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Preços e planos",
  description:
    "Compare o plano gratuito e o Premium do CurrículoPro AI. Crie, edite e exporte currículos com apoio da inteligência artificial.",
  alternates: { canonical: "/precos" },
};

export default async function PricingPage() {
  const free = getPlanDefinition("free");
  const premium = getPlanDefinition("premium");
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="conteudo" className="flex-1 py-14 lg:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
              Planos simples e transparentes
            </h1>
            <p className="mt-3 text-brand-600">
              Comece gratuitamente. O plano Premium adiciona modelos extras e
              amplia o uso do assistente de IA.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
            {/* Gratuito */}
            <div className="flex flex-col rounded-lg border border-line bg-white p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-brand-900">
                  {free.name}
                </h2>
                <Badge tone="success">Disponível</Badge>
              </div>
              <p className="mt-2 text-sm text-brand-600">{free.description}</p>
              <p className="mt-5 text-3xl font-bold text-brand-950">
                {free.priceLabel}
                <span className="text-sm font-normal text-brand-500"> /sempre</span>
              </p>

              <ul className="mt-6 flex-1 space-y-3 text-sm text-brand-700">
                {free.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-success-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href={user ? "/painel" : "/criar-conta"}
                  className={buttonStyles("primary", "lg", "w-full")}
                >
                  {user ? "Ir para o painel" : "Começar agora"}
                </Link>
              </div>
            </div>

            {/* Premium */}
            <div className="flex flex-col rounded-lg border-2 border-accent-500 bg-white p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-brand-900">
                  {premium.name}
                </h2>
                <Badge tone="accent">Em preparação</Badge>
              </div>
              <p className="mt-2 text-sm text-brand-600">
                {premium.description}
              </p>
              <p className="mt-5 text-sm font-medium text-brand-600">
                Sem cobrança nesta versão
              </p>

              <ul className="mt-6 flex-1 space-y-3 text-sm text-brand-700">
                {premium.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button variant="secondary" size="lg" className="w-full" disabled>
                  Contratação indisponível
                </Button>
                <p className="mt-3 flex items-start gap-2 text-xs text-brand-500">
                  <IconInfo className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  Nenhum provedor de pagamento está configurado nesta instalação.
                  Nada é cobrado. Quando a cobrança for integrada, ela será feita
                  por um provedor confiável e validada no servidor.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-lg border border-line bg-white p-6">
            <h2 className="text-sm font-semibold text-brand-900">
              Perguntas sobre os planos
            </h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-brand-800">
                  O plano gratuito expira?
                </dt>
                <dd className="mt-1 text-brand-600">
                  Não. Você pode criar, editar, pré-visualizar e exportar seus
                  currículos gratuitamente.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-brand-800">
                  O que conta como &ldquo;uso de IA&rdquo;?
                </dt>
                <dd className="mt-1 text-brand-600">
                  Cada solicitação ao assistente (melhorar resumo, reescrever uma
                  experiência, corrigir a escrita) conta como um uso. O
                  diagnóstico de preenchimento é gratuito e ilimitado.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-brand-800">
                  Existe garantia de contratação?
                </dt>
                <dd className="mt-1 text-brand-600">
                  Não. A ferramenta ajuda na apresentação das suas informações e
                  não garante aprovação em processos seletivos.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
