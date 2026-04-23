import { getMockStore } from "@/lib/repositories/mock-store";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Database } from "@/types/database";
import { Customer } from "@/types/used-forklift";

type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];
type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
type CustomerUpdate = Database["public"]["Tables"]["customers"]["Update"];

function mapCustomerRow(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    company: row.company,
    region: row.region,
    interestModel: row.interest_model,
    status: row.status as Customer["status"],
    memo: row.memo,
    organizationId: row.organization_id ?? undefined,
    createdAt: row.created_at,
  };
}

function toCustomerInsert(customer: Customer): CustomerInsert {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    company: customer.company,
    region: customer.region,
    interest_model: customer.interestModel,
    status: customer.status,
    memo: customer.memo,
    organization_id: customer.organizationId ?? null,
    created_at: customer.createdAt,
  };
}

function toCustomerUpdate(patch: Partial<Customer>): CustomerUpdate {
  return {
    name: patch.name,
    phone: patch.phone,
    company: patch.company,
    region: patch.region,
    interest_model: patch.interestModel,
    status: patch.status,
    memo: patch.memo,
    organization_id: patch.organizationId ?? null,
    created_at: patch.createdAt,
  };
}

export async function listCustomers() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return getMockStore().getSnapshot().customers;
  }

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapCustomerRow(row as CustomerRow));
}

export async function createCustomer(customer: Customer) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    const created = { ...customer, createdAt: customer.createdAt ?? new Date().toISOString() };
    store.setCustomers([created, ...store.getSnapshot().customers]);
    return created;
  }

  const { data, error } = await supabase
    .from("customers")
    .insert(toCustomerInsert(customer))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapCustomerRow(data as CustomerRow);
}

export async function updateCustomer(id: string, patch: Partial<Customer>) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    const updatedList = store
      .getSnapshot()
      .customers.map((item) => (item.id === id ? { ...item, ...patch } : item));
    store.setCustomers(updatedList);
    return updatedList.find((item) => item.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("customers")
    .update(toCustomerUpdate(patch))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapCustomerRow(data as CustomerRow);
}

export async function removeCustomer(id: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const store = getMockStore();
    store.setCustomers(store.getSnapshot().customers.filter((item) => item.id !== id));
    return;
  }

  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function seedCustomersIfEmpty(items: Customer[]) {
  const existing = await listCustomers();
  if (existing.length > 0) {
    return false;
  }

  await Promise.all(items.map((item) => createCustomer(item)));
  return true;
}
