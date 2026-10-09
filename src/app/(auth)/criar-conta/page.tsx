import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Criar conta",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/painel");

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950">
        Criar sua conta
      </h1>
      <p className="mt-2 text-sm text-brand-600">
        Crie sua conta gratuita para começar seu currículo agora.
      </p>
      <div className="mt-8">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
