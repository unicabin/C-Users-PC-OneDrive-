import {
  AsRequest,
  Consultation,
  ConsultationStatus,
  DashboardRecentItem,
  Customer,
  CustomerStatus,
  Forklift,
  ForkliftStatus,
  KpiCardItem,
  Shipment,
  ShipmentStatus,
  TabKey,
} from "@/types/used-forklift";

export const TAB_ITEMS: { key: TabKey; label: string }[] = [
  { key: "inventory", label: "재고관리" },
  { key: "customer", label: "고객관리" },
  { key: "consult", label: "상담관리" },
  { key: "shipment", label: "출고관리" },
];

export const seedForklifts: Forklift[] = [
  {
    id: "FLT-001",
    vehicleNumber: "UT-101",
    model: "도요타 2.5톤 디젤",
    year: "2021",
    price: "23500000",
    status: "판매중",
    note: "시동 상태 양호 / 즉시 출고 가능",
    createdAt: "2026-03-01T09:00:00.000Z",
  },
  {
    id: "FLT-002",
    vehicleNumber: "UT-102",
    model: "니찌유 3톤 전동",
    year: "2020",
    price: "19800000",
    status: "정비중",
    note: "배터리 점검 진행 중",
    createdAt: "2026-03-03T10:00:00.000Z",
  },
  {
    id: "FLT-003",
    vehicleNumber: "UT-103",
    model: "클라크 3.5톤 LPG",
    year: "2019",
    price: "18400000",
    status: "판매완료",
    note: "기존 거래처 계약 완료",
    createdAt: "2026-03-05T11:00:00.000Z",
  },
];

export const seedCustomers: Customer[] = [
  {
    id: "CUS-001",
    name: "김민수",
    phone: "010-2211-3344",
    company: "세방물류",
    region: "경기 화성",
    interestModel: "도요타 2.5톤 디젤",
    status: "상담중",
    memo: "창고 하역 작업용 문의",
    createdAt: "2026-03-02T09:00:00.000Z",
  },
  {
    id: "CUS-002",
    name: "박정호",
    phone: "010-5555-7788",
    company: "대성산업",
    region: "인천 서구",
    interestModel: "클라크 3.5톤 LPG",
    status: "계약예정",
    memo: "3월 말 출고 희망",
    createdAt: "2026-03-07T09:00:00.000Z",
  },
  {
    id: "CUS-003",
    name: "이재훈",
    phone: "010-8787-1212",
    company: "동부자재",
    region: "충남 아산",
    interestModel: "니찌유 3톤 전동",
    status: "신규",
    memo: "배터리형 우선 검토",
    createdAt: "2026-03-12T09:00:00.000Z",
  },
];

export const seedConsultations: Consultation[] = [
  {
    id: "CON-001",
    customerId: "CUS-001",
    customerName: "김민수",
    phone: "010-2211-3344",
    company: "세방물류",
    forkliftId: "FLT-001",
    model: "도요타 2.5톤 디젤",
    consultDate: "2026-03-08",
    status: "상담중",
    note: "방문 견적 예정",
    convertedToShipment: false,
    createdAt: "2026-03-08T09:00:00.000Z",
  },
  {
    id: "CON-002",
    customerId: "CUS-002",
    customerName: "박정호",
    phone: "010-5555-7788",
    company: "대성산업",
    forkliftId: "FLT-003",
    model: "클라크 3.5톤 LPG",
    consultDate: "2026-03-15",
    status: "계약예정",
    note: "출고 일정 협의 필요",
    convertedToShipment: true,
    createdAt: "2026-03-15T09:00:00.000Z",
  },
  {
    id: "CON-003",
    customerId: "",
    customerName: "최영준",
    phone: "010-9000-1212",
    company: "대양상사",
    forkliftId: "FLT-002",
    model: "니찌유 3톤 전동",
    consultDate: "2026-03-18",
    status: "종료",
    note: "후보군 재검토 예정",
    convertedToShipment: false,
    createdAt: "2026-03-18T09:00:00.000Z",
  },
];

export const seedShipments: Shipment[] = [
  {
    id: "SHIP-2026031001",
    forkliftId: "FLT-003",
    vehicleNumber: "UT-103",
    customerId: "CUS-002",
    customerName: "박정호",
    shipmentDate: "2026-03-20",
    transportMethod: "직송",
    manager: "이대리",
    note: "오전 인도 예정",
    status: "출고완료",
    createdAt: "2026-03-20T09:00:00.000Z",
    consultationId: "CON-002",
  },
];

export const seedAsList: AsRequest[] = [
  { id: "AS-001", forkliftId: "FLT-001", createdAt: "2026-03-05T09:00:00.000Z" },
  { id: "AS-002", forkliftId: "FLT-001", createdAt: "2026-03-14T09:00:00.000Z" },
  { id: "AS-003", forkliftId: "FLT-003", createdAt: "2026-03-21T09:00:00.000Z" },
];

