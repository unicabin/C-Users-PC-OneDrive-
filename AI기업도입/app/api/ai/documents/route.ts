import { NextResponse } from "next/server";

import { generateStructuredJson } from "@/lib/openai/server";
import type { AiDocumentSummary } from "@/types/ai";

const documentSchema = {
  name: "document_summary_result",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["title", "summary", "keyPoints", "relatedQueries"],
    properties: {
      title: { type: "string" },
      summary: { type: "string" },
      keyPoints: {
        type: "array",
        items: { type: "string" },
        minItems: 3,
        maxItems: 5,
      },
      relatedQueries: {
        type: "array",
        items: { type: "string" },
        minItems: 2,
        maxItems: 4,
      },
    },
  },
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, document } = body;

    if (!document?.title || !document?.summary) {
      return NextResponse.json(
        { error: "요약할 문서 정보가 필요합니다." },
        { status: 400 },
      );
    }

    const prompt = `
당신은 제조업 기술자료 분석 담당자입니다.
다음 문서를 바탕으로 실무형 요약을 한국어 JSON으로 작성하세요.

[사용자 질문]
${question || "문서 핵심 내용을 요약해 주세요."}

[문서 정보]
${JSON.stringify(document, null, 2)}

[요구사항]
- 요약은 기술 검토 보고용 문장
- 핵심 포인트는 3~5개
- 다음 탐색용 관련 질의는 2~4개
`;

    const result = await generateStructuredJson<AiDocumentSummary>({
      prompt,
      schema: documentSchema,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "문서 요약 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
