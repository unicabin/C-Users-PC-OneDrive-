import type { Route } from "next";
import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  label: string;
  href: Route;
};

export type PageContent = {
  title: string;
  description: string;
};

export type ModuleStatus = {
  name: string;
  status: string;
};

export type DashboardStatCard = {
  title: string;
  value: string;
  change: string;
  description: string;
  tone: "sky" | "rose" | "mint" | "amber";
};

export type ProjectSummary = {
  id: string;
  name: string;
  stage: string;
  owner: string;
  updatedAt: string;
  progress: number;
};

export type ProjectStatus = "기획중" | "분석중" | "개발중" | "완료";

export type ProjectPriority = "낮음" | "중간" | "높음" | "긴급";

export type RiskLevel = "낮음" | "중간" | "높음";

export type ProjectRecord = {
  id: string;
  name: string;
  code: string;
  description: string;
  productGroup: string;
  owner: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  createdAt: string;
  updatedAt: string;
  targetDate: string;
  tags: string[];
};

export type ProjectRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  created_at: string;
};

export type ProjectInsertInput = {
  user_id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
};

export type ProjectFormInput = {
  name: string;
  description: string;
  productGroup: string;
  owner: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  targetDate: string;
  tags: string;
};

export type DocumentCategory =
  | "설계자료"
  | "사양서"
  | "시험성적서"
  | "도면설명"
  | "개발이력"
  | "기타";

export type DocumentFileType = "PDF" | "DOCX" | "XLSX" | "PPTX" | "TXT";

export type DocumentRow = {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  content: string | null;
  category: DocumentCategory;
  file_type: DocumentFileType;
  created_at: string;
};

export type DocumentInsertInput = {
  user_id: string;
  project_id?: string | null;
  title: string;
  content?: string | null;
  category: DocumentCategory;
  file_type: DocumentFileType;
};

export type PatentRow = {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  summary: string | null;
  risk_level: RiskLevel;
  similarity: number;
  created_at: string;
};

export type PatentInsertInput = {
  user_id: string;
  project_id?: string | null;
  title: string;
  summary?: string | null;
  risk_level: RiskLevel;
  similarity: number;
};

export type PredictionRow = {
  id: string;
  project_id: string;
  score: number;
  risk: RiskLevel;
  recommendation: string | null;
  created_at: string;
};

export type PredictionInsertInput = {
  project_id: string;
  score: number;
  risk: RiskLevel;
  recommendation?: string | null;
};

export type IdeaRow = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  effect: string | null;
  created_at: string;
};

export type IdeaInsertInput = {
  project_id: string;
  title: string;
  description?: string | null;
  effect?: string | null;
};

export type RecentDocumentSummary = {
  title: string;
  category: string;
  tags: string[];
  savedAt: string;
};

export type PatentAlert = {
  name: string;
  risk: RiskLevel;
  issue: string;
  action: string;
};

export type PredictionSummary = {
  label: string;
  value: string;
  status: string;
};

export type QuickAction = {
  label: string;
  icon: LucideIcon;
  href: Route;
};

export type WorkflowCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: Route;
};

export type ResearchDocument = {
  id: string;
  title: string;
  project: string;
  type: DocumentFileType;
  importance: "최상" | "상" | "중";
  summary: string;
  tags: string[];
  updatedAt: string;
  owner: string;
  pages: string;
  score: number;
};

export type RecommendedResearchDocument = {
  title: string;
  type: ResearchDocument["type"];
  relation: string;
};

export type SummaryCard = {
  title: string;
  description: string;
};

export type ResearchSortOption = "latest" | "importance" | "relevance";

export type PatentRecord = {
  id: string;
  title: string;
  owner: string;
  similarity: number;
  risk: RiskLevel;
  summary: string;
  claim: string;
};

export type PatentAvoidanceIdea = {
  title: string;
  detail: string;
};

export type CompetitorPatentTrend = {
  company: string;
  focus: string;
  volume: string;
  status: "확대" | "유지" | "축소";
};

export type PatentInsight = {
  title: string;
  detail: string;
  tone: "danger" | "warning" | "success";
};

export type PatentAnalysisScenario = {
  keyword: string;
  patents: PatentRecord[];
  avoidanceIdeas: PatentAvoidanceIdea[];
  competitorTrends: CompetitorPatentTrend[];
  insights: PatentInsight[];
};

export type PredictionInput = {
  productName: string;
  equipmentType: string;
  voltage: string;
  sensorType: string;
  communication: string;
  environment: string;
  mountPosition: string;
  targetFunction: string;
};

export type PredictionResult = {
  score: number;
  stability: string;
  risks: string[];
  recommendations: string[];
  alternatives: string[];
  efficiency: string;
  durability: string;
};

export type IdeaResult = {
  title: string;
  coreFeature: string;
  pitch: string;
  effects: string[];
  differentiation: string;
  customers: string;
  emphasis: string;
};

export type IdeaInput = {
  keyword: string;
  market: string;
  productGroup: string;
  direction: string;
};

export type ReportRow = [string, string];

export type ReportSection = {
  title: string;
  content: string;
};

export type AutomationCategory = "코드" | "설계" | "사양서" | "체크리스트";

export type AutomationTemplate = {
  id: string;
  title: string;
  category: AutomationCategory;
  description: string;
  prompt: string;
};

export type AutomationResult = {
  id: string;
  project_id: string;
  template_title: string;
  output: string;
  created_at: string;
};

export type AutomationInsertInput = {
  project_id: string;
  template_title: string;
  output: string;
};
