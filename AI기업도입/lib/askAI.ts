import { searchDocuments, type MatchedDocument } from "@/lib/search";

type ResponsesApiContent = {
  type?: string;
  text?: string;
};

type ResponsesApiOutput = {
  content?: ResponsesApiContent[];
};

type ResponsesApiResponse = {
  output?: ResponsesApiOutput[];
  output_text?: string;
  error?: {
    message?: string;
  };
};

export type AskAIResult = {
  answer: string;
  sources: SourceDocument[];
  meta: AskAIMeta;
};

export type AskAIOptions = {
  minSimilarity?: number;
};

export type SourceDocument = {
  document_name: string;
  similarity: number;
};

export type AskAIMeta = {
  blocked: boolean;
  minSimilarityThreshold: number;
  maxSimilarity: number;
  sourceCount: number;
};

const DEFAULT_MIN_SIMILARITY = 0.5;

function safeSimilarity(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function getMinSimilarityThreshold() {
  const raw = process.env.RAG_MIN_SIMILARITY;
  const parsed = Number(raw);

  if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) {
    return parsed;
  }

  return DEFAULT_MIN_SIMILARITY;
}

function resolveMinSimilarityThreshold(override?: number) {
  if (
    typeof override === "number" &&
    Number.isFinite(override) &&
    override >= 0 &&
    override <= 1
  ) {
    return override;
  }

  return getMinSimilarityThreshold();
}

function getResponseText(data: ResponsesApiResponse) {
  if (data.output_text) {
    return data.output_text;
  }

  return (
    data.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .find(Boolean) ?? ""
  );
}

export async function askAI(
  question: string,
  options?: AskAIOptions,
): Promise<AskAIResult> {
  console.log("[askAI] question received", { question, options });

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const docs = await searchDocuments(question, 5);
  const sortedDocs = [...docs].sort((a, b) => b.similarity - a.similarity);
  const sources = toSources(sortedDocs);
  const maxSimilarity = sources[0]?.similarity ?? 0;
  const minSimilarityThreshold = resolveMinSimilarityThreshold(
    options?.minSimilarity,
  );

  if (!sources.length || maxSimilarity < minSimilarityThreshold) {
    console.log("[askAI] blocked by similarity threshold", {
      sourceCount: sources.length,
      maxSimilarity,
      minSimilarityThreshold,
    });

    return {
      answer:
        "질문과 충분히 유사한 문서를 찾지 못했습니다. 관련 PDF를 추가로 업로드한 뒤 다시 질문해 주세요.",
      sources,
      meta: {
        blocked: true,
        minSimilarityThreshold,
        maxSimilarity,
        sourceCount: sources.length,
      },
    };
  }

  const context = sortedDocs
    .map((document, index) => {
      const similarity = safeSimilarity(document.similarity);
      return `[문서 ${index + 1}: ${document.document_name}, 유사도 ${similarity.toFixed(4)}]\n${document.content}`;
    })
    .join("\n\n");

  const prompt = `
다음 자료를 기반으로 답변하세요.
자료에 없는 내용은 추측하지 말고, 확인 가능한 범위에서만 답변하세요.

${context || "검색된 문서가 없습니다."}

질문:
${question}
`;

  console.log("[askAI] calling OpenAI responses API", {
    sourceCount: sortedDocs.length,
  });

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      input: prompt,
    }),
  });

  const data = (await res.json()) as ResponsesApiResponse;

  if (!res.ok) {
    console.log("[askAI] OpenAI error", data.error);
    throw new Error(data.error?.message ?? "AI request failed.");
  }

  const answer = getResponseText(data);

  console.log("[askAI] answer generated", {
    answerLength: answer.length,
    sourceCount: sortedDocs.length,
  });

  return {
    answer,
    sources,
    meta: {
      blocked: false,
      minSimilarityThreshold,
      maxSimilarity,
      sourceCount: sources.length,
    },
  };
}

function toSources(documents: MatchedDocument[]): SourceDocument[] {
  const sources = new Map<string, SourceDocument>();

  for (const document of documents) {
    const documentName = document.document_name || "unknown_document";
    const similarity = safeSimilarity(document.similarity);
    const currentSource = sources.get(documentName);

    if (!currentSource || similarity > currentSource.similarity) {
      sources.set(documentName, {
        document_name: documentName,
        similarity,
      });
    }
  }

  return Array.from(sources.values()).sort(
    (a, b) => b.similarity - a.similarity,
  );
}

