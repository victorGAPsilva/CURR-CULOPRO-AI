import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { getServerConfig } from "@/lib/config";

/**
 * Conexão SQLite (módulo nativo `node:sqlite`, sem dependências externas).
 * A instância é memorizada em globalThis para sobreviver ao hot-reload do
 * servidor de desenvolvimento sem abrir conexões duplicadas.
 */

declare global {
  var __curriculoproDb: DatabaseSync | undefined;
}

function createConnection(): DatabaseSync {
  const config = getServerConfig();
  const filePath = resolve(
    /* turbopackIgnore: true */ process.cwd(),
    config.databasePath,
  );
  mkdirSync(dirname(filePath), { recursive: true });

  const db = new DatabaseSync(filePath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");
  return db;
}

export function getDb(): DatabaseSync {
  if (!globalThis.__curriculoproDb) {
    const db = createConnection();
    migrate(db);
    globalThis.__curriculoproDb = db;
  }
  return globalThis.__curriculoproDb;
}

/**
 * Migrações versionadas e idempotentes. Cada entrada é aplicada uma única vez,
 * na ordem, e registrada em `_migrations`.
 */
const MIGRATIONS: { id: string; sql: string }[] = [
  {
    id: "0001_init",
    sql: `
      CREATE TABLE users (
        id            TEXT PRIMARY KEY,
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name          TEXT NOT NULL DEFAULT '',
        plan          TEXT NOT NULL DEFAULT 'free',
        created_at    TEXT NOT NULL,
        updated_at    TEXT NOT NULL
      );

      CREATE TABLE sessions (
        id         TEXT PRIMARY KEY,
        user_id    TEXT NOT NULL,
        token_hash TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX idx_sessions_user ON sessions(user_id);
      CREATE INDEX idx_sessions_token ON sessions(token_hash);

      CREATE TABLE resumes (
        id          TEXT PRIMARY KEY,
        user_id     TEXT NOT NULL,
        title       TEXT NOT NULL,
        template_id TEXT NOT NULL DEFAULT 'classic',
        content     TEXT NOT NULL,
        created_at  TEXT NOT NULL,
        updated_at  TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX idx_resumes_user ON resumes(user_id);
      CREATE INDEX idx_resumes_updated ON resumes(user_id, updated_at DESC);

      CREATE TABLE ai_usage (
        user_id TEXT NOT NULL,
        day     TEXT NOT NULL,
        count   INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (user_id, day),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `,
  },
];

export function migrate(db: DatabaseSync): void {
  db.exec(
    `CREATE TABLE IF NOT EXISTS _migrations (
       id TEXT PRIMARY KEY,
       applied_at TEXT NOT NULL
     );`,
  );

  const applied = new Set(
    db
      .prepare("SELECT id FROM _migrations")
      .all()
      .map((row) => (row as { id: string }).id),
  );

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.id)) continue;
    db.exec("BEGIN");
    try {
      db.exec(migration.sql);
      db.prepare("INSERT INTO _migrations (id, applied_at) VALUES (?, ?)").run(
        migration.id,
        new Date().toISOString(),
      );
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}
