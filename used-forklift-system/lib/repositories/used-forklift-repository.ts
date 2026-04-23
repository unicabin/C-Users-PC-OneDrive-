import {
  AsRequest,
  Consultation,
  Customer,
  Forklift,
  Shipment,
} from "@/types/used-forklift";

export type UsedForkliftSnapshot = {
  forklifts: Forklift[];
  customers: Customer[];
  consultations: Consultation[];
  shipments: Shipment[];
  asList: AsRequest[];
};

export interface UsedForkliftRepository {
  getSnapshot(): Promise<UsedForkliftSnapshot>;
  saveForklifts(forklifts: Forklift[]): Promise<void>;
  saveCustomers(customers: Customer[]): Promise<void>;
  saveConsultations(consultations: Consultation[]): Promise<void>;
  saveShipments(shipments: Shipment[]): Promise<void>;
  saveAsList(asList: AsRequest[]): Promise<void>;
}
