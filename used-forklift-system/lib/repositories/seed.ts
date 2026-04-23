import { seedAsList, seedConsultations, seedCustomers, seedForklifts, seedShipments } from "@/lib/used-forklift-utils";
import { seedAsRequestsIfEmpty } from "@/lib/repositories/as-requests";
import { seedConsultationsIfEmpty } from "@/lib/repositories/consultations";
import { seedCustomersIfEmpty } from "@/lib/repositories/customers";
import { seedForkliftsIfEmpty } from "@/lib/repositories/forklifts";
import { seedShipmentsIfEmpty } from "@/lib/repositories/shipments";

export async function seedAllTablesIfEmpty() {
  const [forkliftsSeeded, customersSeeded, consultationsSeeded, shipmentsSeeded, asSeeded] =
    await Promise.all([
      seedForkliftsIfEmpty(seedForklifts),
      seedCustomersIfEmpty(seedCustomers),
      seedConsultationsIfEmpty(seedConsultations),
      seedShipmentsIfEmpty(seedShipments),
      seedAsRequestsIfEmpty(seedAsList),
    ]);

  return {
    forkliftsSeeded,
    customersSeeded,
    consultationsSeeded,
    shipmentsSeeded,
    asSeeded,
  };
}
