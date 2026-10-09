"use client";

import { useState } from "react";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Alert, Badge } from "@/components/ui/surfaces";
import { IconSparkles } from "@/components/ui/icons";
import type { AiAction, AiResult, AiSuggestion } from "@/lib/ai/schema";

interface AiSuggestButtonProps {
  action: AiAction;
  /** Texto que será analisado/melhorado; deve ser preparado pelo chamador. */
  getText: () => string;
  sectionLabel?: string;
  targetRole?: string;
  onApply?: (text: string) => void;
  label?: string;
  variant?: ButtonVariant;
  size?: "sm" | "md";
  disabled?: boolean;
}

/**
 * Botão que consulta o assistente e apresenta as sugestões ANTES de aplicar.
 * O usuário aceita, edita ou descarta — nada é alterado automaticamente.
 */
export function AiSuggestButton({
  action,
  getText,
  sectionLabel,
  targetRole,
  onApply,
  label = "Sugerir com IA",
  variant = "outline",
  size = "sm",
  disabled,
}: AiSuggestButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function request() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          text: getText(),
          context: { sectionLabel, targetRole },
        }),
      });
      const data = (await response.json().catch(() => ({}))) as
        | AiResult
        | { error?: string };

      if (!response.ok) {
        setError(
          ("error" in data && data.error) ||
            "Não foi possível obter sugestões agora.",
        );
        return;
      }
      if ("error" in data && data.error) {
        setError(data.error);
        return;
      }
      setResult(data as AiResult);
    } catch {
      setError("Falha de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function openAndRequest() {
    setOpen(true);
    void request();
  }

  function apply(suggestion: AiSuggestion) {
    if (suggestion.text && onApply) onApply(suggestion.text);
    setOpen(false);
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={openAndRequest}
        disabled={disabled}
      >
        <IconSparkles className="h-4 w-4" />
        {label}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Sugestões do assistente"
        description="Revise cada sugestão. Você decide o que aplicar."
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={request} disabled={loading}>
              Tentar novamente
            </Button>
            <Button onClick={() => setOpen(false)}>Fechar</Button>
          </>
        }
      >
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-brand-500">Analisando…</p>
          ) : null}

          {error ? <Alert tone="danger">{error}</Alert> : null}

          {result ? (
            <>
              <div className="flex items-center gap-2">
                {result.source === "ai" ? (
                  <Badge tone="accent">IA</Badge>
                ) : (
                  <Badge tone="neutral">Assistente local</Badge>
                )}
                <p className="text-xs text-brand-500">{result.notice}</p>
              </div>

              <ul className="space-y-3">
                {result.suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="rounded-md border border-line bg-brand-50/40 p-4"
                  >
                    <p className="text-sm font-semibold text-brand-900">
                      {suggestion.title}
                    </p>

                    {suggestion.notes?.length ? (
                      <ul className="mt-2 space-y-1 text-sm text-brand-600">
                        {suggestion.notes.map((note) => (
                          <li key={note} className="flex gap-2">
                            <span aria-hidden className="text-brand-300">
                              •
                            </span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {suggestion.text ? (
                      <>
                        <p className="mt-3 whitespace-pre-line rounded-md border border-line bg-white p-3 text-sm text-brand-800">
                          {suggestion.text}
                        </p>
                        {onApply ? (
                          <div className="mt-3">
                            <Button size="sm" onClick={() => apply(suggestion)}>
                              Aplicar esta versão
                            </Button>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>

              {result.source === "local" ? (
                <p className="text-xs text-brand-400">
                  Dica: para sugestões de redação geradas por IA, configure
                  AI_API_KEY no servidor. Enquanto isso, a edição manual continua
                  disponível.
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
