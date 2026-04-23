import type { ProjectFormInput, ProjectRecord } from "@/types/domain";

export const projectStorageKey = "unitop-projects";

export const projectSeedData: ProjectRecord[] = [
  {
    id: "pjt-001",
    code: "UT-24001",
    name: "지문인식 시동장치 고도화",
    description:
      "작업자 인증 정확도와 현장 내구성을 개선하는 차세대 시동장치 개발 프로젝트입니다.",
    productGroup: "안전장치",
    owner: "선행개발팀",
    status: "분석중",
    priority: "긴급",
    progress: 58,
    createdAt: "2026-03-10",
    updatedAt: "2026-04-12",
    targetDate: "2026-06-30",
    tags: ["지문인식", "시동장치", "보안"],
  },
  {
    id: "pjt-002",
    code: "UT-24002",
    name: "포크 카메라 시야 개선 패키지",
    description:
      "적재 높이와 사각지대를 줄이기 위한 포크 카메라 및 표시 모듈 패키지 설계 과제입니다.",
    productGroup: "시야보조장치",
    owner: "기구설계팀",
    status: "개발중",
    priority: "높음",
    progress: 76,
    createdAt: "2026-02-18",
    updatedAt: "2026-04-11",
    targetDate: "2026-05-20",
    tags: ["포크 카메라", "시야 개선", "안전"],
  },
  {
    id: "pjt-003",
    code: "UT-24003",
    name: "전동지게차 에어컨 전력 최적화",
    description:
      "48V 전동지게차의 냉방 성능 유지와 소비전력 절감을 동시에 달성하기 위한 제어 로직 검토입니다.",
    productGroup: "에너지관리",
    owner: "시험평가팀",
    status: "기획중",
    priority: "중간",
    progress: 24,
    createdAt: "2026-04-01",
    updatedAt: "2026-04-13",
    targetDate: "2026-07-15",
    tags: ["48V", "에어컨", "효율"],
  },
];

export const emptyProjectForm: ProjectFormInput = {
  name: "",
  description: "",
  productGroup: "안전장치",
  owner: "",
  status: "기획중",
  priority: "중간",
  targetDate: "",
  tags: "",
};
