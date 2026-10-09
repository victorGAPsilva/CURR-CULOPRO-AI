import type { ResumeContent } from "@/lib/resume/schema";
import { formatMonth, formatPeriod } from "@/lib/resume/format";
import { contactItems } from "../shared";

/**
 * Modelo Clássico — conservador e adequado a sistemas de recrutamento (ATS).
 * Coluna única, cabeçalho centrado, títulos em maiúsculas com filete inferior.
 */
export function ClassicTemplate({ content }: { content: ResumeContent }) {
  const { personal } = content;
  const contacts = contactItems(content);

  return (
    <article className="resume-document px-10 py-10 text-[11px] leading-relaxed text-neutral-800">
      <header className="resume-section border-b-2 border-neutral-800 pb-3 text-center">
        {personal.fullName ? (
          <h1 className="text-[22px] font-bold uppercase tracking-wide text-neutral-900">
            {personal.fullName}
          </h1>
        ) : null}
        {personal.headline ? (
          <p className="mt-0.5 text-[12px] font-medium text-neutral-700">
            {personal.headline}
          </p>
        ) : null}
        {contacts.length > 0 ? (
          <p className="mt-1.5 text-[10px] text-neutral-600">
            {contacts.join("  •  ")}
          </p>
        ) : null}
      </header>

      {content.summary ? (
        <section className="resume-section mt-5">
          <h2 className="mb-1.5 border-b border-neutral-300 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-neutral-900">
            Resumo profissional
          </h2>
          <p className="whitespace-pre-line">{content.summary}</p>
        </section>
      ) : null}

      {content.experiences.length > 0 ? (
        <section className="resume-section mt-5">
          <h2 className="mb-2 border-b border-neutral-300 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-neutral-900">
            Experiência profissional
          </h2>
          <div className="space-y-3">
            {content.experiences.map((item) => {
              const period = formatPeriod(item.startDate, item.endDate, item.current);
              return (
                <div key={item.id} className="resume-item">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-neutral-900">
                      {item.role || "Cargo não informado"}
                    </p>
                    {period ? (
                      <span className="shrink-0 text-[10px] text-neutral-500">
                        {period}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-neutral-700">
                    {[item.company, item.location].filter(Boolean).join(" — ")}
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
        <section className="resume-section mt-5">
          <h2 className="mb-2 border-b border-neutral-300 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-neutral-900">
            Formação acadêmica
          </h2>
          <div className="space-y-2.5">
            {content.education.map((item) => {
              const period = formatPeriod(item.startDate, item.endDate, item.current);
              return (
                <div key={item.id} className="resume-item">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-neutral-900">{item.degree}</p>
                    {period ? (
                      <span className="shrink-0 text-[10px] text-neutral-500">
                        {period}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-neutral-700">
                    {[item.institution, item.location].filter(Boolean).join(" — ")}
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
        <section className="resume-section mt-5">
          <h2 className="mb-2 border-b border-neutral-300 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-neutral-900">
            Habilidades
          </h2>
          {content.skills.length > 0 ? (
            <p className="resume-item">
              <span className="font-semibold">Técnicas: </span>
              {content.skills.map((skill) => skill.name).join(" • ")}
            </p>
          ) : null}
          {content.softSkills.length > 0 ? (
            <p className="resume-item mt-1">
              <span className="font-semibold">Interpessoais: </span>
              {content.softSkills.map((skill) => skill.name).join(" • ")}
            </p>
          ) : null}
        </section>
      ) : null}

      {content.courses.length > 0 ? (
        <section className="resume-section mt-5">
          <h2 className="mb-2 border-b border-neutral-300 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-neutral-900">
            Cursos e certificações
          </h2>
          <ul className="space-y-1">
            {content.courses.map((item) => (
              <li key={item.id} className="resume-item">
                <span className="font-semibold text-neutral-900">{item.name}</span>
                {[item.institution, item.hours ? `${item.hours}h` : "", formatMonth(item.date)]
                  .filter(Boolean)
                  .length > 0
                  ? ` — ${[item.institution, item.hours ? `${item.hours}h` : "", formatMonth(item.date)]
                      .filter(Boolean)
                      .join(", ")}`
                  : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {content.languages.length > 0 ? (
        <section className="resume-section mt-5">
          <h2 className="mb-2 border-b border-neutral-300 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-neutral-900">
            Idiomas
          </h2>
          <p>
            {content.languages.map((lang) => `${lang.name} (${lang.level})`).join("  •  ")}
          </p>
        </section>
      ) : null}

      {content.projects.length > 0 ? (
        <section className="resume-section mt-5">
          <h2 className="mb-2 border-b border-neutral-300 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-neutral-900">
            Projetos
          </h2>
          <div className="space-y-2">
            {content.projects.map((item) => (
              <div key={item.id} className="resume-item">
                <p className="font-semibold text-neutral-900">{item.name}</p>
                {item.link ? (
                  <p className="text-[10px] text-neutral-500">{item.link}</p>
                ) : null}
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
