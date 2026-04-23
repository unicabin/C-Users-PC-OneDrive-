import { NextResponse } from "next/server";

import { generateStructuredJson } from "@/lib/openai/server";
import type { AiIdeaResult } from "@/types/ai";

const ideaSchema = {
  name: "idea_generation_result",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["ideas"],
    properties: {
      ideas: {
        type: "array",
        minItems: 3,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "title",
            "coreFeature",
            "pitch",
            "effects",
            "differentiation",
            "customers",
            "emphasis",
          ],
          properties: {
            title: { type: "string" },
            coreFeature: { type: "string" },
            pitch: { type: "string" },
            effects: {
              type: "array",
              items: { type: "string" },
              minItems: 2,
              maxItems: 4,
            },
            differentiation: { type: "string" },
            customers: { type: "string" },
            emphasis: { type: "string" },
          },
        },
      },
    },
  },
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keyword, market, productGroup, direction, references } = body;

    if (!keyword || !market || !productGroup || !direction) {
      return NextResponse.json(
        { error: "키워드, 시장, 제품군, 목표 방향이 필요합니다." },
        { status: 400 },
      );
    }

    const prompt = `
당신은 제조업 제품기획팀의 선임 PM입니다.
다음 입력을 바탕으로 실제 기획회의에서 바로 사용할 수 있는 신제품 아이디어를 작성하세요.

[입력]
- 키워드: ${keyword}
- 대상 시장: ${market}
- 제품군: ${productGroup}
- 목표 방향: ${direction}
- 참고 데이터: ${JSON.stringify(references ?? [], null, 2)}

[요구사항]
- 한국어로 작성
- 중복되지 않는 아이디어 3~5개
- 발표자료에 넣을 수 있는 문장 톤
- 안전성, 사업성, 현장 적용성을 고려
`;

    const result = await generateStructuredJson<{ ideas: AiIdeaResult[] }>({
      prompt,
      schema: ideaSchema,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "아이디어 생성 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
