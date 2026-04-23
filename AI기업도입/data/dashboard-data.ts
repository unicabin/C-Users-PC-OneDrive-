import type { Route } from "next";

import {
  AlertTriangle,
  Beaker,
  Code2,
  FileBarChart2,
  Lightbulb,
  ScanSearch,
  Sparkles,
} from "lucide-react";

import type {
  PatentAlert,
  PredictionSummary,
  ProjectSummary,
  QuickAction,
  RecentDocumentSummary,
  WorkflowCard,
} from "@/types/domain";


export const dashboardRecentProjects: ProjectSummary[] = [
  { id: "PJT-1001", name: "고효율 산업용 모터 하우징", stage: "설계 검토", owner: "제품기획팀 A", updatedAt: "2026.04.12", progress: 72 },
  { id: "PJT-1002", name: "스마트 센서 모듈 경량화", stage: "성능 예측", owner: "R&D Lab 2", updatedAt: "2026.04.11", progress: 58 },
  { id: "PJT-1003", name: "차세대 공정 제어 보드", stage: "특허 분석", owner: "플랫폼개발팀", updatedAt: "2026.04.10", progress: 83 },
];

export const dashboardRecentDocuments: RecentDocumentSummary[] = [
  { title: "알루미늄 합금 방열구조 설계 가이드", category: "기술문서", tags: ["방열", "경량화", "하우징"], savedAt: "10분 전" },
  { title: "고속 회전체 진동 해석 논문", category: "연구논문", tags: ["회전축", "예측모델"], savedAt: "35분 전" },
  { title: "센서 캘리브레이션 공정 사양서", category: "사내표준", tags: ["센서", "공정"], savedAt: "1시간 전" },
];

export const dashboardPatentAlerts: PatentAlert[] = [
  { name: "KR-10-2026-001245", risk: "높음", issue: "열 분산 핀 구조 유사도 87%", action: "회피 설계 검토 필요" },
  { name: "US-18/221,401", risk: "중간", issue: "센서 장착 브래킷 청구항 중복 가능성", action: "청구항 매핑 업데이트" },
];

export const dashboardIdeaRecommendations = [
  "저소음 냉각 채널 구조를 적용한 모터 하우징 신모델",
  "자체 진단 알고리즘이 내장된 산업용 센서 패키지",
  "부품 공용화를 고려한 모듈형 제어보드 설계안",
];

export const dashboardPredictionSummaries: PredictionSummary[] = [
  { label: "내열성", value: "기준 대비 +14%", status: "안정" },
  { label: "진동 내구성", value: "기준 대비 +8%", status: "개선" },
  { label: "전력 효율", value: "예상 93.2%", status: "양호" },
];

export const dashboardQuickActions: QuickAction[] = [
  { label: "기술자료 즉시 검색", icon: ScanSearch, href: "/research" as Route },
  { label: "특허 리스크 점검", icon: AlertTriangle, href: "/patents" as Route },
  { label: "성능 예측 실행", icon: Beaker, href: "/prediction" as Route },
  { label: "신제품 아이디어 생성", icon: Lightbulb, href: "/ideas" as Route },
  { label: "코드/설계 자동화", icon: Code2, href: "/automation" as Route },
  { label: "보고서 출력", icon: FileBarChart2, href: "/reports" as Route },
];

export const dashboardWorkflowCards: WorkflowCard[] = [
  { title: "기술자료 검색", description: "사내 문서, 논문, 규격, 시험성적서를 통합 검색합니다.", icon: ScanSearch, href: "/research" as Route },
  { title: "특허 분석 자동화", description: "유사 특허 분류와 청구항 충돌 가능성을 빠르게 검토합니다.", icon: AlertTriangle, href: "/patents" as Route },
  { title: "성능 예측", description: "시제품 성능을 가상으로 검증해 시행착오를 줄입니다.", icon: Beaker, href: "/prediction" as Route },
  { title: "코드/설계 자동화", description: "설계 반복 업무와 코드 초안을 자동 생성합니다.", icon: Sparkles, href: "/automation" as Route },
  { title: "아이디어 생성", description: "시장 요구와 기술 제약을 반영한 신규 컨셉을 제안합니다.", icon: Lightbulb, href: "/ideas" as Route },
  { title: "보고서 출력", description: "의사결정에 필요한 결과를 보고서 형태로 정리합니다.", icon: FileBarChart2, href: "/reports" as Route },
];
