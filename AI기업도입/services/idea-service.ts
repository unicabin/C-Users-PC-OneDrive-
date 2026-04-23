import {
  ideaDirections,
  ideaInitialInput,
  ideaMarkets,
  ideaProductGroups,
  ideaSeeds,
} from "@/data/idea-data";
import { withServiceContext } from "@/lib/data-provider";
import type { IdeaInput } from "@/types/domain";

export function getIdeaOptions() {
  return withServiceContext(() => ({
    markets: ideaMarkets,
    productGroups: ideaProductGroups,
    directions: ideaDirections,
    initialInput: ideaInitialInput,
  }));
}

export function generateIdeaResults(input: IdeaInput, variantSeed = 0) {
  return withServiceContext(() =>
    ideaSeeds.map((idea, index) => ({
      ...idea,
      emphasis:
        (index + variantSeed) % 3 === 0 && input.direction === "안전성 강화"
          ? "우선 추천"
          : (index + variantSeed) % 3 === 1 && input.direction === "원가절감"
            ? "적합"
            : (index + variantSeed) % 3 === 2 && input.direction === "자동화"
              ? "확장성 높음"
              : "검토 추천",
    })),
  );
}
