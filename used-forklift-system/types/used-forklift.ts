import { ChangeEvent } from "react";

export type TabKey = "inventory" | "customer" | "consult" | "shipment";
export type AppRole = "admin" | "staff";

export type ForkliftStatus = "판매중" | "정비중" | "판매완료";
export type ShipmentStatus = "준비중" | "출고완료" | "인도완료";
export type CustomerStatus = "신규" | "상담중" | "계약예정" | "종료";
export type ConsultationStatus = "신규" | "상담중" | "계약예정" | "종료";

export type Forklift = {
  id: string;
  vehicleNumber: string;
  model: string;
  year: string;
  price: string;
  status: ForkliftStatus;
  note: string;
  createdAt?: string;
  organizationId?: string;
};

export type Shipment = {
  id: string;
  forkliftId: string;
  vehicleNumber: string;
  customerId: string;
  customerName: string;
  shipmentDate: string;
  transportMethod: string;
  manager: string;
  note: string;
  status: ShipmentStatus;
  createdAt: string;
  consultationId?: string;
  organizationId?: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  company: string;
  region: string;
  interestModel: string;
  status: CustomerStatus;
  memo: string;
  createdAt?: string;
  organizationId?: string;
};

export type Consultation = {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  company: string;
  forkliftId: string;
  model: string;
  consultDate: string;
  status: ConsultationStatus;
  note: string;
  convertedToShipment?: boolean;
  createdAt?: string;
  organizationId?: string;
};

export type AsRequest = {
  id: string;
  forkliftId: string;
  createdAt?: string;
  organizationId?: string;
};

export type InventoryImportPreview = {
  sheetName: string;
  forklifts: Forklift[];
  soldForkliftIds: string[];
  asRequests: AsRequest[];
};

export type KpiCardItem = {
  label: string;
  value: string;
  helper?: string;
};

export type DashboardRecentItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  status: string;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  role: AppRole;
  createdAt?: string;
  organizationId?: string;
};

export type FormChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;
