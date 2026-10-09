import { describe, expect, it } from "vitest";
import {
  hashPassword,
  validatePasswordStrength,
  verifyPassword,
} from "@/lib/auth/password";

describe("senhas", () => {
  it("gera hash verificável e usa salt diferente a cada chamada", async () => {
    const a = await hashPassword("Senha1234");
    const b = await hashPassword("Senha1234");

    expect(a).not.toBe(b);
    expect(a.startsWith("scrypt$")).toBe(true);
    await expect(verifyPassword("Senha1234", a)).resolves.toBe(true);
    await expect(verifyPassword("senha-errada", a)).resolves.toBe(false);
  });

  it("rejeita hashes malformados sem lançar exceção", async () => {
    await expect(verifyPassword("x", "formato-invalido")).resolves.toBe(false);
    await expect(verifyPassword("x", "")).resolves.toBe(false);
  });

  it("valida força mínima da senha", () => {
    expect(validatePasswordStrength("S3nh4fraca")).toBeNull();
    expect(validatePasswordStrength("curta")).toMatch(/8 caracteres/);
    expect(validatePasswordStrength("12345678")).toMatch(/letra/);
    expect(validatePasswordStrength("somentetexto")).toMatch(/número/);
  });
});
