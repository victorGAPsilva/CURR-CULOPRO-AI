import { getServerConfig } from "@/lib/config";

export class AiUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "AiUnavailableError";
    if (options?.cause) this.cause = options.cause;
  }
}

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

/**
 * Chama um provedor compatível com a API Chat Completions da OpenAI.
 * A execução acontece exclusivamente no servidor; a chave nunca vai ao cliente.
 */
export async function completeJson(
  messages: ChatMessage[],
  options?: { timeoutMs?: number },
): Promise<string> {
  const config = getServerConfig();
  if (!config.ai.apiKey) {
    throw new AiUnavailableError("Provedor de IA não configurado.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 25000);

  try {
    const response = await fetch(`${config.ai.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.ai.apiKey}`,
      },
      body: JSON.stringify({
        model: config.ai.model,
        temperature: 0.3,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new AiUnavailableError(
        `Provedor de IA respondeu ${response.status}. ${detail.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new AiUnavailableError("Resposta vazia do provedor de IA.");
    }
    return content;
  } catch (error) {
    if (error instanceof AiUnavailableError) throw error;
    throw new AiUnavailableError("Falha ao contatar o provedor de IA.", {
      cause: error,
    });
  } finally {
    clearTimeout(timeout);
  }
}
