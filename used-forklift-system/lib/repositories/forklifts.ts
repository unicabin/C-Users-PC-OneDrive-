import { getMockStore } from "@/lib/repositories/mock-store";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Database } from "@/types/database";
import { Forklift } from "@/types/used-forklift";

type ForkliftRow = Database["public"]["Tables"]["forklifts"]["Row"];
type ForkliftInsert = Database["public"]["Tables"]["forklifts"]["Insert"];
type ForkliftUpdate = Database["public"]["Tables"]["forklifts"]["Update"];

function mapForkliftRow(row: ForkliftRow): Forklift {
  return {
    id: row.id,
    vehicleNumber: row.vehicle_number,
    model: row.model,
    year: row.year,
    price: row.price,
    status: row.status as Forklift["status"],
    note: row.note,
    organizationId: row.organization_id ?? undefined,
    createdAt: row.created_at,
  };
}

function toForkliftInsert(forklift: Forklift): ForkliftInsert {
  return {
    id: forklift.id,
    vehicle_number: forklift.vehicleNumber,
    model: forklift.model,
    year: forklift.year,
    price: forklift.price,
    status: forklift.status,
    note: forklift.note,
    organization_id: forklift.organizationId ?? null,
    created_at: forklift.createdAt,
  };
}

function toForkliftUpdate(patch: Partial<Forklift>): ForkliftUpdate {
  return {
    vehicle_number: patch.vehicleNumber,
    model: patch.model,
    year: patch.year,
    price: patch.price,
    status: patch.status,
    note: patch.note,
    organization_id: patch.organizationId ?? null,
    created_at: patch.createdAt,
  };
}

export async function listForklifts() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return getMockStore().getSnapshot().forklifts;
  }

  const { data, error } = await supabase
    .from("forklifts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapForkliftRow(row as ForkliftRow));
}

export async function createForklift(forklift: Forklift) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    const created = { ...forklift, createdAt: forklift.createdAt ?? new Date().toISOString() };
    store.setForklifts([created, ...store.getSnapshot().forklifts]);
    return created;
  }

  const { data, error } = await supabase
    .from("forklifts")
    .insert(toForkliftInsert(forklift))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapForkliftRow(data as ForkliftRow);
}

export async function updateForklift(id: string, patch: Partial<Forklift>) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    const updatedList = store
      .getSnapshot()
      .forklifts.map((item) => (item.id === id ? { ...item, ...patch } : item));
    store.setForklifts(updatedList);
    return updatedList.find((item) => item.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("forklifts")
    .update(toForkliftUpdate(patch))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapForkliftRow(data as ForkliftRow);
}

export async function removeForklift(id: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    store.setForklifts(store.getSnapshot().forklifts.filter((item) => item.id !== id));
    return;
  }

  const { error } = await supabase.from("forklifts").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function seedForkliftsIfEmpty(items: Forklift[]) {
  const existing = await listForklifts();
  if (existing.length > 0) {
    return false;
  }

  await Promise.all(items.map((item) => createForklift(item)));
  return true;
}