export const emptyForkliftForm: Forklift = {
  id: "",
  vehicleNumber: "",
  model: "",
  year: "",
  price: "",
  status: "판매중",
  note: "",
};

export const emptyCustomerForm: Customer = {
  id: "",
  name: "",
  phone: "",
  company: "",
  region: "",
  interestModel: "",
  status: "신규",
  memo: "",
};

export const emptyConsultationForm: Consultation = {
  id: "",
  customerId: "",
  customerName: "",
  phone: "",
  company: "",
  forkliftId: "",
  model: "",
  consultDate: "",
  status: "신규",
  note: "",
  convertedToShipment: false,
};

export const emptyShipmentForm: Shipment = {
  id: "",
  forkliftId: "",
  vehicleNumber: "",
  customerId: "",
  customerName: "",
  shipmentDate: "",
  transportMethod: "",
  manager: "",
  note: "",
  status: "준비중",
  createdAt: "",
  consultationId: "",
};

export function formatPrice(value: string) {
  if (!value) {
    return "-";
  }

  const number = Number(value.replaceAll(",", ""));
  if (Number.isNaN(number)) {
    return value;
  }

  return `${number.toLocaleString("ko-KR")}원`;
}

export function createShipmentId() {
  return `SHIP-${Date.now()}`;
}

export function nextShipmentStatus(status: ShipmentStatus) {
  if (status === "준비중") {
    return "출고완료";
  }
  if (status === "출고완료") {
    return "인도완료";
  }
  return null;
}

export function getForkliftStatusTone(status: ForkliftStatus) {
  if (status === "판매완료") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  }
  if (status === "정비중") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
  }
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

export function getShipmentStatusTone(status: ShipmentStatus) {
  if (status === "인도완료") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  }
  if (status === "출고완료") {
    return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
  }
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

export function getConsultTone(status: ConsultationStatus | CustomerStatus) {
  if (status === "종료") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  }
  if (status === "계약예정") {
    return "bg-orange-50 text-orange-700 ring-1 ring-orange-100";
  }
  if (status === "상담중") {
    return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
  }
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

export function buildKpiCards(params: {
  forklifts: Forklift[];
  shipments: Shipment[];
  consultations: Consultation[];
  asList: AsRequest[];
}): KpiCardItem[] {
  const { forklifts, shipments, consultations, asList } = params;
  const soldCount = forklifts.filter((item) => item.status === "판매완료").length;
  const waitingShipmentCount = shipments.filter((item) => item.status === "준비중").length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const today = new Date().toISOString().slice(0, 10);
  const thisMonthConsultCount = consultations.filter((item) =>
    item.consultDate.startsWith(thisMonth),
  ).length;
  const todayConsultCount = consultations.filter((item) => item.consultDate === today).length;
  const thisMonthShipmentCount = shipments.filter((item) =>
    item.shipmentDate.startsWith(thisMonth),
  ).length;
  const contractPendingCount = consultations.filter(
    (item) => item.status === "계약예정",
  ).length;

  return [
    {
      label: "오늘 상담 수",
      value: `${todayConsultCount}건`,
      helper: `이번달 상담 ${thisMonthConsultCount}건`,
    },
    {
      label: "이번달 출고 수",
      value: `${thisMonthShipmentCount}건`,
      helper: `누적 출고 ${shipments.length}건`,
    },
    {
      label: "판매완료 수",
      value: `${soldCount}대`,
      helper: `전체 재고 ${forklifts.length}대`,
    },
    {
      label: "출고대기 수",
      value: `${waitingShipmentCount}건`,
      helper: `계약예정 ${contractPendingCount}건`,
    },
    {
      label: "전체 재고",
      value: `${forklifts.length}대`,
      helper: `정비중 ${forklifts.filter((item) => item.status === "정비중").length}대`,
    },
    {
      label: "출고 건수",
      value: `${shipments.length}건`,
      helper: `인도완료 ${shipments.filter((item) => item.status === "인도완료").length}건`,
    },
    {
      label: "이번달 상담 건수",
      value: `${thisMonthConsultCount}건`,
      helper: `오늘 ${todayConsultCount}건`,
    },
    {
      label: "A/S 건수",
      value: `${asList.length}건`,
      helper: "누적 정비 이력",
    },
  ];
}

export function buildRecentConsultations(consultations: Consultation[]): DashboardRecentItem[] {
  return [...consultations]
    .sort((a, b) => b.consultDate.localeCompare(a.consultDate))
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      title: item.customerName,
      subtitle: item.model || "-",
      meta: item.consultDate || "-",
      status: item.status,
    }));
}

export function buildRecentShipments(shipments: Shipment[]): DashboardRecentItem[] {
  return [...shipments]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      title: item.customerName,
      subtitle: item.vehicleNumber || "-",
      meta: item.shipmentDate || "-",
      status: item.status,
    }));
}
