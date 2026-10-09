"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="rounded-md px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 hover:text-brand-900 disabled:opacity-60"
    >
      {loading ? "Saindo…" : "Sair"}
    </button>
  );
}
