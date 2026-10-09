import { randomUUID } from "node:crypto";
import { createEmptyContent } from "@/lib/resume/defaults";
import { completionPercent } from "@/lib/resume/progress";
import {
  resumeContentSchema,
  type ResumeContent,
  type ResumeInput,
  type ResumeRecord,
  type ResumeSummary,
  type TemplateId,
} from "@/lib/resume/schema";
import { getDb } from "./client";

interface ResumeRow {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/** Decodifica o JSON armazenado com validação defensiva do esquema. */
export function parseContent(raw: string): ResumeContent {
  try {
    const parsed = resumeContentSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : createEmptyContent();
  } catch {
    return createEmptyContent();
  }
}

function toRecord(row: ResumeRow): ResumeRecord {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    templateId: row.template_id as TemplateId,
    content: parseContent(row.content),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listResumesByUser(userId: string): ResumeSummary[] {
  const rows = getDb()
    .prepare(
      "SELECT id, title, template_id, content, created_at, updated_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC",
    )
    .all(userId) as Pick<
    ResumeRow,
    "id" | "title" | "template_id" | "content" | "created_at" | "updated_at"
  >[];

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    templateId: row.template_id as TemplateId,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completion: completionPercent(parseContent(row.content)),
  }));
}

export function getResumeById(id: string, userId: string): ResumeRecord | null {
  const row = getDb()
    .prepare("SELECT * FROM resumes WHERE id = ? AND user_id = ?")
    .get(id, userId) as ResumeRow | undefined;
  return row ? toRecord(row) : null;
}

export function createResume(userId: string, input: ResumeInput): ResumeRecord {
  const db = getDb();
  const now = new Date().toISOString();
  const id = randomUUID();

  db.prepare(
    `INSERT INTO resumes (id, user_id, title, template_id, content, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    userId,
    input.title,
    input.templateId,
    JSON.stringify(input.content),
    now,
    now,
  );

  return {
    id,
    userId,
    title: input.title,
    templateId: input.templateId,
    content: input.content,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Atualiza um currículo garantindo a posse (user_id). Retorna null quando o
 * currículo não existe ou pertence a outro usuário — a rota traduz para 404.
 */
export function updateResume(
  id: string,
  userId: string,
  input: ResumeInput,
): ResumeRecord | null {
  const db = getDb();
  const now = new Date().toISOString();

  const result = db
    .prepare(
      `UPDATE resumes
       SET title = ?, template_id = ?, content = ?, updated_at = ?
       WHERE id = ? AND user_id = ?`,
    )
    .run(input.title, input.templateId, JSON.stringify(input.content), now, id, userId);

  if (result.changes === 0) return null;
  return getResumeById(id, userId);
}

export function deleteResume(id: string, userId: string): boolean {
  const result = getDb()
    .prepare("DELETE FROM resumes WHERE id = ? AND user_id = ?")
    .run(id, userId);
  return result.changes > 0;
}

export function duplicateResume(id: string, userId: string): ResumeRecord | null {
  const original = getResumeById(id, userId);
  if (!original) return null;
  return createResume(userId, {
    title: `${original.title} (cópia)`,
    templateId: original.templateId,
    content: original.content,
  });
}
