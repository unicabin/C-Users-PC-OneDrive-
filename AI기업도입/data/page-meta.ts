export type PageMeta = {
  label: string;
  description: string;
};

const PAGE_META: Record<string, PageMeta> = {
  "/": {
    label: "통합 관리자 대시보드",
    description: "진행 프로젝트, 특허 알림, AI 추천 아이디어를 한눈에 확인합니다.",
  },
  "/projects": {
    label: "프로젝트 관리",
    description: "제품개발 과제를 생성·조회하고 진행 상태를 관리합니다.",
  },
  "/research": {
    label: "기술자료 검색",
    description: "사내 문서, 논문, 사양서를 통합 검색하고 근거를 추출합니다.",
  },
  "/patents": {
    label: "특허 분석 자동화",
    description: "유사 특허를 탐색하고 청구항 충돌 가능성을 빠르게 검토합니다.",
  },
  "/prediction": {
    label: "성능 예측",
    description: "설계 입력값 기반으로 성능 점수와 위험도를 예측합니다.",
  },
  "/ideas": {
    label: "아이디어 생성",
    description: "시장 요구와 기술 제약을 반영한 신규 제품 컨셉을 제안합니다.",
  },
  "/automation": {
    label: "코드/설계 자동화",
    description: "코드 초안, 설계서, 사양서, 체크리스트를 자동 생성합니다.",
  },
  "/reports": {
    label: "보고서 출력",
    description: "의사결정에 필요한 분석 결과를 보고서 형태로 정리합니다.",
  },
  "/tech-status": {
    label: "기술 구조 및 데이터 현황",
    description: "플랫폼 RAG·ML 이중 구조와 단계별 데이터 현황을 확인합니다.",
  },
};

export function getPageMeta(pathname: string): PageMeta {
  if (pathname.startsWith("/projects/")) {
    return {
      label: "프로젝트 상세",
      description: "프로젝트에 연결된 아이디어, 특허, 예측, 기술자료를 확인합니다.",
    };
  }
  return (
    PAGE_META[pathname] ?? {
      label: "UNITOP AI",
      description: "RAG/ML 기반 스마트 제품개발 플랫폼",
    }
  );
}
