import type { AutomationTemplate } from "@/types/domain";

export const automationTemplates: AutomationTemplate[] = [
  {
    id: "tmpl-001",
    title: "모터 드라이버 초기화 코드",
    category: "코드",
    description: "CAN 통신 기반 모터 드라이버 초기화 코드를 C언어로 생성합니다.",
    prompt: "CAN 통신을 사용하는 모터 드라이버 초기화 코드를 C언어로 작성해줘. 오류 처리와 주요 레지스터 설명 주석을 포함해줘.",
  },
  {
    id: "tmpl-002",
    title: "I2C 센서 인터페이스 코드",
    category: "코드",
    description: "I2C 프로토콜 기반 센서 읽기/쓰기 함수를 생성합니다.",
    prompt: "I2C 프로토콜을 사용하는 센서 인터페이스 코드를 C언어로 작성해줘. 읽기/쓰기 함수와 타임아웃 처리를 포함해줘.",
  },
  {
    id: "tmpl-003",
    title: "센서 인터페이스 설계서",
    category: "설계",
    description: "센서 입력 인터페이스 설계 초안을 문서 형태로 생성합니다.",
    prompt: "제조업 제품에 사용되는 센서 인터페이스 설계서 초안을 작성해줘. 인터페이스 개요, 핀 배치, 신호 사양, 전기적 특성 섹션을 포함해줘.",
  },
  {
    id: "tmpl-004",
    title: "시스템 아키텍처 설계서",
    category: "설계",
    description: "임베디드 시스템 아키텍처 설계 초안을 생성합니다.",
    prompt: "임베디드 시스템 아키텍처 설계서 초안을 작성해줘. 하드웨어 블록 다이어그램 설명, 소프트웨어 레이어 구조, 주요 인터페이스 정의를 포함해줘.",
  },
  {
    id: "tmpl-005",
    title: "소프트웨어 요구사항 사양서 (SRS)",
    category: "사양서",
    description: "소프트웨어 요구사항 사양서(SRS) 초안을 자동 생성합니다.",
    prompt: "제조업 임베디드 소프트웨어 요구사항 사양서(SRS) 초안을 작성해줘. 목적, 범위, 기능 요구사항, 비기능 요구사항, 인터페이스 요구사항 섹션을 포함해줘.",
  },
  {
    id: "tmpl-006",
    title: "하드웨어 요구사항 사양서 (HRS)",
    category: "사양서",
    description: "하드웨어 요구사항 사양서(HRS) 초안을 생성합니다.",
    prompt: "제조업 제품의 하드웨어 요구사항 사양서(HRS) 초안을 작성해줘. 전원 요구사항, 환경 조건, 기계적 사양, 신뢰성 요구사항을 포함해줘.",
  },
  {
    id: "tmpl-007",
    title: "임베디드 C 코드 리뷰 체크리스트",
    category: "체크리스트",
    description: "임베디드 C 코드 품질 검토를 위한 체크리스트를 생성합니다.",
    prompt: "임베디드 C 코드 리뷰 체크리스트를 작성해줘. 메모리 관리, 인터럽트 처리, 포인터 사용, 자원 초기화, MISRA C 준수 항목을 포함해줘.",
  },
  {
    id: "tmpl-008",
    title: "설계 검토 (DR) 체크리스트",
    category: "체크리스트",
    description: "설계 검토 회의용 체크리스트를 생성합니다.",
    prompt: "제조업 제품 설계 검토(Design Review) 체크리스트를 작성해줘. 기능 완성도, 안전성, 신뢰성, 제조 가능성, 비용 최적화 항목을 포함해줘.",
  },
];

export const automationResultSeeds = [
  {
    template_title: "모터 드라이버 초기화 코드",
    output: `// CAN 기반 모터 드라이버 초기화
#include "can_driver.h"
#include "motor_ctrl.h"

#define MOTOR_NODE_ID   0x01
#define CAN_TIMEOUT_MS  100

static CanHandle_t hcan;

MotorStatus_t Motor_Init(void) {
    CAN_Config_t cfg = {
        .bitrate    = CAN_500KBPS,
        .mode       = CAN_MODE_NORMAL,
        .node_id    = MOTOR_NODE_ID,
    };

    if (CAN_Init(&hcan, &cfg) != CAN_OK) {
        return MOTOR_ERR_INIT;
    }

    // NMT: 운영 상태 전환
    uint8_t nmt_cmd[] = {0x01, MOTOR_NODE_ID};
    if (CAN_Send(&hcan, 0x000, nmt_cmd, 2, CAN_TIMEOUT_MS) != CAN_OK) {
        return MOTOR_ERR_COMM;
    }

    return MOTOR_OK;
}`,
  },
];
