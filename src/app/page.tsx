import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { TemplateShowcase } from "@/components/marketing/TemplateShowcase";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { ResumePaper } from "@/components/resume/ResumePaper";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/surfaces";
import { SAMPLE_RESUME } from "@/lib/resume/sample";
import {
  IconArrowRight,
  IconCheck,
  IconPlus,
  IconSparkles,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "CurrículoPro AI — Crie um currículo profissional",
  description:
    "Organize suas experiências, destaque suas habilidades e crie um currículo profissional com ajuda da inteligência artificial. Pré-visualize e exporte em PDF.",
  alternates: { canonical: "/" },
};

const steps = [
  {
    title: "Preencha seus dados",
    text: "Informe formação, experiências, cursos e habilidades. Sem campos desnecessários e com progresso visível.",
  },
  {
    title: "Peça sugestões à IA",
    text: "Melhore a redação do resumo e das atividades. A IA ajusta a apresentação sem inventar fatos sobre você.",
  },
  {
    title: "Revise e exporte",
    text: "Escolha o modelo, confira a pré-visualização em A4 e baixe o PDF com o conteúdo real do seu currículo.",
  },
];

const benefits = [
  {
    title: "Feito para quem está começando",
    text: "Funciona mesmo sem experiência formal: valorize projetos, cursos, trabalhos voluntários e habilidades.",
  },
  {
    title: "Conteúdo fiel aos seus dados",
    text: "A IA melhora a escrita, mas não cria empresas, cargos, datas ou resultados que você não informou.",
  },
  {
    title: "Legível para sistemas automáticos",
    text: "Modelos em coluna única, com texto selecionável e estrutura que prioriza a leitura por recrutadores e ATS.",
  },
  {
    title: "Você no controle de tudo",
    text: "Cada sugestão é apresentada antes de ser aplicada. Edite, aceite ou descarte conforme preferir.",
  },
  {
    title: "Adapte para cada vaga",
    text: "Aproxime a linguagem do currículo das palavras-chave de uma vaga específica, mantendo a veracidade.",
  },
  {
    title: "Salvo e retomável",
    text: "Seus currículos ficam na sua conta. Continue de onde parou, duplique e crie versões quando quiser.",
  },
];

const facts = [
  "Três modelos prontos para A4",
  "Exportação em PDF com texto real",
  "Sugestões que não inventam fatos",
  "Salvamento na sua conta",
];

const faqs = [
  {
    q: "A IA pode inventar informações no meu currículo?",
    a: "Não. O assistente foi projetado para melhorar a apresentação do que você escreveu. Ele não cria empresas, cargos, datas, certificações ou números. Quando algo essencial estiver faltando, ele aponta a lacuna para você preencher — a decisão é sempre sua.",
  },
  {
    q: "Não tenho experiência profissional. Consigo usar?",
    a: "Sim. O editor permite destacar formação, cursos, projetos pessoais ou acadêmicos, trabalhos voluntários e habilidades. O assistente oferece orientações específicas para quem está começando.",
  },
  {
    q: "O PDF fica bom para sistemas de recrutamento?",
    a: "Os modelos usam coluna única, texto real (selecionável) e hierarquia clara, o que favorece a leitura tanto por pessoas quanto por sistemas que processam currículos automaticamente. Não há promessa de aprovação em processos.",
  },
  {
    q: "Preciso pagar para usar?",
    a: "O plano gratuito permite criar, editar, pré-visualizar e exportar seus currículos. O plano Premium, quando ativado, adiciona modelos extras e maior limite de uso da IA.",
  },
  {
    q: "O que acontece com meus dados?",
    a: "Seus currículos ficam vinculados à sua conta e não são acessíveis por outras pessoas. Você pode excluir seus currículos a qualquer momento. Guardamos apenas as informações que você insere para gerar o documento.",
  },
];

const assistantPoints = [
  "Reescreve resumo e descrições de experiência",
  "Sugere verbos de ação e corrige a escrita",
  "Aponta informações essenciais que ainda faltam",
  "Adapta a linguagem para uma vaga específica",
];

