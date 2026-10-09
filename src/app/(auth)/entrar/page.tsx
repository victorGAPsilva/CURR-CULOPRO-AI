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
      <p className="flex items-center gap-3 text-accent-700">
        <span className="font-display text-lg italic leading-none">conta</span>
        <span aria-hidden className="h-px w-10 bg-accent-400/60" />
      </p>
      <h1 className="mt-3 font-display text-3xl font-medium leading-[1.12] tracking-tight text-brand-950">
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
