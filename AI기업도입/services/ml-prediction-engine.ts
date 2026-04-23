export type MlPredictionInput = {
  productName: string;
  voltage: string;
  sensorType: string;
  communication: string;
  environment: string;
  mountPosition: string;
};

export type MlPredictionOutput = {
  score: number;
  riskLevel: "낮음" | "중간" | "높음";
  recommendations: string[];
  modelHint: string;
};

export function runRuleBasedPrediction(input: MlPredictionInput): MlPredictionOutput {
  let score = 78;
  const recommendations: string[] = [];

  if (input.voltage === "48V") score += 5;
  if (input.voltage === "24V") score += 1;
  if (!["24V", "48V"].includes(input.voltage)) score -= 4;

  if (input.sensorType.includes("카메라")) score += 2;
  if (input.sensorType.includes("근접")) score += 3;
  if (input.sensorType.includes("지문")) score -= 1;

  if (input.communication.toUpperCase().includes("CAN")) score += 4;
  else if (input.communication.toUpperCase().includes("RS485")) score += 1;
  else score -= 2;

  if (input.environment.includes("고진동")) {
    score -= 6;
    recommendations.push("진동 환경 대응 브래킷 및 체결 보강 적용");
  }
  if (input.environment.includes("실외")) {
    score -= 3;
    recommendations.push("방수/방진 등급 상향 및 커넥터 실링 적용");
  }
  if (input.environment.includes("분진")) {
    score -= 2;
    recommendations.push("센서 표면 오염 대응 청소/보정 로직 추가");
  }

  if (input.mountPosition.includes("포크")) {
    score -= 3;
    recommendations.push("포크 장착부 충격완화 구조 설계");
  } else if (input.mountPosition.includes("실내")) {
    score += 2;
  }

  if (recommendations.length === 0) {
    recommendations.push("현재 조건 기준 표준 설계 유지 가능");
    recommendations.push("양산 전 파일럿 환경에서 통신 안정성 재검증 권장");
  }

  const boundedScore = Math.max(60, Math.min(96, score));
  const riskLevel =
    boundedScore >= 85 ? "낮음" : boundedScore >= 72 ? "중간" : "높음";

  return {
    score: boundedScore,
    riskLevel,
    recommendations: recommendations.slice(0, 3),
    modelHint:
      "현재는 Rule-Based + Mock Prediction 엔진이며, 추후 ML 모델 추론 API로 교체 가능",
  };
}
