import type { Route } from "next";

export type PlatformMenuGroup = {
  title: string;
  items: Array<{ label: string; href: Route; description: string }>;
};

export type DataAssetRow = {
  name: string;
  type: "비정형(RAG)" | "정형(ML)";
  owned: "보유" | "부분 보유" | "미보유";
  planned: "고도화" | "구축 예정" | "유지";
  useCase: string;
};

export const platformMenuGroups: PlatformMenuGroup[] = [
  {
    title: "공통",
    items: [
      {
        label: "대시보드",
        href: "/",
        description: "RAG/ML 통합 운영 현황",
      },
      {
        label: "프로젝트 관리",
        href: "/projects",
        description: "제품개발 과제 단위 관리",
      },
      {
        label: "기술 구조 및 데이터 현황",
        href: "/tech-status",
        description: "정부과제 제출용 기술·데이터 현황",
      },
    ],
  },
  {
    title: "RAG 기반 AI Agent",
    items: [
      {
        label: "기술자료 검색",
        href: "/research",
        description: "사내 문서/사양서/시험자료 검색 및 근거 추출",
      },
      {
        label: "특허 분석",
        href: "/patents",
        description: "유사 특허 탐색, 위험도 판정, 회피설계 방향 제시",
      },
      {
        label: "문서 요약",
        href: "/research",
        description: "기술 문서 핵심 요약 및 질의응답 지원",
      },
      {
        label: "유사 사례 검색",
        href: "/research",
        description: "과거 개발 사례 기반 재활용 가능한 설계 지식 제공",
      },
      {
        label: "아이디어 생성",
        href: "/ideas",
        description: "기술 근거 기반 신제품 아이디어 생성",
      },
      {
        label: "보고서 생성",
        href: "/reports",
        description: "분석 결과를 사업·개발 보고서 형태로 자동 정리",
      },
    ],
  },
  {
    title: "ML 기반 예측/분석",
    items: [
      {
        label: "성능 예측",
        href: "/prediction",
        description: "설계 입력값 기반 성능 점수/위험도 예측",
      },
      {
        label: "고장 예측",
        href: "/prediction",
        description: "운영/시험 데이터 기반 고장 가능성 사전 탐지",
      },
      {
        label: "위험도 분석",
        href: "/prediction",
        description: "안전/품질 리스크 정량 분석",
      },
      {
        label: "코드/설계 자동화",
        href: "/automation",
        description: "코드·설계서·사양서·체크리스트 자동 생성",
      },
    ],
  },
];

export const ragDataAssets: DataAssetRow[] = [
  {
    name: "documents",
    type: "비정형(RAG)",
    owned: "보유",
    planned: "고도화",
    useCase: "기술자료 검색, 문서 요약, 유사 사례 검색",
  },
  {
    name: "patents",
    type: "비정형(RAG)",
    owned: "보유",
    planned: "고도화",
    useCase: "유사 특허 분석, 위험도 평가, 회피설계 제안",
  },
  {
    name: "manuals",
    type: "비정형(RAG)",
    owned: "부분 보유",
    planned: "구축 예정",
    useCase: "매뉴얼 기반 작업 가이드 및 QA",
  },
  {
    name: "reports",
    type: "비정형(RAG)",
    owned: "보유",
    planned: "고도화",
    useCase: "보고서 자동 생성 및 이력 관리",
  },
];

export const mlDataAssets: DataAssetRow[] = [
  {
    name: "sensor_logs",
    type: "정형(ML)",
    owned: "부분 보유",
    planned: "구축 예정",
    useCase: "고장 징후 탐지, 이상 상태 학습",
  },
  {
    name: "test_results",
    type: "정형(ML)",
    owned: "부분 보유",
    planned: "고도화",
    useCase: "성능 예측 모델 검증 및 튜닝",
  },
  {
    name: "predictions",
    type: "정형(ML)",
    owned: "보유",
    planned: "고도화",
    useCase: "성능 점수·위험도 이력 관리",
  },
  {
    name: "risk_scores",
    type: "정형(ML)",
    owned: "미보유",
    planned: "구축 예정",
    useCase: "프로젝트 단위 리스크 스코어링 및 모니터링",
  },
];
