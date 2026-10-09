import { randomUUID } from "node:crypto";
import { getDb } from "./client";

export type PlanId = "free" | "premium";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  plan: PlanId;
  createdAt: string;
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  plan: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserWithSecret extends UserRecord {
  passwordHash: string;
}

function toUser(row: UserRow): UserWithSecret {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    plan: row.plan === "premium" ? "premium" : "free",
    passwordHash: row.password_hash,
    createdAt: row.created_at,
  };
}

export function createUser(input: {
  email: string;
  passwordHash: string;
  name: string;
}): UserRecord {
  const db = getDb();
  const now = new Date().toISOString();
  const id = randomUUID();

  db.prepare(
    `INSERT INTO users (id, email, password_hash, name, plan, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'free', ?, ?)`,
  ).run(id, input.email.toLowerCase(), input.passwordHash, input.name, now, now);

  return { id, email: input.email.toLowerCase(), name: input.name, plan: "free", createdAt: now };
}

export function findUserByEmail(email: string): UserWithSecret | null {
  const row = getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as UserRow | undefined;
  return row ? toUser(row) : null;
}

export function findUserById(id: string): UserRecord | null {
  const row = getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | UserRow
    | undefined;
  return row ? toUser(row) : null;
}
