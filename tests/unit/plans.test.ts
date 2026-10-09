import { describe, expect, it } from "vitest";
import {
  aiDailyLimitForPlan,
  canUseTemplate,
  getPlanDefinition,
} from "@/lib/plans/rules";

describe("regras de plano", () => {
  it("define limites de IA por plano", () => {
    expect(aiDailyLimitForPlan("free")).toBeGreaterThan(0);
    expect(aiDailyLimitForPlan("premium")).toBeGreaterThanOrEqual(
      aiDailyLimitForPlan("free"),
    );
  });

  it("restringe modelos premium ao plano premium", () => {
    expect(canUseTemplate("free", "classic")).toBe(true);
    expect(canUseTemplate("free", "modern")).toBe(false);
    expect(canUseTemplate("free", "minimal")).toBe(false);
    expect(canUseTemplate("premium", "modern")).toBe(true);
    expect(canUseTemplate("premium", "minimal")).toBe(true);
  });

  it("descreve cada plano com recursos", () => {
    expect(getPlanDefinition("free").features.length).toBeGreaterThan(0);
    expect(getPlanDefinition("premium").allowsPremiumTemplates).toBe(true);
  });
});
