import type { PatentAnalysisScenario } from "@/types/domain";

export const patentKeywords = [
  "지문인식 시동장치",
  "지게차 포크 카메라",
  "양방향 근접경보장치",
  "바닥경고등 연동 안전장치",
];

export const patentScenarios: Record<string, PatentAnalysisScenario> = {
  "지문인식 시동장치": {
    keyword: "지문인식 시동장치",
    patents: [
      {
        id: "KR-10-2025-118204",
        title: "작업차량용 생체인증 기반 시동 제어 장치",
        owner: "A사 모빌리티",
        similarity: 91,
        risk: "높음",
        summary: "지문인식 센서와 ECU 인증 로직을 결합해 시동 허용 여부를 제어하는 구조를 포함합니다.",
        claim: "생체 정보 인증부, 제어부, 시동 차단 로직이 결합된 차량 시동 시스템",
      },
      {
        id: "KR-10-2024-442019",
        title: "차량용 다단계 운전자 인증 모듈",
        owner: "Secure Drive Tech",
        similarity: 84,
        risk: "중간",
        summary: "지문 인증 후 추가 권한 검증을 거쳐 차량 기능을 제한적으로 허용하는 기술입니다.",
        claim: "생체인증 이후 권한 테이블에 따라 시동 및 속도 제한을 제어하는 방법",
      },
    ],
    avoidanceIdeas: [
      { title: "인증 흐름 분리형 구조", detail: "지문인식 모듈과 시동 ECU를 직접 결합하지 않고 게이트웨이 모듈을 두어 핵심 청구항 결합 구조를 피합니다." },
      { title: "권한 정책 서버 연동형", detail: "차량 내부 단독 인증이 아닌 정책 서버와 연계한 권한 판정 구조로 차별화를 확보합니다." },
    ],
    competitorTrends: [
      { company: "A사 모빌리티", focus: "생체인증 시동 제어", volume: "최근 2년 6건", status: "확대" },
      { company: "Secure Drive Tech", focus: "운전자 권한 인증", volume: "최근 2년 3건", status: "유지" },
    ],
    insights: [
      { title: "핵심 위험", detail: "인증 로직과 시동 제어부를 직접 결합한 구조가 가장 민감합니다.", tone: "danger" },
      { title: "검토 필요", detail: "센서 위치와 인증 흐름을 분리하면 위험도를 낮출 수 있습니다.", tone: "warning" },
      { title: "권장 방향", detail: "게이트웨이 기반 모듈 분리형 아키텍처를 우선 검토하는 것이 적절합니다.", tone: "success" },
    ],
  },
  "지게차 포크 카메라": {
    keyword: "지게차 포크 카메라",
    patents: [
      {
        id: "US-18/553,901",
        title: "Fork Vision Camera for Industrial Truck",
        owner: "LiftEye Inc.",
        similarity: 88,
        risk: "중간",
        summary: "포크 선단 카메라와 영상 표시 유닛의 장착 구조, 보호 하우징, 배선 경로를 청구합니다.",
        claim: "포크 조립체 상단 장착 카메라와 충격 보호 하우징의 조합",
      },
      {
        id: "JP-2025-219944",
        title: "포크 적재시야 보조 카메라 장치",
        owner: "Vision Fork Co.",
        similarity: 81,
        risk: "중간",
        summary: "적재 높이에 따라 시야각을 자동 조절하는 카메라 브래킷 구조를 설명합니다.",
        claim: "포크 승강 위치에 연동되는 가변 시야각 카메라 지지 장치",
      },
    ],
    avoidanceIdeas: [
      { title: "측면 슬라이드 체결 구조", detail: "상단 보호커버 일체형이 아닌 측면 슬라이드 체결형 브래킷으로 구조적 차별화를 확보합니다." },
      { title: "카메라-표시장치 분리형 설계", detail: "영상 처리 유닛을 별도 컨트롤러에 배치해 결합 청구항 회피 가능성을 높입니다." },
    ],
    competitorTrends: [
      { company: "LiftEye Inc.", focus: "포크 카메라 및 시야보조", volume: "최근 2년 4건", status: "유지" },
      { company: "Vision Fork Co.", focus: "가변 시야 카메라", volume: "최근 2년 5건", status: "확대" },
    ],
    insights: [
      { title: "핵심 위험", detail: "카메라 장착 위치와 보호 하우징 구조가 주요 비교 포인트입니다.", tone: "warning" },
      { title: "검토 필요", detail: "배선 경로와 충격 보호 설계가 유사해지지 않도록 별도 검토가 필요합니다.", tone: "warning" },
      { title: "권장 방향", detail: "브래킷 체결 방식과 시야 보정 로직을 차별화하는 방향이 유효합니다.", tone: "success" },
    ],
  },
  "양방향 근접경보장치": {
    keyword: "양방향 근접경보장치",
    patents: [
      {
        id: "EP-3 994 118",
        title: "Bidirectional Worker Proximity Warning System",
        owner: "SafeMotion GmbH",
        similarity: 77,
        risk: "중간",
        summary: "차량과 작업자 양방향 태그를 이용한 접근 감지 및 경보 출력 방식을 설명합니다.",
        claim: "양측 송수신 태그 기반 거리 산출 및 위험 구간 경보 처리 알고리즘",
      },
      {
        id: "KR-10-2026-009901",
        title: "작업자 접근 다중센서 경보 시스템",
        owner: "산업안전솔루션",
        similarity: 72,
        risk: "낮음",
        summary: "초음파와 BLE를 결합해 경보 신뢰성을 높이는 산업차량 안전 시스템입니다.",
        claim: "다중 센서를 활용한 거리 보정 및 경보 우선순위 결정 방법",
      },
    ],
    avoidanceIdeas: [
      { title: "다중조건 위험 판정", detail: "거리 단일 기준이 아닌 속도, 방향, 정지시간 조합식으로 경보 기준을 차별화합니다." },
      { title: "센서 융합형 구조", detail: "BLE 단독이 아닌 UWB 또는 초음파 융합 방식을 써 핵심 청구항과의 거리를 둡니다." },
    ],
    competitorTrends: [
      { company: "SafeMotion GmbH", focus: "근접 경보 및 안전 알고리즘", volume: "최근 2년 7건", status: "확대" },
      { company: "산업안전솔루션", focus: "다중센서 경보 시스템", volume: "최근 2년 2건", status: "유지" },
    ],
    insights: [
      { title: "핵심 위험", detail: "양방향 태그 기반 거리 산출 알고리즘이 주요 비교 대상입니다.", tone: "warning" },
      { title: "검토 필요", detail: "경보 기준을 단순 거리 기반으로 두면 기존 특허와 겹칠 수 있습니다.", tone: "warning" },
      { title: "권장 방향", detail: "센서 융합 및 위험도 점수화 로직으로 차별화하는 것이 적절합니다.", tone: "success" },
    ],
  },
};
