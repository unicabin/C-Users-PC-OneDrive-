import type { DataHoldingRow, DataTableDefinition } from "@/types/data-catalog";

export const ragDataHoldings: DataHoldingRow[] = [
  {
    name: "documents",
    dataType: "비정형 데이터",
    hasNow: "보유",
    nextPlan: "고도화",
    featureUsage: "기술자료 검색, 문서 요약, 유사 사례 검색",
  },
  {
    name: "patents",
    dataType: "비정형 데이터",
    hasNow: "보유",
    nextPlan: "고도화",
    featureUsage: "특허 유사도 분석, 위험도 평가, 회피설계 도출",
  },
  {
    name: "manuals",
    dataType: "비정형 데이터",
    hasNow: "부분 보유",
    nextPlan: "구축 예정",
    featureUsage: "현장 매뉴얼 질의응답, 점검 가이드 자동화",
  },
  {
    name: "reports",
    dataType: "비정형 데이터",
    hasNow: "보유",
    nextPlan: "고도화",
    featureUsage: "정부과제 제출용 보고서 자동 생성",
  },
];

export const ragTableDefinitions: DataTableDefinition[] = [
  {
    table: "documents",
    domain: "RAG",
    description: "사내 기술문서 및 시험자료 원문 저장",
    relation: "projects(1) : documents(N)",
    fields: [
      { name: "id", type: "uuid", description: "문서 식별자" },
      { name: "project_id", type: "uuid", description: "연결 프로젝트 ID" },
      { name: "user_id", type: "uuid", description: "업로드 사용자 ID" },
      { name: "title", type: "text", description: "문서 제목" },
      { name: "content", type: "text", description: "원문 또는 추출 텍스트" },
      { name: "category", type: "text", description: "문서 분류" },
      { name: "file_type", type: "text", description: "PDF/DOCX/XLSX 등" },
      { name: "created_at", type: "timestamptz", description: "생성 시각" },
    ],
  },
  {
    table: "patents",
    domain: "RAG",
    description: "특허 분석 결과 및 위험도 기록",
    relation: "projects(1) : patents(N)",
    fields: [
      { name: "id", type: "uuid", description: "특허 분석 ID" },
      { name: "project_id", type: "uuid", description: "연결 프로젝트 ID" },
      { name: "user_id", type: "uuid", description: "분석 수행 사용자 ID" },
      { name: "title", type: "text", description: "특허명/출원명" },
      { name: "summary", type: "text", description: "핵심 요약" },
      { name: "risk_level", type: "text", description: "낮음/중간/높음" },
      { name: "similarity", type: "numeric", description: "유사도(%)" },
      { name: "created_at", type: "timestamptz", description: "생성 시각" },
    ],
  },
  {
    table: "manuals",
    domain: "RAG",
    description: "현장 매뉴얼/가이드 문서 관리",
    relation: "projects(1) : manuals(N)",
    fields: [
      { name: "id", type: "uuid", description: "매뉴얼 ID" },
      { name: "project_id", type: "uuid", description: "연결 프로젝트 ID" },
      { name: "title", type: "text", description: "문서 제목" },
      { name: "version", type: "text", description: "버전 정보" },
      { name: "content", type: "text", description: "본문 텍스트" },
      { name: "created_at", type: "timestamptz", description: "생성 시각" },
    ],
  },
  {
    table: "reports",
    domain: "RAG",
    description: "자동 생성 보고서 결과 저장",
    relation: "projects(1) : reports(N)",
    fields: [
      { name: "id", type: "uuid", description: "보고서 ID" },
      { name: "project_id", type: "uuid", description: "연결 프로젝트 ID" },
      { name: "title", type: "text", description: "보고서 제목" },
      { name: "report_type", type: "text", description: "보고서 유형" },
      { name: "content", type: "text", description: "본문 내용" },
      { name: "created_at", type: "timestamptz", description: "생성 시각" },
    ],
  },
];
