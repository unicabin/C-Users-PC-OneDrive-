import type { IdeaInput, IdeaResult } from "@/types/domain";

export const ideaMarkets = ["물류장비", "산업안전", "스마트팩토리", "건설장비"];
export const ideaProductGroups = ["안전장치", "전장품", "시야보조장치", "에너지관리"];
export const ideaDirections = ["안전성 강화", "원가절감", "편의성 향상", "자동화"];

export const ideaInitialInput: IdeaInput = {
  keyword: "지게차 안전",
  market: ideaMarkets[0],
  productGroup: ideaProductGroups[0],
  direction: ideaDirections[0],
};

export const ideaSeeds: IdeaResult[] = [
  {
    title: "작업자 접근 예측형 포크 안전 어시스트",
    coreFeature: "포크 시야 카메라와 근접 경보를 연동해 위험 접근을 선제적으로 감지합니다.",
    pitch: "포크 시야 개선 카메라와 근접 경보를 결합해 작업자 접근을 미리 예측하고 경고를 다단계로 출력하는 안전 패키지입니다.",
    effects: ["사고 예방률 향상", "작업자 심리적 안정감 확보", "기존 카메라 시스템과 연동 용이"],
    differentiation: "거리, 방향, 작업속도를 동시에 반영하는 예측형 경보 로직",
    customers: "물류센터, 항만 하역장, 대형 제조 공장",
    emphasis: "우선 추천",
  },
  {
    title: "배터리 효율 연동형 전동지게차 에어컨 제어 모듈",
    coreFeature: "배터리 잔량과 작업 스케줄에 따라 냉방 출력을 자동 조정합니다.",
    pitch: "배터리 잔량과 작업 스케줄을 고려해 냉방 세기를 자동 조절하는 전력 최적화형 공조 제어 모듈입니다.",
    effects: ["배터리 사용시간 연장", "피크 부하 완화", "운전자 체감 쾌적성 유지"],
    differentiation: "작업 조건과 잔량을 함께 보는 에너지 운영 알고리즘",
    customers: "전동지게차 운영사, 냉장창고, 장시간 운행 현장",
    emphasis: "적합",
  },
  {
    title: "지문인식 기반 작업자 맞춤 시동/권한 시스템",
    coreFeature: "작업자 권한 등급에 따라 시동과 속도 제한 정책을 동적으로 적용합니다.",
    pitch: "작업자 권한 등급에 따라 시동 허용, 속도 제한, 장비 접근 이력을 함께 관리하는 스마트 인증 시스템입니다.",
    effects: ["무단 사용 방지", "운행 데이터 추적성 확보", "교육 수준 기반 권한 제어"],
    differentiation: "인증과 운행 제한 정책을 통합한 관리자형 운영 구조",
    customers: "대형 물류창고, 공장 내 운반장비 운영 부서, 렌탈 장비 업체",
    emphasis: "확장성 높음",
  },
];
