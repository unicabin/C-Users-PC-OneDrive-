import {
  seedAsList,
  seedConsultations,
  seedCustomers,
  seedForklifts,
  seedShipments,
} from "@/lib/used-forklift-utils";
import {
  AsRequest,
  Consultation,
  Customer,
  Forklift,
  Shipment,
} from "@/types/used-forklift";

type Snapshot = {
  forklifts: Forklift[];
  customers: Customer[];
  consultations: Consultation[];
  shipments: Shipment[];
  asRequests: AsRequest[];
};

class MockStore {
  private snapshot: Snapshot = {
    forklifts: [...seedForklifts],
    customers: [...seedCustomers],
    consultations: [...seedConsultations],
    shipments: [...seedShipments],
    asRequests: [...seedAsList],
  };

  getSnapshot() {
    return this.snapshot;
  }

  setForklifts(forklifts: Forklift[]) {
    this.snapshot = { ...this.snapshot, forklifts };
  }

  setCustomers(customers: Customer[]) {
    this.snapshot = { ...this.snapshot, customers };
  }

  setConsultations(consultations: Consultation[]) {
    this.snapshot = { ...this.snapshot, consultations };
  }

  setShipments(shipments: Shipment[]) {
    this.snapshot = { ...this.snapshot, shipments };
  }

  setAsRequests(asRequests: AsRequest[]) {
    this.snapshot = { ...this.snapshot, asRequests };
  }

  resetToSeed() {
    this.snapshot = {
      forklifts: [...seedForklifts],
      customers: [...seedCustomers],
      consultations: [...seedConsultations],
      shipments: [...seedShipments],
      asRequests: [...seedAsList],
    };
  }
}

const mockStore = new MockStore();

export function getMockStore() {
  return mockStore;
}
