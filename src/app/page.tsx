import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { TemplateShowcase } from "@/components/marketing/TemplateShowcase";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { ResumePaper } from "@/components/resume/ResumePaper";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/surfaces";
import { SAMPLE_RESUME } from "@/lib/resume/sample";
import {
  IconArrowRight,
  IconBriefcase,
  IconCheck,
  IconDocument,
  IconDownload,
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
    icon: <IconDocument className="h-6 w-6" />,
    title: "1. Preencha seus dados",
    text: "Informe formação, experiências, cursos e habilidades. Sem campos desnecessários e com progresso visível.",
  },
  {
    icon: <IconSparkles className="h-6 w-6" />,
    title: "2. Peça sugestões à IA",
    text: "Melhore a redação do resumo e das atividades. A IA ajusta a apresentação sem inventar fatos sobre você.",
  },
  {
    icon: <IconDownload className="h-6 w-6" />,
    title: "3. Revise e exporte",
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

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="conteudo" className="flex-1">
        {/* Hero */}
        <section className="border-b border-line bg-white">
          <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
            <div>
              <Badge tone="accent" className="mb-4">
                Currículos com apoio de IA
              </Badge>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand-950 sm:text-4xl lg:text-[2.6rem]">
                Seu próximo passo profissional começa com um bom currículo.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-600 sm:text-lg">
                Organize suas experiências, destaque suas habilidades e crie um
                currículo profissional com ajuda da inteligência artificial.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/criar-conta" className={buttonStyles("primary", "lg")}>
                  Criar meu currículo
                  <IconArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/#modelos" className={buttonStyles("outline", "lg")}>
                  Ver modelos
                </Link>
              </div>
              <ul className="mt-7 grid gap-2 text-sm text-brand-600 sm:grid-cols-2">
                {[
                  "Três modelos prontos para A4",
                  "Exportação em PDF com texto real",
                  "Sugestões que não inventam fatos",
                  "Salvamento na sua conta",
                ].map((item) => (
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
              <div className="rounded-xl bg-brand-50 p-4 sm:p-6">
                <ResumePaper maxWidth={640}>
                  <ResumeDocument content={SAMPLE_RESUME} templateId="classic" />
                </ResumePaper>
              </div>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="scroll-mt-20 py-16 lg:py-20">
          <div className="container-page">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">
                Como funciona
              </h2>
              <p className="mt-2 text-brand-600">
                Do primeiro rascunho ao PDF, em um fluxo simples e direto.
              </p>
            </div>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <li
                  key={step.title}
                  className="rounded-lg border border-line bg-white p-6 shadow-[var(--shadow-card)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-900 text-white">
                    {step.icon}
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
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">
                Por que usar o CurrículoPro AI
              </h2>
              <p className="mt-2 text-brand-600">
                Recursos pensados para quem precisa de um currículo confiável,
                rápido e honesto.
              </p>
            </div>
            <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-3">
                  <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
                  <div>
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
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">
                Modelos de currículo
              </h2>
              <p className="mt-2 text-brand-600">
                Três composições diferentes, a mesma estrutura de dados. Troque
                de modelo sem perder nenhuma informação.
              </p>
            </div>
            <div className="mt-10">
              <TemplateShowcase />
            </div>
          </div>
        </section>

        {/* Assistente em destaque */}
        <section className="border-y border-line bg-brand-950 py-16 text-white lg:py-20">
          <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Um assistente que respeita os fatos
              </h2>
              <p className="mt-3 max-w-lg leading-relaxed text-brand-100">
                O assistente melhora clareza, gramática e verbos de ação. Ele não
                inventa números, cargos ou certificações, e sempre mostra a
                sugestão antes de aplicar.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-brand-100">
                {[
                  "Reescreve resumo e descrições de experiência",
                  "Sugere verbos de ação e corrige a escrita",
                  "Aponta informações essenciais que ainda faltam",
                  "Adapta a linguagem para uma vaga específica",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/5 p-6">
              <div className="flex items-center gap-2 text-accent-300">
                <IconSparkles className="h-5 w-5" />
                <span className="text-sm font-semibold">Sugestão de resumo</span>
              </div>
              <p className="mt-4 rounded-md bg-brand-900/60 p-4 text-sm leading-relaxed text-brand-100">
                &ldquo;Profissional de atendimento com experiência em suporte ao
                cliente e resolução de problemas, com foco em qualidade e
                organização.&rdquo;
              </p>
              <p className="mt-3 text-xs text-brand-300">
                Versão sugerida a partir do que você escreveu. Você decide se
                aceita, edita ou descarta.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-md bg-accent-600 px-3 py-1.5 text-xs font-medium">
                  Aplicar
                </span>
                <span className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium text-brand-100">
                  Descartar
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="duvidas" className="scroll-mt-20 py-16 lg:py-20">
          <div className="container-page max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">
              Perguntas frequentes
            </h2>
            <div className="mt-8 divide-y divide-line rounded-lg border border-line bg-white">
              {faqs.map((faq) => (
                <details key={faq.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-brand-900 marker:content-none">
                    {faq.q}
                    <span
                      aria-hidden
                      className="text-brand-400 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
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
        <section className="pb-20">
          <div className="container-page">
            <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-brand-100 bg-brand-50 px-6 py-10 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand-900 text-white">
                  <IconBriefcase className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-brand-950">
                    Comece seu currículo agora
                  </h2>
                  <p className="mt-1 text-sm text-brand-600">
                    Leva poucos minutos. Você pode salvar e continuar depois.
                  </p>
                </div>
              </div>
              <Link href="/criar-conta" className={buttonStyles("primary", "lg")}>
                Criar currículo grátis
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