const budgetOut = `“Eu trabalhei com atendimento ao cliente e resolvia os problemas da loja.”`;
const budgetIn = `“Profissional de atendimento com experiência em suporte ao cliente e resolução de problemas, com foco em qualidade e organização.”`;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="conteudo" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line bg-white">
          <div
            aria-hidden
            className="paper-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]"
          />
          <div className="container-page relative grid gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-24">
            <div>
              <Badge tone="accent" className="mb-5">
                Currículos com apoio de IA
              </Badge>
              <h1 className="font-display text-4xl font-medium leading-[1.06] tracking-tight text-brand-950 sm:text-5xl lg:text-[3.3rem]">
                O currículo que{" "}
                <span className="box-decoration-clone bg-[linear-gradient(transparent_62%,var(--color-accent-200)_0%)]">
                  apresenta você
                </span>{" "}
                com clareza.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-600 sm:text-lg">
                Organize formação, experiências e habilidades em um documento
                A4, com sugestões da IA que melhoram a escrita — sem inventar
                fatos sobre a sua trajetória.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/criar-conta"
                  className={buttonStyles("primary", "lg", "group")}
                >
                  Criar meu currículo
                  <IconArrowRight className="h-4 w-4 transition-transform duration-fast ease-standard group-hover:translate-x-0.5" />
                </Link>
                <Link href="/#modelos" className={buttonStyles("outline", "lg")}>
                  Ver modelos
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-brand-100 pt-5 text-sm text-brand-600">
                {facts.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <IconCheck className="h-4 w-4 shrink-0 text-success-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -top-3 left-4 z-10">
                <Badge tone="brand">Exemplo ilustrativo</Badge>
              </div>
              <div className="rounded-xl bg-brand-50 p-4 shadow-[var(--shadow-card)] ring-1 ring-brand-100 sm:p-6">
                <ResumePaper maxWidth={640}>
                  <ResumeDocument content={SAMPLE_RESUME} templateId="classic" />
                </ResumePaper>
              </div>
              <p className="mt-3 text-center text-xs text-brand-400">
                Pré-visualização em A4 do modelo Clássico.
              </p>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="scroll-mt-20 py-16 lg:py-20">
          <div className="container-page">
            <SectionHeader
              index="01"
              title="Como funciona"
              text="Do primeiro rascunho ao PDF, em um fluxo simples e direto."
            />
            <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
              {steps.map((step, i) => (
                <li key={step.title} className="group relative">
                  {i < steps.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute left-11 right-[-1.5rem] top-5 hidden h-px bg-brand-200 md:block"
                    />
                  ) : null}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white font-display text-lg italic leading-none text-brand-600 transition-colors duration-fast ease-standard group-hover:border-brand-900 group-hover:bg-brand-900 group-hover:text-white">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-brand-900">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-600">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Benefícios */}
        <section className="border-y border-line bg-white py-16 lg:py-20">
          <div className="container-page">
            <SectionHeader
              index="02"
              title="Por que usar o CurrículoPro AI"
              text="Recursos pensados para quem precisa de um currículo confiável, rápido e honesto."
            />
            <div className="mt-10 grid gap-x-12 md:grid-cols-2">
              {benefits.map((benefit, i) => (
                <div
                  key={benefit.title}
                  className="group flex gap-5 border-t border-line py-6 transition-colors duration-fast ease-standard hover:border-brand-300"
                >
                  <span className="font-display text-lg italic leading-6 text-brand-300 transition-colors duration-fast ease-standard group-hover:text-accent-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-brand-900">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-brand-600">
                      {benefit.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modelos */}
        <section id="modelos" className="scroll-mt-20 py-16 lg:py-20">
          <div className="container-page">
            <SectionHeader
              index="03"
              title="Modelos de currículo"
              text="Três composições diferentes, a mesma estrutura de dados. Troque de modelo sem perder nenhuma informação."
            />
            <div className="mt-10">
              <TemplateShowcase />
            </div>
          </div>
        </section>

        {/* Assistente em destaque */}
        <section className="relative overflow-hidden border-y border-brand-900 bg-brand-950 py-16 text-white lg:py-24">
          <div aria-hidden className="paper-grid-dark pointer-events-none absolute inset-0" />
          <div className="container-page relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="flex items-center gap-3 text-accent-300">
                <span className="font-display text-lg italic leading-none">
                  assistente
                </span>
                <span aria-hidden className="h-px w-10 bg-accent-400/60" />
              </p>
              <h2 className="mt-3 font-display text-3xl font-medium leading-[1.12] tracking-tight sm:text-[2.5rem]">
                Um assistente que respeita os fatos
              </h2>
              <p className="mt-3 max-w-lg leading-relaxed text-brand-100">
                O assistente melhora clareza, gramática e verbos de ação. Ele
                não inventa números, cargos ou certificações, e sempre mostra a
                sugestão antes de aplicar.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-brand-100">
                {assistantPoints.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <Badge tone="accent" className="mb-1">
                Exemplo
              </Badge>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-300">
                  Você escreveu
                </p>
                <p className="mt-3 text-sm leading-relaxed text-brand-200">
                  {budgetOut}
                </p>
              </div>
              <div className="rounded-lg border border-accent-400/25 bg-accent-600/10 p-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent-300">
                  <IconSparkles className="h-4 w-4" />
                  Com a sugestão da IA
                </p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-white">
                  {budgetIn}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-md bg-accent-600 px-3 py-1.5 text-xs font-medium">
                    Aceitar
                  </span>
                  <span className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-brand-100">
                    Editar
                  </span>
                  <span className="rounded-md px-3 py-1.5 text-xs font-medium text-brand-300">
                    Descartar
                  </span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-brand-300">
                Melhora a apresentação — os fatos continuam sendo os seus. Você
                revisa a sugestão antes de aplicar.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="duvidas" className="scroll-mt-20 py-16 lg:py-20">
          <div className="container-page">
            <SectionHeader index="04" title="Perguntas frequentes" />
            <div className="mt-8 divide-y divide-line rounded-lg border border-line bg-white">
              {faqs.map((faq) => (
                <details key={faq.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-brand-900 marker:content-none">
                    {faq.q}
                    <IconPlus
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-brand-400 transition-transform duration-fast ease-standard group-open:rotate-45"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-brand-600">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t border-line py-16 lg:py-24">
          <div className="container-page grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-xl">
              <p className="flex items-center gap-3 text-accent-700">
                <span className="font-display text-lg italic leading-none">
                  próximo passo
                </span>
                <span aria-hidden className="h-px w-10 bg-accent-400/60" />
              </p>
              <h2 className="mt-3 font-display text-3xl font-medium leading-[1.12] tracking-tight text-brand-950 sm:text-[2.6rem]">
                Comece seu currículo agora
              </h2>
              <p className="mt-3 text-brand-600">
                Leva poucos minutos e você pode salvar para continuar depois.
                Grátis nesta versão, sem cobrança.
              </p>
            </div>
            <Link
              href="/criar-conta"
              className={buttonStyles("primary", "lg", "group")}
            >
              Criar currículo grátis
              <IconArrowRight className="h-4 w-4 transition-transform duration-fast ease-standard group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}