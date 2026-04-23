import { getMockStore } from "@/lib/repositories/mock-store";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Database } from "@/types/database";
import { AsRequest } from "@/types/used-forklift";

type AsRequestRow = Database["public"]["Tables"]["as_requests"]["Row"];
type AsRequestInsert = Database["public"]["Tables"]["as_requests"]["Insert"];
type AsRequestUpdate = Database["public"]["Tables"]["as_requests"]["Update"];

function mapAsRequestRow(row: AsRequestRow): AsRequest {
  return {
    id: row.id,
    forkliftId: row.forklift_id,
    organizationId: row.organization_id ?? undefined,
    createdAt: row.created_at,
  };
}

function toAsRequestInsert(request: AsRequest): AsRequestInsert {
  return {
    id: request.id,
    forklift_id: request.forkliftId,
    organization_id: request.organizationId ?? null,
    created_at: request.createdAt,
  };
}

function toAsRequestUpdate(patch: Partial<AsRequest>): AsRequestUpdate {
  return {
    forklift_id: patch.forkliftId,
    organization_id: patch.organizationId ?? null,
    created_at: patch.createdAt,
  };
}

export async function listAsRequests() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return getMockStore().getSnapshot().asRequests;
  }

  const { data, error } = await supabase
    .from("as_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapAsRequestRow(row as AsRequestRow));
}

export async function createAsRequest(request: AsRequest) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    const created = { ...request, createdAt: request.createdAt ?? new Date().toISOString() };
    store.setAsRequests([created, ...store.getSnapshot().asRequests]);
    return created;
  }

  const { data, error } = await supabase
    .from("as_requests")
    .insert(toAsRequestInsert(request))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapAsRequestRow(data as AsRequestRow);
}

export async function updateAsRequest(id: string, patch: Partial<AsRequest>) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    const updatedList = store
      .getSnapshot()
      .asRequests.map((item) => (item.id === id ? { ...item, ...patch } : item));
    store.setAsRequests(updatedList);
    return updatedList.find((item) => item.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("as_requests")
    .update(toAsRequestUpdate(patch))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapAsRequestRow(data as AsRequestRow);
}

export async function removeAsRequest(id: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    store.setAsRequests(store.getSnapshot().asRequests.filter((item) => item.id !== id));
    return;
  }

  const { error } = await supabase.from("as_requests").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function seedAsRequestsIfEmpty(items: AsRequest[]) {
  const existing = await listAsRequests();
  if (existing.length > 0) {
    return false;
  }

  await Promise.all(items.map((item) => createAsRequest(item)));
  return true;
}
