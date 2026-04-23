import { getMockStore } from "@/lib/repositories/mock-store";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Database } from "@/types/database";
import { Shipment } from "@/types/used-forklift";

type ShipmentRow = Database["public"]["Tables"]["shipments"]["Row"];
type ShipmentInsert = Database["public"]["Tables"]["shipments"]["Insert"];
type ShipmentUpdate = Database["public"]["Tables"]["shipments"]["Update"];

function mapShipmentRow(row: ShipmentRow): Shipment {
  return {
    id: row.id,
    forkliftId: row.forklift_id,
    vehicleNumber: row.vehicle_number,
    customerId: row.customer_id,
    customerName: row.customer_name,
    shipmentDate: row.shipment_date,
    transportMethod: row.transport_method,
    manager: row.manager,
    note: row.note,
    status: row.status as Shipment["status"],
    consultationId: row.consultation_id ?? "",
    organizationId: row.organization_id ?? undefined,
    createdAt: row.created_at,
  };
}

function toShipmentInsert(shipment: Shipment): ShipmentInsert {
  return {
    id: shipment.id,
    forklift_id: shipment.forkliftId,
    vehicle_number: shipment.vehicleNumber,
    customer_id: shipment.customerId,
    customer_name: shipment.customerName,
    shipment_date: shipment.shipmentDate,
    transport_method: shipment.transportMethod,
    manager: shipment.manager,
    note: shipment.note,
    status: shipment.status,
    consultation_id: shipment.consultationId || null,
    organization_id: shipment.organizationId ?? null,
    created_at: shipment.createdAt,
  };
}

function toShipmentUpdate(patch: Partial<Shipment>): ShipmentUpdate {
  return {
    forklift_id: patch.forkliftId,
    vehicle_number: patch.vehicleNumber,
    customer_id: patch.customerId,
    customer_name: patch.customerName,
    shipment_date: patch.shipmentDate,
    transport_method: patch.transportMethod,
    manager: patch.manager,
    note: patch.note,
    status: patch.status,
    consultation_id: patch.consultationId ?? null,
    organization_id: patch.organizationId ?? null,
    created_at: patch.createdAt,
  };
}

export async function listShipments() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return getMockStore().getSnapshot().shipments;
  }

  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapShipmentRow(row as ShipmentRow));
}

export async function createShipment(shipment: Shipment) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    const created = { ...shipment, createdAt: shipment.createdAt ?? new Date().toISOString() };
    store.setShipments([created, ...store.getSnapshot().shipments]);
    return created;
  }

  const { data, error } = await supabase
    .from("shipments")
    .insert(toShipmentInsert(shipment))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapShipmentRow(data as ShipmentRow);
}

export async function updateShipment(id: string, patch: Partial<Shipment>) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    const updatedList = store
      .getSnapshot()
      .shipments.map((item) => (item.id === id ? { ...item, ...patch } : item));
    store.setShipments(updatedList);
    return updatedList.find((item) => item.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("shipments")
    .update(toShipmentUpdate(patch))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapShipmentRow(data as ShipmentRow);
}

export async function removeShipment(id: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    store.setShipments(store.getSnapshot().shipments.filter((item) => item.id !== id));
    return;
  }

  const { error } = await supabase.from("shipments").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function seedShipmentsIfEmpty(items: Shipment[]) {
  const existing = await listShipments();
  if (existing.length > 0) {
    return false;
  }

  await Promise.all(items.map((item) => createShipment(item)));
  return true;
}
