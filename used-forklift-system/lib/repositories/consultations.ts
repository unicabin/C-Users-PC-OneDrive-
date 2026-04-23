import { getMockStore } from "@/lib/repositories/mock-store";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Database } from "@/types/database";
import { Consultation } from "@/types/used-forklift";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];
type ConsultationInsert = Database["public"]["Tables"]["consultations"]["Insert"];
type ConsultationUpdate = Database["public"]["Tables"]["consultations"]["Update"];

function mapConsultationRow(row: ConsultationRow): Consultation {
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    phone: row.phone,
    company: row.company,
    forkliftId: row.forklift_id,
    model: row.model,
    consultDate: row.consult_date,
    status: row.status as Consultation["status"],
    note: row.note,
    convertedToShipment: row.converted_to_shipment,
    organizationId: row.organization_id ?? undefined,
    createdAt: row.created_at,
  };
}

function toConsultationInsert(consultation: Consultation): ConsultationInsert {
  return {
    id: consultation.id,
    customer_id: consultation.customerId,
    customer_name: consultation.customerName,
    phone: consultation.phone,
    company: consultation.company,
    forklift_id: consultation.forkliftId,
    model: consultation.model,
    consult_date: consultation.consultDate,
    status: consultation.status,
    note: consultation.note,
    converted_to_shipment: consultation.convertedToShipment ?? false,
    organization_id: consultation.organizationId ?? null,
    created_at: consultation.createdAt,
  };
}

function toConsultationUpdate(patch: Partial<Consultation>): ConsultationUpdate {
  return {
    customer_id: patch.customerId,
    customer_name: patch.customerName,
    phone: patch.phone,
    company: patch.company,
    forklift_id: patch.forkliftId,
    model: patch.model,
    consult_date: patch.consultDate,
    status: patch.status,
    note: patch.note,
    converted_to_shipment: patch.convertedToShipment,
    organization_id: patch.organizationId ?? null,
    created_at: patch.createdAt,
  };
}

export async function listConsultations() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return getMockStore().getSnapshot().consultations;
  }

  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapConsultationRow(row as ConsultationRow));
}

export async function createConsultation(consultation: Consultation) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    const created = {
      ...consultation,
      convertedToShipment: consultation.convertedToShipment ?? false,
      createdAt: consultation.createdAt ?? new Date().toISOString(),
    };
    store.setConsultations([created, ...store.getSnapshot().consultations]);
    return created;
  }

  const { data, error } = await supabase
    .from("consultations")
    .insert(toConsultationInsert(consultation))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapConsultationRow(data as ConsultationRow);
}

export async function updateConsultation(id: string, patch: Partial<Consultation>) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    const updatedList = store
      .getSnapshot()
      .consultations.map((item) => (item.id === id ? { ...item, ...patch } : item));
    store.setConsultations(updatedList);
    return updatedList.find((item) => item.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("consultations")
    .update(toConsultationUpdate(patch))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapConsultationRow(data as ConsultationRow);
}

export async function removeConsultation(id: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    store.setConsultations(store.getSnapshot().consultations.filter((item) => item.id !== id));
    return;
  }

  const { error } = await supabase.from("consultations").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function seedConsultationsIfEmpty(items: Consultation[]) {
  const existing = await listConsultations();
  if (existing.length > 0) {
    return false;
  }

  await Promise.all(items.map((item) => createConsultation(item)));
  return true;
}
