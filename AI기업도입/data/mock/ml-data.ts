import type { DataHoldingRow, DataTableDefinition } from "@/types/data-catalog";

export const mlDataHoldings: DataHoldingRow[] = [
  {
    name: "sensor_logs",
    dataType: "정형 데이터",
    hasNow: "부분 보유",
    nextPlan: "구축 예정",
    featureUsage: "실시간 이상징후 탐지, 고장 예측 학습",
  },
  {
    name: "test_results",
    dataType: "정형 데이터",
    hasNow: "부분 보유",
    nextPlan: "고도화",
    featureUsage: "시험 성능 비교, 예측 모델 검증",
  },
  {
    name: "predictions",
    dataType: "정형 데이터",
    hasNow: "보유",
    nextPlan: "고도화",
    featureUsage: "성능 점수/안정성/권장사항 이력화",
  },
  {
    name: "risk_scores",
    dataType: "정형 데이터",
    hasNow: "미보유",
    nextPlan: "구축 예정",
    featureUsage: "제품군·프로젝트 단위 위험도 정량 관리",
  },
];

export const mlTableDefinitions: DataTableDefinition[] = [
  {
    table: "sensor_logs",
    domain: "ML",
    description: "장비 센서 로그 적재 데이터",
    relation: "projects(1) : sensor_logs(N)",
    fields: [
      { name: "id", type: "uuid", description: "로그 ID" },
      { name: "project_id", type: "uuid", description: "연결 프로젝트 ID" },
      { name: "sensor_type", type: "text", description: "센서 종류" },
      { name: "value", type: "numeric", description: "측정값" },
      { name: "recorded_at", type: "timestamptz", description: "측정 시각" },
    ],
  },
  {
    table: "test_results",
    domain: "ML",
    description: "시험 결과 레코드",
    relation: "projects(1) : test_results(N)",
    fields: [
      { name: "id", type: "uuid", description: "시험 ID" },
      { name: "project_id", type: "uuid", description: "연결 프로젝트 ID" },
      { name: "test_name", type: "text", description: "시험명" },
      { name: "score", type: "numeric", description: "평가 점수" },
      { name: "result", type: "text", description: "합격/불합격/보완" },
      { name: "created_at", type: "timestamptz", description: "등록 시각" },
    ],
  },
  {
    table: "predictions",
    domain: "ML",
    description: "성능 예측 결과 저장",
    relation: "projects(1) : predictions(N)",
    fields: [
      { name: "id", type: "uuid", description: "예측 결과 ID" },
      { name: "project_id", type: "uuid", description: "연결 프로젝트 ID" },
      { name: "score", type: "numeric", description: "성능 점수" },
      { name: "risk", type: "text", description: "위험도" },
      { name: "recommendation", type: "text", description: "개선 권장사항" },
      { name: "created_at", type: "timestamptz", description: "생성 시각" },
    ],
  },
  {
    table: "risk_scores",
    domain: "ML",
    description: "프로젝트/구성별 위험도 산출 결과",
    relation: "projects(1) : risk_scores(N)",
    fields: [
      { name: "id", type: "uuid", description: "위험도 ID" },
      { name: "project_id", type: "uuid", description: "연결 프로젝트 ID" },
      { name: "risk_type", type: "text", description: "위험 분류" },
      { name: "risk_score", type: "numeric", description: "위험 점수" },
      { name: "created_at", type: "timestamptz", description: "산출 시각" },
    ],
  },
];
