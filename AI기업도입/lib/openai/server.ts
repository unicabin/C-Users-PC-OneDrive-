import "server-only";

type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
};

type OpenAiContentItem = {
  type?: string;
  text?: string;
};

type OpenAiOutputItem = {
  content?: OpenAiContentItem[];
};

type OpenAiResponsePayload = {
  output_text?: string;
  output?: OpenAiOutputItem[];
};

function getOpenAiConfig() {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5.2";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY 환경변수가 설정되지 않았습니다.");
  }

  return { apiKey, model };
}

function extractOutputText(payload: OpenAiResponsePayload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  const text = payload.output
    ?.flatMap((item) => item.content ?? [])
    ?.find((content) => content.type === "output_text")?.text;

  if (typeof text === "string" && text.trim()) {
    return text;
  }

  throw new Error("OpenAI 응답에서 텍스트 결과를 찾지 못했습니다.");
}

export async function generateStructuredJson<T>({
  prompt,
  schema,
}: {
  prompt: string;
  schema: JsonSchema;
}): Promise<T> {
  const { apiKey, model } = getOpenAiConfig();

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "Return valid JSON only. 응답은 반드시 JSON 스키마를 따라야 합니다.",
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: prompt }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: schema.name,
          schema: schema.schema,
          strict: true,
        },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI API 호출 실패: ${response.status} ${detail}`);
  }

  const payload = (await response.json()) as OpenAiResponsePayload;
  const outputText = extractOutputText(payload);

  try {
    return JSON.parse(outputText) as T;
  } catch {
    throw new Error("OpenAI JSON 응답을 파싱하지 못했습니다.");
  }
}
