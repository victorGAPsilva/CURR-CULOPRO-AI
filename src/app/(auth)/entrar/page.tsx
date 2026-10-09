import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/painel");

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950">
        Entrar na sua conta
      </h1>
      <p className="mt-2 text-sm text-brand-600">
        Acesse seus currículos salvos e continue de onde parou.
      </p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
