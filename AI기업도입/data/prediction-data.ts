import type { PredictionInput } from "@/types/domain";

export const predictionInitialForm: PredictionInput = {
  productName: "지문인식 시동장치",
  equipmentType: "전동지게차",
  voltage: "48V",
  sensorType: "지문 + 근접센서",
  communication: "CAN",
  environment: "실외/고진동",
  mountPosition: "운전석 대시패널",
  targetFunction: "작업자 인증 후 시동 허용",
};

export const predictionProductTemplates = [
  "지문인식 시동장치",
  "포크 카메라",
  "전동지게차 에어컨",
  "양방향 근접경보장치",
];

export const predictionRecommendedParts = [
  "IP67 등급 생체인증 센서 모듈",
  "진동 흡수 브래킷",
  "CAN 통신 절연 트랜시버",
  "산업용 온도 확장형 MCU",
];
