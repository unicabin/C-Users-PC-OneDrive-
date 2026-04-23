import { withServiceContext } from "@/lib/data-provider";
import {
  runRuleBasedPrediction,
  type MlPredictionInput,
  type MlPredictionOutput,
} from "@/services/ml-prediction-engine";

export function getPredictionInitialForm(): MlPredictionInput {
  return withServiceContext(() => ({
    productName: "지게차 포크 카메라",
    voltage: "48V",
    sensorType: "카메라+근접센서",
    communication: "CAN",
    environment: "실외 고진동",
    mountPosition: "포크 전면",
  }));
}

export function predictPrototypePerformance(input: MlPredictionInput): MlPredictionOutput {
  return withServiceContext(() => runRuleBasedPrediction(input));
}
