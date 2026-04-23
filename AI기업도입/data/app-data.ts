import type { NavigationItem, PageContent, ModuleStatus } from "@/types/domain";

export const navigationItems: NavigationItem[] = [
  { label: "대시보드", href: "/" },
  { label: "프로젝트 관리", href: "/projects" },
  { label: "기술자료 검색", href: "/research" },
  { label: "특허 분석", href: "/patents" },
  { label: "성능 예측", href: "/prediction" },
  { label: "코드/설계 자동화", href: "/automation" },
  { label: "아이디어 생성", href: "/ideas" },
  { label: "보고서 출력", href: "/reports" },
];

export const pageContent: Record<string, PageContent> = {
  projects: {
    title: "프로젝트 관리",
    description: "제품개발 프로젝트 현황과 단계별 진행 상태를 관리합니다.",
  },
  research: {
    title: "기술자료 검색",
    description: "기술문서, 과거 개발자료, 사양서, 시험자료를 통합 검색합니다.",
  },
  patents: {
    title: "특허 분석",
    description: "유사 특허와 핵심 청구항을 분석해 위험도 및 회피 방향을 제시합니다.",
  },
  prediction: {
    title: "성능 예측",
    description: "설계 입력값 기반으로 예상 성능 점수와 위험요인을 예측합니다.",
  },
  automation: {
    title: "코드/설계 자동화",
    description: "설계 산출물과 코드 초안을 자동 생성·관리합니다.",
  },
  ideas: {
    title: "아이디어 생성",
    description: "시장 요구와 기술 근거를 반영해 신제품 아이디어를 생성합니다.",
  },
  reports: {
    title: "보고서 출력",
    description: "분석 결과를 관리자·사업화 보고서 형식으로 정리합니다.",
  },
};

export const defaultModuleStatuses: ModuleStatus[] = [
  { name: "데이터 입력", status: "준비 완료" },
  { name: "AI 분석 엔진", status: "동작 중" },
  { name: "결과 보고", status: "자동 생성 가능" },
];
