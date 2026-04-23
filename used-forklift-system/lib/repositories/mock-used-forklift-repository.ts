import {
  seedAsList,
  seedConsultations,
  seedCustomers,
  seedForklifts,
  seedShipments,
} from "@/lib/used-forklift-utils";
import {
  UsedForkliftRepository,
  UsedForkliftSnapshot,
} from "@/lib/repositories/used-forklift-repository";
import {
  AsRequest,
  Consultation,
  Customer,
  Forklift,
  Shipment,
} from "@/types/used-forklift";

export class MockUsedForkliftRepository implements UsedForkliftRepository {
  private snapshot: UsedForkliftSnapshot = {
    forklifts: seedForklifts,
    customers: seedCustomers,
    consultations: seedConsultations,
    shipments: seedShipments,
    asList: seedAsList,
  };

  async getSnapshot() {
    return this.snapshot;
  }

  async saveForklifts(forklifts: Forklift[]) {
    this.snapshot = { ...this.snapshot, forklifts };
  }

  async saveCustomers(customers: Customer[]) {
    this.snapshot = { ...this.snapshot, customers };
  }

  async saveConsultations(consultations: Consultation[]) {
    this.snapshot = { ...this.snapshot, consultations };
  }

  async saveShipments(shipments: Shipment[]) {
    this.snapshot = { ...this.snapshot, shipments };
  }

  async saveAsList(asList: AsRequest[]) {
    this.snapshot = { ...this.snapshot, asList };
  }
}
