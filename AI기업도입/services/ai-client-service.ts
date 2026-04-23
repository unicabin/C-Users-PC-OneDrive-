import type { AiAutomationResult, AiDocumentSummary, AiIdeaResult, AiPatentAnalysis } from "@/types/ai";
import type { IdeaInput, PatentAnalysisScenario, ResearchDocument } from "@/types/domain";

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || "AI 요청 중 오류가 발생했습니다.");
  }

  return json as T;
}

export async function requestAiIdeas(input: IdeaInput, references: string[] = []) {
  return postJson<{ ideas: AiIdeaResult[] }>("/api/ai/ideas", {
    ...input,
    references,
  });
}

export async function requestAiGenerateIdeaText(input: {
  keyword: string;
  category: string;
  goal: string;
}) {
  return postJson<{ result: string }>("/api/ai/generate-idea", input);
}

export async function requestAiPatentAnalysis(
  keyword: string,
  scenario: PatentAnalysisScenario,
) {
  return postJson<AiPatentAnalysis>("/api/ai/patents", {
    keyword,
    patents: scenario.patents,
    competitorTrends: scenario.competitorTrends,
    insights: scenario.insights,
  });
}

export async function requestAiDocumentSummary(
  question: string,
  document: ResearchDocument,
) {
  return postJson<AiDocumentSummary>("/api/ai/documents", {
    question,
    document,
  });
}

export async function requestAiAutomation(input: {
  prompt: string;
  projectContext: string;
}) {
  return postJson<AiAutomationResult>("/api/ai/automation", input);
}
