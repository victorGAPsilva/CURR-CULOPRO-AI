import type { ResumeContent } from "@/lib/resume/schema";
import { formatMonth, formatPeriod } from "@/lib/resume/format";
import { contactItems } from "../shared";

/**
 * Modelo Moderno — hierarquia contemporânea com destaque de cor nos títulos.
 * Percebe-se diferente do clássico sem depender de imagens ou colunas.
 */
export function ModernTemplate({ content }: { content: ResumeContent }) {
  const { personal } = content;
  const contacts = contactItems(content);

  return (
    <article className="resume-document px-10 py-9 text-[11px] leading-relaxed text-neutral-800">
      <header className="resume-section border-l-4 border-brand-700 pl-4">
        {personal.fullName ? (
          <h1 className="text-[24px] font-bold leading-tight text-brand-900">
            {personal.fullName}
          </h1>
        ) : null}
        {personal.headline ? (
          <p className="mt-1 text-[13px] font-medium text-accent-700">
            {personal.headline}
          </p>
        ) : null}
        {contacts.length > 0 ? (
          <p className="mt-2 text-[10px] text-neutral-600">
            {contacts.join("  •  ")}
          </p>
        ) : null}
      </header>

      {content.summary ? (
        <section className="resume-section mt-6">
          <h2 className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-800">
            Resumo
          </h2>
          <p className="whitespace-pre-line">{content.summary}</p>
        </section>
      ) : null}

      {content.experiences.length > 0 ? (
        <section className="resume-section mt-6">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-brand-800">
            Experiência profissional
          </h2>
          <div className="space-y-3.5">
            {content.experiences.map((item) => {
              const period = formatPeriod(item.startDate, item.endDate, item.current);
              return (
                <div key={item.id} className="resume-item">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-brand-900">{item.role}</p>
                    {period ? (
                      <span className="shrink-0 rounded-sm bg-brand-50 px-1.5 py-0.5 text-[9px] font-medium text-brand-700">
                        {period}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-500">
                    {[item.company, item.location].filter(Boolean).join(" · ")}
                  </p>
                  {item.description ? (
                    <p className="mt-1 whitespace-pre-line text-neutral-700">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {content.education.length > 0 ? (
        <section className="resume-section mt-6">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-brand-800">
            Formação acadêmica
          </h2>
          <div className="space-y-3">
            {content.education.map((item) => {
              const period = formatPeriod(item.startDate, item.endDate, item.current);
              return (
                <div key={item.id} className="resume-item">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-brand-900">{item.degree}</p>
                    {period ? (
                      <span className="shrink-0 text-[10px] text-neutral-500">
                        {period}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-neutral-700">
                    {[item.institution, item.location].filter(Boolean).join(" · ")}
                  </p>
                  {item.description ? (
                    <p className="mt-0.5 text-neutral-700">{item.description}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {content.skills.length > 0 || content.softSkills.length > 0 ? (
        <section className="resume-section mt-6">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-800">
            Habilidades
          </h2>
          {content.skills.length > 0 ? (
            <div className="resume-item flex flex-wrap gap-1.5">
              {content.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded border border-brand-100 bg-brand-50 px-2 py-0.5 text-[10px] text-brand-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          ) : null}
          {content.softSkills.length > 0 ? (
            <div className="resume-item mt-2 flex flex-wrap gap-1.5">
              {content.softSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] text-neutral-700"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {content.courses.length > 0 ? (
        <section className="resume-section mt-6">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-800">
            Cursos e certificações
          </h2>
          <ul className="space-y-1">
            {content.courses.map((item) => {
              const meta = [item.institution, item.hours ? `${item.hours}h` : "", formatMonth(item.date)]
                .filter(Boolean)
                .join(", ");
              return (
                <li key={item.id} className="resume-item">
                  <span className="font-semibold text-brand-900">{item.name}</span>
                  {meta ? <span className="text-neutral-600"> — {meta}</span> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {content.languages.length > 0 ? (
        <section className="resume-section mt-6">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-800">
            Idiomas
          </h2>
          <p>{content.languages.map((l) => `${l.name} — ${l.level}`).join("   •   ")}</p>
        </section>
      ) : null}

      {content.projects.length > 0 ? (
        <section className="resume-section mt-6">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-brand-800">
            Projetos
          </h2>
          <div className="space-y-2.5">
            {content.projects.map((item) => (
              <div key={item.id} className="resume-item">
                <p className="font-semibold text-brand-900">
                  {item.name}
                  {item.link ? (
                    <span className="ml-2 text-[10px] font-normal text-accent-700">
                      {item.link}
                    </span>
                  ) : null}
                </p>
                {item.description ? (
                  <p className="text-neutral-700">{item.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
