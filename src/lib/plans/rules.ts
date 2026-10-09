import { getServerConfig } from "@/lib/config";
import type { PlanId } from "@/lib/db/users";
import { TEMPLATES } from "@/lib/resume/templates";
import type { TemplateId } from "@/lib/resume/schema";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  priceLabel: string;
  aiDailyLimit: number;
  allowsPremiumTemplates: boolean;
  description: string;
  features: string[];
}

/**
 * Regras de plano centralizadas no servidor. Componentes de UI consultam estes
 * dados em vez de espalhar verificações condicionais.
 */
export function getPlanDefinition(plan: PlanId): PlanDefinition {
  const config = getServerConfig();

  if (plan === "premium") {
    return {
      id: "premium",
      name: "Premium",
      // Valor real virá do provedor de pagamento quando integrado.
      // Até lá, nada é exibido como preço na interface.
      priceLabel: "A definir",
      aiDailyLimit: config.ai.premiumDailyLimit,
      allowsPremiumTemplates: true,
      description: "Para quem está aplicando a várias vagas e quer personalizar.",
      features: [
        "Todos os modelos, incluindo Moderno e Minimalista",
        `Até ${config.ai.premiumDailyLimit} usos de IA por dia`,
        "Adaptação do currículo para uma vaga específica",
        "Assistente contextual em todas as seções",
      ],
    };
  }

  return {
    id: "free",
    name: "Gratuito",
    priceLabel: "R$ 0",
    aiDailyLimit: config.ai.freeDailyLimit,
    allowsPremiumTemplates: false,
    description: "O essencial para criar e exportar seu currículo.",
    features: [
      "Criação e edição ilimitadas de currículos",
      "Modelo Clássico",
      "Pré-visualização e exportação em PDF",
      `Até ${config.ai.freeDailyLimit} usos de IA por dia`,
    ],
  };
}

export function aiDailyLimitForPlan(plan: PlanId): number {
  const config = getServerConfig();
  return plan === "premium" ? config.ai.premiumDailyLimit : config.ai.freeDailyLimit;
}

export function canUseTemplate(plan: PlanId, templateId: TemplateId): boolean {
  const meta = TEMPLATES.find((template) => template.id === templateId);
  if (!meta) return false;
  if (meta.tier === "free") return true;
  return plan === "premium";
}
