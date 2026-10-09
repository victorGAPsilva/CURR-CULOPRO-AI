/**
 * Configuração de servidor. Nunca deve ser importada por componentes de cliente.
 * Centraliza a leitura de variáveis de ambiente e valores padrão seguros.
 */

function readInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export interface ServerConfig {
  databasePath: string;
  sessionSecret: string;
  appUrl: string;
  ai: {
    baseUrl: string;
    apiKey: string | null;
    model: string;
    freeDailyLimit: number;
    premiumDailyLimit: number;
  };
  payments: {
    provider: string | null;
    enabled: boolean;
  };
  isProduction: boolean;
}

export function getServerConfig(): ServerConfig {
  const isProduction = process.env.NODE_ENV === "production";
  const sessionSecret = process.env.SESSION_SECRET ?? "";

  return {
    databasePath: process.env.DATABASE_PATH ?? "./data/curriculopro.sqlite",
    // Os tokens de sessão são aleatórios (256 bits) e armazenados apenas como
    // hash, portanto não dependem de assinatura. O segredo fica reservado para
    // usos futuros (ex.: proteção CSRF) e é recomendado em produção.
    sessionSecret: sessionSecret || "dev-secret-nao-use-em-producao-000000000000",
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    ai: {
      baseUrl: (process.env.AI_BASE_URL ?? "https://api.openai.com/v1").replace(
        /\/$/,
        "",
      ),
      apiKey: process.env.AI_API_KEY?.trim() || null,
      model: process.env.AI_MODEL?.trim() || "gpt-4o-mini",
      freeDailyLimit: readInt(process.env.AI_FREE_DAILY_LIMIT, 10),
      premiumDailyLimit: readInt(process.env.AI_PREMIUM_DAILY_LIMIT, 200),
    },
    payments: {
      provider: process.env.PAYMENT_PROVIDER?.trim() || null,
      enabled: Boolean(process.env.PAYMENT_PROVIDER && process.env.PAYMENT_SECRET_KEY),
    },
    isProduction,
  };
}

/** Indica se a IA generativa está configurada com credenciais válidas. */
export function isAiConfigured(): boolean {
  return Boolean(process.env.AI_API_KEY?.trim());
}
