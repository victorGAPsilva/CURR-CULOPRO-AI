import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Cada arquivo de teste roda em um banco SQLite temporário isolado.
 * As migrações são aplicadas automaticamente na primeira conexão.
 */
const dir = mkdtempSync(join(tmpdir(), "curriculopro-test-"));
process.env.DATABASE_PATH = join(dir, "test.sqlite");

// Garante que a conexão seja recriada apontando para o banco temporário.
(globalThis as { __curriculoproDb?: unknown }).__curriculoproDb = undefined;
