"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/surfaces";
import { Field, Input } from "@/components/ui/fields";
import { IconInfo } from "@/components/ui/icons";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fields, setFields] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setFields({});
    setFormError(null);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister
        ? values
        : { email: values.email, password: values.password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: Record<string, string>;
      };

      if (!response.ok) {
        setFields(data.fields ?? {});
        setFormError(
          data.error ?? "Não foi possível concluir. Verifique os dados e tente novamente.",
        );
        return;
      }

      router.push("/painel");
      router.refresh();
    } catch {
      setFormError(
        "Falha de conexão. Verifique sua internet e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {formError ? <Alert tone="danger">{formError}</Alert> : null}

      {isRegister ? (
        <Field
          label="Nome completo"
          htmlFor="name"
          required
          error={fields.name}
        >
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            invalid={Boolean(fields.name)}
            required
          />
        </Field>
      ) : null}

      <Field label="E-mail" htmlFor="email" required error={fields.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          invalid={Boolean(fields.email)}
          required
        />
      </Field>

      <Field
        label="Senha"
        htmlFor="password"
        required
        error={fields.password}
        hint={isRegister ? "Mínimo de 8 caracteres, com letras e números." : undefined}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          value={values.password}
          onChange={(event) => update("password", event.target.value)}
          invalid={Boolean(fields.password)}
          required
        />
      </Field>

      {isRegister ? (
        <Field
          label="Confirmar senha"
          htmlFor="confirmPassword"
          required
          error={fields.confirmPassword}
        >
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(event) => update("confirmPassword", event.target.value)}
            invalid={Boolean(fields.confirmPassword)}
            required
          />
        </Field>
      ) : null}

      <Button type="submit" size="lg" loading={loading} className="w-full">
        {isRegister ? "Criar conta" : "Entrar"}
      </Button>

      <p className="text-center text-sm text-brand-600">
        {isRegister ? (
          <>
            Já tem uma conta?{" "}
            <Link href="/entrar" className="font-medium text-accent-700 hover:underline">
              Entrar
            </Link>
          </>
        ) : (
          <>
            Ainda não tem conta?{" "}
            <Link
              href="/criar-conta"
              className="font-medium text-accent-700 hover:underline"
            >
              Criar conta
            </Link>
          </>
        )}
      </p>

      {!isRegister ? (
        <p className="flex items-start gap-2 rounded-md bg-brand-50 px-3 py-2 text-xs text-brand-600">
          <IconInfo className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
          A recuperação de senha por e-mail ainda não está disponível nesta
          instalação. Ela depende de um serviço de envio de e-mails ainda não
          configurado.
        </p>
      ) : null}
    </form>
  );
}
