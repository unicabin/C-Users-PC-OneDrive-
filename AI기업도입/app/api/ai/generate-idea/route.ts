import { NextResponse } from "next/server";

type ResponsesContent = {
  type?: string;
  text?: string;
};

type ResponsesOutput = {
  content?: ResponsesContent[];
};

type ResponsesPayload = {
  output_text?: string;
  output?: ResponsesOutput[];
  error?: { message?: string };
};

function extractText(payload: ResponsesPayload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  const text = payload.output
    ?.flatMap((item) => item.content ?? [])
    ?.find((item) => item.type === "output_text")?.text;

  if (typeof text === "string" && text.trim()) {
    return text;
  }

  return "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { keyword, category, goal } = body as {
      keyword?: string;
      category?: string;
      goal?: string;
    };

    if (!keyword || !category || !goal) {
      return NextResponse.json(
        { error: "keyword, category, goal 값이 필요합니다." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY 환경변수가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const prompt = `
당신은 산업장비 및 지게차 안전장치 전문가입니다.

다음 조건을 기반으로 신제품 아이디어 3개를 제안하세요.

키워드: ${keyword}
제품군: ${category}
목표: ${goal}

각 아이디어는 아래 형식으로 작성하세요:
1. 제품명
2. 핵심 기능
3. 기대 효과
4. 차별화 포인트
`;

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: prompt,
      }),
    });

    const data = (await res.json()) as ResponsesPayload;

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? "OpenAI 요청 실패" },
        { status: res.status },
      );
    }

    const text = extractText(data);
    if (!text) {
      return NextResponse.json(
        { error: "AI 응답 파싱 실패" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      result: text,
    });
  } catch {
    return NextResponse.json({ error: "AI 생성 실패" }, { status: 500 });
  }
}
