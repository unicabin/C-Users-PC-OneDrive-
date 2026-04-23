import type {
  RecommendedResearchDocument,
  ResearchDocument,
  SummaryCard,
} from "@/types/domain";

export const researchQuickKeywords = [
  "포크 카메라",
  "48V 전동지게차 에어컨",
  "지문인식 시동장치",
  "소비전력",
  "시험 성적서",
  "도면 설명자료",
];

export const researchNaturalQuestions = [
  "포크 카메라 관련 기존 설계자료 보여줘",
  "48V 전동지게차 에어컨 소비전력 자료 찾아줘",
  "지문인식 시동장치 관련 시험자료 찾아줘",
];

export const researchRecentSearchSeeds = [
  "포크 카메라 시야각 설계자료",
  "전동지게차 HVAC 전력소모 측정값",
  "지문인식 시동 ECU 시험성적서",
  "배터리 냉각덕트 도면 설명자료",
];

export const researchDocuments: ResearchDocument[] = [
  {
    id: "DOC-2418",
    title: "포크 카메라 모듈 장착 브래킷 설계 검토서",
    project: "지게차 시야 보조 시스템",
    type: "PDF",
    importance: "상",
    summary: "포크 카메라 장착 위치별 시야각, 브래킷 체결 구조, 방진 대책을 비교한 설계 검토 문서입니다.",
    tags: ["포크 카메라", "설계검토", "브래킷"],
    updatedAt: "2026.04.09",
    owner: "선행설계팀",
    pages: "18p",
    score: 92,
  },
  {
    id: "SPEC-1832",
    title: "48V 전동지게차 에어컨 소비전력 측정 결과",
    project: "전동지게차 냉방성능 개선",
    type: "XLSX",
    importance: "최상",
    summary: "실차 운전 조건별 에어컨 소비전력, 배터리 부하율, 압축기 동작 패턴을 정리한 시험 데이터 시트입니다.",
    tags: ["48V", "에어컨", "소비전력"],
    updatedAt: "2026.03.28",
    owner: "시험평가팀",
    pages: "12 Sheet",
    score: 98,
  },
  {
    id: "TEST-0974",
    title: "지문인식 시동장치 환경 신뢰성 시험 성적서",
    project: "무인증 인증 시동 시스템",
    type: "DOCX",
    importance: "상",
    summary: "온습도, 진동, ESD 조건에서의 지문인식 시동장치 오작동 여부와 재인식률을 기록한 시험 보고서입니다.",
    tags: ["지문인식", "시험성적서", "시동장치"],
    updatedAt: "2026.04.02",
    owner: "품질보증팀",
    pages: "26p",
    score: 95,
  },
  {
    id: "DRAW-3310",
    title: "실내기 덕트 어셈블리 도면 설명자료",
    project: "캐빈 에어컨 패키지",
    type: "PDF",
    importance: "중",
    summary: "덕트 조립 방향, 체결 포인트, 서비스 접근성 이슈를 설명하는 도면 부속 문서입니다.",
    tags: ["도면설명", "에어덕트", "조립성"],
    updatedAt: "2026.03.19",
    owner: "기구설계팀",
    pages: "9p",
    score: 84,
  },
  {
    id: "HIST-2207",
    title: "기존 전장품 개발 이슈 회고 자료",
    project: "통합 시동 제어기",
    type: "PPTX",
    importance: "중",
    summary: "과거 개발 과정에서 발생한 인증 실패 요인, 수정 이력, 양산 이전 개선 항목을 정리한 회고 자료입니다.",
    tags: ["과거개발자료", "전장품", "개선이력"],
    updatedAt: "2026.01.14",
    owner: "플랫폼 PMO",
    pages: "31p",
    score: 76,
  },
];

export const researchRecommendedDocuments: RecommendedResearchDocument[] = [
  { title: "포크 카메라 영상처리 ECU 인터페이스 사양서", type: "DOCX", relation: "포크 카메라 설계자료와 동일 프로젝트군" },
  { title: "48V 배터리 부하 분산 시험 로그", type: "XLSX", relation: "에어컨 소비전력 분석에 함께 참고되는 데이터" },
  { title: "지문인식 모듈 방수 성능 검증 리포트", type: "PDF", relation: "시동장치 시험자료와 연계 검토 권장" },
];

export const researchSummaryCards: SummaryCard[] = [
  { title: "검색 요약", description: "총 128건 중 현재 질의와 높은 관련성을 가진 문서 5건을 우선 정렬했습니다." },
  { title: "핵심 인사이트", description: "48V 에어컨 자료는 소비전력 측정표와 배터리 부하 로그를 함께 볼 때 해석 정확도가 높습니다." },
  { title: "주의 포인트", description: "지문인식 시동장치 자료는 최신 시험 성적서와 과거 개발 이슈 회고 자료를 함께 검토하는 것이 좋습니다." },
];
