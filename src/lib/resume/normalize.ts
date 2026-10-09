import type { ResumeContent } from "./schema";

function isBlank(value: string | undefined | null): boolean {
  return !value || value.trim() === "";
}

/**
 * Remove campos e itens vazios antes de renderizar/exportar.
 * Garante que seções opcionais não apareçam quando não há conteúdo real.
 */
export function normalizeContent(content: ResumeContent): ResumeContent {
  return {
    personal: {
      fullName: content.personal.fullName.trim(),
      headline: content.personal.headline.trim(),
      email: content.personal.email.trim(),
      phone: content.personal.phone.trim(),
      location: content.personal.location.trim(),
      linkedin: content.personal.linkedin.trim(),
      website: content.personal.website.trim(),
    },
    summary: content.summary.trim(),
    experiences: content.experiences
      .filter((item) => !isBlank(item.role) || !isBlank(item.company) || !isBlank(item.description))
      .map((item) => ({
        ...item,
        role: item.role.trim(),
        company: item.company.trim(),
        location: item.location.trim(),
        description: item.description.trim(),
      })),
    education: content.education
      .filter((item) => !isBlank(item.degree) || !isBlank(item.institution))
      .map((item) => ({
        ...item,
        degree: item.degree.trim(),
        institution: item.institution.trim(),
        location: item.location.trim(),
        description: item.description.trim(),
      })),
    courses: content.courses
      .filter((item) => !isBlank(item.name))
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        institution: item.institution.trim(),
        hours: item.hours.trim(),
      })),
    skills: content.skills
      .filter((item) => !isBlank(item.name))
      .map((item) => ({ ...item, name: item.name.trim() })),
    softSkills: content.softSkills
      .filter((item) => !isBlank(item.name))
      .map((item) => ({ ...item, name: item.name.trim() })),
    languages: content.languages
      .filter((item) => !isBlank(item.name))
      .map((item) => ({ ...item, name: item.name.trim() })),
    projects: content.projects
      .filter((item) => !isBlank(item.name) || !isBlank(item.description))
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        link: item.link.trim(),
        description: item.description.trim(),
      })),
  };
}
