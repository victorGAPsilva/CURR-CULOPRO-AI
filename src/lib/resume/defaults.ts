import type {
  ResumeContent,
  ResumeInput,
  TemplateId,
} from "./schema";

/** Gera um identificador único para itens repetíveis (cliente ou servidor). */
export function newId(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
    return cryptoObj.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyContent(): ResumeContent {
  return {
    personal: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    summary: "",
    experiences: [],
    education: [],
    courses: [],
    skills: [],
    softSkills: [],
    languages: [],
    projects: [],
  };
}

export function createEmptyResume(
  title = "Currículo sem título",
  templateId: TemplateId = "classic",
): ResumeInput {
  return { title, templateId, content: createEmptyContent() };
}

export function createEmptyExperience() {
  return {
    id: newId(),
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

export function createEmptyEducation() {
  return {
    id: newId(),
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

export function createEmptyCourse() {
  return { id: newId(), name: "", institution: "", hours: "", date: "" };
}

export function createEmptySkill() {
  return { id: newId(), name: "" };
}

export function createEmptyLanguage() {
  return { id: newId(), name: "", level: "Intermediário" as const };
}

export function createEmptyProject() {
  return { id: newId(), name: "", link: "", description: "" };
}
