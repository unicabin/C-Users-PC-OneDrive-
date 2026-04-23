import { NextResponse } from "next/server";

import { generateStructuredJson } from "@/lib/openai/server";
import type { AiPatentAnalysis } from "@/types/ai";

const patentSchema = {
  name: "patent_analysis_result",
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "keyword",
      "summary",
      "riskLevel",
      "keyClaims",
      "avoidanceIdeas",
      "competitorTrend",
    ],
    properties: {
      keyword: { type: "string" },
      summary: { type: "string" },
      riskLevel: { type: "string", enum: ["낮음", "중간", "높음"] },
      keyClaims: {
        type: "array",
        items: { type: "string" },
        minItems: 3,
        maxItems: 5,
      },
      avoidanceIdeas: {
        type: "array",
        items: { type: "string" },
        minItems: 2,
        maxItems: 4,
      },
      competitorTrend: { type: "string" },
    },
  },
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keyword, patents, competitorTrends, insights } = body;

    if (!keyword) {
      return NextResponse.json(
        { error: "분석할 키워드가 필요합니다." },
        { status: 400 },
      );
    }

    const prompt = `
당신은 제조업 특허분석 실무자입니다.
다음 특허 데이터를 기반으로 제품 아이디어의 특허 리스크를 한국어로 요약하세요.

[분석 키워드]
${keyword}

[유사 특허 목록]
${JSON.stringify(patents ?? [], null, 2)}

[경쟁사 특허 동향]
${JSON.stringify(competitorTrends ?? [], null, 2)}

[사전 인사이트]
${JSON.stringify(insights ?? [], null, 2)}

[요구사항]
- 실제 개발팀이 이해하기 쉬운 실무형 문장
- 위험도는 낮음/중간/높음 중 하나
- 핵심 청구항 요약은 3~5개
- 회피 설계 아이디어는 2~4개
`;

    const result = await generateStructuredJson<AiPatentAnalysis>({
      prompt,
      schema: patentSchema,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "특허 분석 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
