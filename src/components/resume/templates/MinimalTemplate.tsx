import type { ResumeContent } from "@/lib/resume/schema";
import { formatMonth, formatPeriod } from "@/lib/resume/format";
import { contactItems } from "../shared";

/**
 * Modelo Minimalista — máxima legibilidade, quase sem ornamento.
 * Rótulos discretos em maiúsculas e amplo espaço em branco.
 */
export function MinimalTemplate({ content }: { content: ResumeContent }) {
  const { personal } = content;
  const contacts = contactItems(content);

  const label =
    "text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-400";

  return (
    <article className="resume-document px-12 py-11 text-[11px] leading-[1.7] text-neutral-800">
      <header className="resume-section">
        {personal.fullName ? (
          <h1 className="text-[26px] font-light tracking-tight text-neutral-900">
            {personal.fullName}
          </h1>
        ) : null}
        {personal.headline ? (
          <p className="mt-1 text-[12px] text-neutral-500">{personal.headline}</p>
        ) : null}
        {contacts.length > 0 ? (
          <p className="mt-3 text-[10px] text-neutral-500">
            {contacts.join("    ")}
          </p>
        ) : null}
      </header>

      {content.summary ? (
        <section className="resume-section mt-8">
          <p className="whitespace-pre-line text-[11px]">{content.summary}</p>
        </section>
      ) : null}

      {content.experiences.length > 0 ? (
        <section className="resume-section mt-8">
          <h2 className={label}>Experiência</h2>
          <div className="mt-3 space-y-4">
            {content.experiences.map((item) => {
              const period = formatPeriod(item.startDate, item.endDate, item.current);
              return (
                <div key={item.id} className="resume-item">
                  <p className="text-[12px] font-medium text-neutral-900">
                    {item.role}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {[item.company, item.location, period].filter(Boolean).join("  ·  ")}
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
        <section className="resume-section mt-8">
          <h2 className={label}>Formação</h2>
          <div className="mt-3 space-y-3">
            {content.education.map((item) => {
              const period = formatPeriod(item.startDate, item.endDate, item.current);
              return (
                <div key={item.id} className="resume-item">
                  <p className="text-[12px] font-medium text-neutral-900">
                    {item.degree}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {[item.institution, item.location, period].filter(Boolean).join("  ·  ")}
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
        <section className="resume-section mt-8">
          <h2 className={label}>Habilidades</h2>
          <div className="mt-3 space-y-2 text-[11px]">
            {content.skills.length > 0 ? (
              <p className="resume-item">
                <span className="text-neutral-400">Técnicas  </span>
                {content.skills.map((s) => s.name).join("   ·   ")}
              </p>
            ) : null}
            {content.softSkills.length > 0 ? (
              <p className="resume-item">
                <span className="text-neutral-400">Interpessoais  </span>
                {content.softSkills.map((s) => s.name).join("   ·   ")}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {content.courses.length > 0 ? (
        <section className="resume-section mt-8">
          <h2 className={label}>Cursos</h2>
          <ul className="mt-3 space-y-1.5">
            {content.courses.map((item) => {
              const meta = [item.institution, item.hours ? `${item.hours}h` : "", formatMonth(item.date)]
                .filter(Boolean)
                .join(" · ");
              return (
                <li key={item.id} className="resume-item text-[11px]">
                  {item.name}
                  {meta ? <span className="text-neutral-500"> — {meta}</span> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {content.languages.length > 0 ? (
        <section className="resume-section mt-8">
          <h2 className={label}>Idiomas</h2>
          <p className="mt-3 text-[11px]">
            {content.languages.map((l) => `${l.name} (${l.level})`).join("   ·   ")}
          </p>
        </section>
      ) : null}

      {content.projects.length > 0 ? (
        <section className="resume-section mt-8">
          <h2 className={label}>Projetos</h2>
          <div className="mt-3 space-y-3">
            {content.projects.map((item) => (
              <div key={item.id} className="resume-item">
                <p className="text-[12px] font-medium text-neutral-900">
                  {item.name}
                  {item.link ? (
                    <span className="ml-2 text-[10px] font-normal text-neutral-500">
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
