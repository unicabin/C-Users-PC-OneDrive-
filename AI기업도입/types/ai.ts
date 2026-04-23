export type AiIdeaResult = {
  title: string;
  coreFeature: string;
  pitch: string;
  effects: string[];
  differentiation: string;
  customers: string;
  emphasis: string;
};

export type AiPatentAnalysis = {
  keyword: string;
  summary: string;
  riskLevel: "낮음" | "중간" | "높음";
  keyClaims: string[];
  avoidanceIdeas: string[];
  competitorTrend: string;
};

export type AiDocumentSummary = {
  title: string;
  summary: string;
  keyPoints: string[];
  relatedQueries: string[];
};

export type AiAutomationResult = {
  title: string;
  output: string;
  language: string;
  notes: string[];
};
