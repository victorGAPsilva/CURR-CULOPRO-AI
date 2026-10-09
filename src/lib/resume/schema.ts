import { z } from "zod";

/**
 * Esquema e tipos do currículo.
 * Fonte única de verdade: os tipos TypeScript são inferidos do Zod, garantindo
 * que cliente e servidor validem exatamente as mesmas regras.
 *
 * Limites de tamanho existem para proteger o serviço de IA e o banco de dados.
 */

const idSchema = z.string().min(1).max(64);
const shortText = z.string().trim().max(160);
const mediumText = z.string().trim().max(600);
const longText = z.string().trim().max(4000);

/** Data no formato AAAA-MM (o dia não é necessário em currículos). */
const monthSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Informe uma data válida (mês/ano).")
  .or(z.literal(""));

export const personalInfoSchema = z.object({
  fullName: z.string().trim().max(120).default(""),
  headline: shortText.default(""), // cargo ou objetivo profissional
  email: z
    .union([z.literal(""), z.string().trim().email("E-mail inválido.").max(160)])
    .default(""),
  phone: shortText.default(""),
  location: shortText.default(""), // cidade / UF (não exigimos endereço completo)
  linkedin: shortText.default(""),
  website: shortText.default(""),
});

export const experienceSchema = z.object({
  id: idSchema,
  role: shortText.default(""),
  company: shortText.default(""),
  location: shortText.default(""),
  startDate: monthSchema.default(""),
  endDate: monthSchema.default(""),
  current: z.boolean().default(false),
  description: longText.default(""),
});

export const educationSchema = z.object({
  id: idSchema,
  degree: shortText.default(""),
  institution: shortText.default(""),
  location: shortText.default(""),
  startDate: monthSchema.default(""),
  endDate: monthSchema.default(""),
  current: z.boolean().default(false),
  description: mediumText.default(""),
});

export const courseSchema = z.object({
  id: idSchema,
  name: shortText.default(""),
  institution: shortText.default(""),
  hours: shortText.default(""),
  date: monthSchema.default(""),
});

const levelValues = [
  "Básico",
  "Intermediário",
  "Avançado",
  "Fluente",
  "Nativo",
] as const;

export const languageSchema = z.object({
  id: idSchema,
  name: shortText.default(""),
  level: z.enum(levelValues).default("Intermediário"),
});

export const skillSchema = z.object({
  id: idSchema,
  name: shortText.default(""),
});

export const projectSchema = z.object({
  id: idSchema,
  name: shortText.default(""),
  link: shortText.default(""),
  description: mediumText.default(""),
});

export const templateIdSchema = z.enum(["classic", "modern", "minimal"]);

export const resumeContentSchema = z.object({
  // `prefault` aplica o objeto padrão E o valida, preenchendo os campos.
  personal: personalInfoSchema.prefault({}),
  summary: longText.default(""),
  experiences: z.array(experienceSchema).max(40).default([]),
  education: z.array(educationSchema).max(20).default([]),
  courses: z.array(courseSchema).max(40).default([]),
  skills: z.array(skillSchema).max(60).default([]),
  softSkills: z.array(skillSchema).max(40).default([]),
  languages: z.array(languageSchema).max(20).default([]),
  projects: z.array(projectSchema).max(30).default([]),
});

/** Payload aceito ao criar/atualizar um currículo. */
export const resumeInputSchema = z.object({
  title: z.string().trim().min(1, "Informe um título.").max(120),
  templateId: templateIdSchema.default("classic"),
  content: resumeContentSchema.prefault({}),
});

export type ResumeInput = z.infer<typeof resumeInputSchema>;
export type ResumeContent = z.infer<typeof resumeContentSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Project = z.infer<typeof projectSchema>;
export type TemplateId = z.infer<typeof templateIdSchema>;
export const LANGUAGE_LEVELS = levelValues;

/** Currículo completo, como retornado pela API. */
export interface ResumeRecord {
  id: string;
  userId: string;
  title: string;
  templateId: TemplateId;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeSummary {
  id: string;
  title: string;
  templateId: TemplateId;
  updatedAt: string;
  createdAt: string;
  /** Percentual de preenchimento das seções essenciais (0–100). */
  completion: number;
}
