import { NextResponse } from "next/server";

import { generateStructuredJson } from "@/lib/openai/server";
import type { AiAutomationResult } from "@/types/ai";

const automationSchema = {
  name: "automation_result",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["title", "output", "language", "notes"],
    properties: {
      title: { type: "string" },
      output: { type: "string" },
      language: { type: "string" },
      notes: {
        type: "array",
        items: { type: "string" },
        minItems: 1,
        maxItems: 5,
      },
    },
  },
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, projectContext } = body as {
      prompt: string;
      projectContext?: string;
    };

    if (!prompt) {
      return NextResponse.json(
        { error: "프롬프트가 필요합니다." },
        { status: 400 },
      );
    }

    const fullPrompt = `
당신은 제조업 임베디드 시스템 전문 엔지니어입니다.
다음 요청에 맞는 코드, 설계서, 사양서, 또는 체크리스트를 작성하세요.

[프로젝트 컨텍스트]
${projectContext || "제조업 임베디드 시스템 개발 프로젝트"}

[요청]
${prompt}

[요구사항]
- 한국어 설명, 코드는 해당 언어 그대로 사용
- 실무에서 바로 사용 가능한 완성도
- title: 생성된 산출물의 제목
- output: 실제 코드 또는 문서 내용 (마크다운 형식 허용)
- language: 사용된 언어 또는 문서 형식 (예: C, Markdown, Checklist)
- notes: 사용 시 주의사항 또는 추가 설명 (1~5개)
`;

    const result = await generateStructuredJson<AiAutomationResult>({
      prompt: fullPrompt,
      schema: automationSchema,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "산출물 생성 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
