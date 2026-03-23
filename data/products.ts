export type Product = {
  slug: "adas" | "hvac" | "cabin" | "safety";
  title: string;
  category: string;
  heroLabel: string;
  heroSubcopy: string;
  shortDesc: string;
  longDesc: string;
  intro: string;
  features: {
    title: string;
    description: string;
  }[];
  effects: string[];
  cardHighlights: string[];
  accent: string;
};

export const products: Product[] = [
  {
    slug: "adas",
    title: "ADAS",
    category: "Advanced Safety Assistance",
    heroLabel: "현장 안전 고도화",
    heroSubcopy:
      "UNITOP ADAS는 산업 차량 운행 중 발생하는 충돌 위험과 사각지대 문제를 줄이기 위해, 감지와 경고 체계를 현장 중심으로 구성한 핵심 안전 제품군입니다.",
    shortDesc:
      "지게차 운행 중 보행자, 장애물, 사각지대 위험을 빠르게 인지하고 경고하는 UNITOP의 대표 안전 제품군입니다.",
    longDesc:
      "UNITOP ADAS는 카메라, 센서, 경고 인터페이스를 결합해 작업 현장의 충돌 위험을 낮추는 안전 보조 솔루션입니다. ADAS는 핵심 제품군이지만, 홈페이지 전체에서는 UNITOP 브랜드 안의 통합 안전 역량을 보여주는 한 축으로 자리합니다.",
    intro:
      "작업 현장의 실제 동선과 지게차 운행 환경을 기준으로 설계되어, 운전자에게는 즉시 경고를 제공하고 관리자에게는 더 높은 안전 통제력을 확보하게 하는 솔루션입니다.",
    features: [
      {
        title: "Risk Detection",
        description:
          "전방, 후방, 측면의 위험 요소를 인지할 수 있도록 다중 센서와 감지 로직을 조합해 사각지대 대응력을 높입니다."
      },
      {
        title: "Real-time Alert",
        description:
          "운전자 시야와 반응 속도를 고려한 경고 인터페이스로 위험 상황을 직관적으로 전달해 즉각적인 대응을 돕습니다."
      },
      {
        title: "Monitoring Link",
        description:
          "차량 이벤트와 상태 기록을 축적해 향후 관제 시스템, 안전 데이터 운영, 스마트 관리 체계로 확장할 수 있습니다."
      }
    ],
    effects: [
      "보행자 및 장애물 충돌 위험 감소",
      "운전자 즉시 대응력 향상으로 사고 예방 지원",
      "안전 이벤트 데이터 축적을 통한 운영 관리 고도화"
    ],
    cardHighlights: ["Collision Alert", "Camera Integration", "Fleet Ready"],
    accent: "from-blue-600/20 via-sky-500/10 to-transparent"
  },
  {
    slug: "hvac",
    title: "HVAC",
    category: "Thermal Control Solution",
    heroLabel: "작업 환경 최적화",
    heroSubcopy:
      "UNITOP HVAC는 지게차 및 산업 차량 내부의 온도와 공기 흐름을 안정적으로 제어해, 계절과 작업 조건에 흔들리지 않는 운전 환경을 만드는 공조 제품군입니다.",
    shortDesc:
      "지게차 및 산업 차량 내부 환경을 안정적으로 제어해 작업 지속성과 운전자 쾌적성을 높이는 공조 솔루션입니다.",
    longDesc:
      "UNITOP HVAC는 산업 차량의 실제 운행 환경을 기준으로 냉방, 난방, 송풍, 제어 효율을 균형 있게 설계한 공조 솔루션입니다. 다양한 차종과 캐빈 구조에 대응할 수 있도록 패키징과 정비 접근성까지 함께 고려합니다.",
    intro:
      "단순한 냉난방 장치가 아니라, 혹서기와 혹한기에도 작업 지속성과 운전자 컨디션을 안정적으로 유지하기 위한 실무형 HVAC 패키지입니다.",
    features: [
      {
        title: "Climate Package",
        description:
          "지게차 및 산업 차량 구조에 맞춰 냉방, 난방, 송풍 구성을 최적화한 맞춤형 공조 패키지를 제공합니다."
      },
      {
        title: "Thermal Stability",
        description:
          "혹서기와 혹한기에도 안정적인 공조 성능을 유지할 수 있도록 실사용 환경 중심으로 설계했습니다."
      },
      {
        title: "Service Access",
        description:
          "배관, 송풍, 제어부 접근성을 높여 정비성과 유지관리 효율을 함께 고려한 구조를 적용했습니다."
      }
    ],
    effects: [
      "운전자 피로도와 집중력 저하 감소",
      "계절 변화에 관계없이 작업 지속성 확보",
      "유지보수 시간 단축과 운영 효율 향상"
    ],
    cardHighlights: ["Climate Package", "Vehicle Fit", "Serviceability"],
    accent: "from-cyan-500/20 via-blue-500/10 to-transparent"
  },
  {
    slug: "cabin",
    title: "CABIN",
    category: "Operator Cabin System",
    heroLabel: "운전자 중심 설계",
    heroSubcopy:
      "UNITOP CABIN은 작업 환경과 차종 조건에 맞춘 구조 설계를 통해, 운전자 보호와 시야 확보, 작업 편의성을 함께 완성하는 통합 캐빈 제품군입니다.",
    shortDesc:
      "운전자 보호, 시야 확보, 작업 편의성을 함께 고려해 산업 차량의 운용 완성도를 높이는 캐빈 솔루션입니다.",
    longDesc:
      "UNITOP CABIN은 현장 환경과 차량 구조에 맞춘 설계 및 시공 역량을 바탕으로, 운전자 보호와 작업 편의성을 동시에 확보하는 캐빈 솔루션입니다. HVAC, 안전 장치, 기타 옵션과의 통합이 용이해 프로젝트 단위 적용에도 적합합니다.",
    intro:
      "차량 구조와 현장 조건에 맞춘 전용 설계를 바탕으로, 보호성과 편의성, 통합 장착 대응력을 함께 구현하는 캐빈 시스템입니다.",
    features: [
      {
        title: "Custom Structure",
        description:
          "차량별 프레임과 작업 환경에 맞춘 전용 캐빈 구조 설계로 현장별 대응력과 장착 완성도를 높입니다."
      },
      {
        title: "Operator Protection",
        description:
          "시야 확보, 승하차 편의, 외부 환경 차단을 함께 고려해 운전자 보호성과 실사용 만족도를 높입니다."
      },
      {
        title: "Integrated Option",
        description:
          "HVAC와 안전 옵션을 함께 장착할 수 있는 확장형 구성으로 프로젝트 적용 유연성을 확보합니다."
      }
    ],
    effects: [
      "우천, 분진, 한랭 환경에서 운전자 보호 성능 향상",
      "작업 편의성과 현장 적응력 향상",
      "차량별 맞춤 적용으로 프로젝트 완성도 강화"
    ],
    cardHighlights: ["Custom Fit", "Integrated Build", "Operator Comfort"],
    accent: "from-slate-500/20 via-blue-500/10 to-transparent"
  },
  {
    slug: "safety",
    title: "SAFETY",
    category: "Site Safety Solution",
    heroLabel: "스마트 안전 체계",
    heroSubcopy:
      "UNITOP SAFETY는 작업장 전체의 경고 체계와 안전 운영 기준을 보완하기 위해, 경광·알림·센서 기반 장비를 현장 흐름에 맞춰 구성하는 안전 제품군입니다.",
    shortDesc:
      "현장 특성에 맞춘 경광, 알림, 경고 장치 구성을 통해 작업장 안전 인프라를 확장하는 솔루션입니다.",
    longDesc:
      "UNITOP SAFETY는 차량 단위 장비를 넘어 작업장 전체의 안전 흐름을 보완하는 솔루션입니다. 경고 장치, 알림 시스템, 센서 응용을 통해 현장 위험도를 낮추고, 향후 스마트 안전 및 모니터링 체계로 확장할 수 있는 기반을 제공합니다.",
    intro:
      "단품 장비 공급이 아니라 현장 전체의 경고 체계, 구역 대응, 운영 안전성을 함께 설계하는 SITE SAFETY 솔루션입니다.",
    features: [
      {
        title: "Alert System",
        description:
          "경광등, 부저, 경고 표시 장치를 조합해 현장 특성에 맞는 안전 알림 체계를 구성합니다."
      },
      {
        title: "Zone Response",
        description:
          "구역별 위험도와 작업 동선에 맞춰 장비를 유연하게 배치할 수 있도록 설치 대응성을 높였습니다."
      },
      {
        title: "Smart Expansion",
        description:
          "스마트 안전 및 모니터링 시스템과 연결 가능한 구조로 후속 확장성과 운영 연계를 고려했습니다."
      }
    ],
    effects: [
      "작업장 내 경고 인지율 향상",
      "현장 안전 규정 운영과 표준화 지원",
      "향후 스마트 안전 인프라 구축 기반 마련"
    ],
    cardHighlights: ["Warning System", "Smart Safety", "Monitoring Ready"],
    accent: "from-emerald-500/20 via-blue-500/10 to-transparent"
  }
];

export const productSlugList = products.map((product) => product.slug);

export const productMap = Object.fromEntries(
  products.map((product) => [product.slug, product])
) as Record<Product["slug"], Product>;
