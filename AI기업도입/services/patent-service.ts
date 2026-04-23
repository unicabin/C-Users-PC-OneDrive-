import { patentKeywords, patentScenarios } from "@/data/patent-data";
import { withServiceContext } from "@/lib/data-provider";

export function getPatentKeywords() {
  return withServiceContext(() => patentKeywords);
}

export function getPatentScenario(keyword: string) {
  return withServiceContext(() => patentScenarios[keyword] ?? patentScenarios["지문인식 시동장치"]);
}
