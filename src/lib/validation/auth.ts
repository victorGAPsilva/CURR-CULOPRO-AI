import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(160),
  password: z.string().min(1, "Informe sua senha.").max(100),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome.").max(120),
    email: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(160),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      .max(100, "A senha deve ter no máximo 100 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/** Converte erros do Zod em um mapa campo -> primeira mensagem. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
