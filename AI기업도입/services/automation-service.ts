import { automationTemplates } from "@/data/automation-data";
import { withServiceContext } from "@/lib/data-provider";
import type { AutomationCategory } from "@/types/domain";

export function getAutomationTemplates() {
  return withServiceContext(() => automationTemplates);
}

export function getAutomationCategories(): AutomationCategory[] {
  return ["코드", "설계", "사양서", "체크리스트"];
}

export function getTemplatesByCategory(category: AutomationCategory | "전체") {
  return withServiceContext(() =>
    category === "전체"
      ? automationTemplates
      : automationTemplates.filter((t) => t.category === category),
  );
}
