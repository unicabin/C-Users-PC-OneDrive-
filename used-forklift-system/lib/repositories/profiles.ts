import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Database } from "@/types/database";
import { AppRole, UserProfile } from "@/types/used-forklift";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

function mapProfileRow(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role as AppRole,
    organizationId: row.organization_id ?? undefined,
    createdAt: row.created_at,
  };
}

function toProfileInsert(profile: UserProfile): ProfileInsert {
  return {
    id: profile.id,
    email: profile.email,
    display_name: profile.displayName,
    role: profile.role,
    organization_id: profile.organizationId ?? null,
    created_at: profile.createdAt,
  };
}

function toProfileUpdate(patch: Partial<UserProfile>): ProfileUpdate {
  return {
    email: patch.email,
    display_name: patch.displayName,
    role: patch.role,
    organization_id: patch.organizationId ?? null,
    created_at: patch.createdAt,
  };
}

function buildDefaultProfile(user: User): UserProfile {
  const metadataName =
    typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name
      : typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : "";

  return {
    id: user.id,
    email: user.email ?? "",
    displayName: metadataName || user.email?.split("@")[0] || "담당자",
    role: "staff",
    organizationId:
      typeof user.user_metadata?.organization_id === "string"
        ? user.user_metadata.organization_id
        : undefined,
    createdAt: new Date().toISOString(),
  };
}

export async function getProfileById(id: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      id,
      email: "local-admin@example.com",
      displayName: "로컬 관리자",
      role: "admin" as AppRole,
      organizationId: "local-org",
      createdAt: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProfileRow(data as ProfileRow) : null;
}

export async function ensureProfileForUser(user: User) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      id: user.id,
      email: user.email ?? "local-admin@example.com",
      displayName: "로컬 관리자",
      role: "admin" as AppRole,
      organizationId: "local-org",
      createdAt: new Date().toISOString(),
    };
  }

  const existing = await getProfileById(user.id);
  if (existing) {
    return existing;
  }

  const defaultProfile = buildDefaultProfile(user);
  const { data, error } = await supabase
    .from("profiles")
    .insert(toProfileInsert(defaultProfile))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapProfileRow(data as ProfileRow);
}

export async function updateProfile(id: string, patch: Partial<UserProfile>) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      id,
      email: patch.email ?? "local-admin@example.com",
      displayName: patch.displayName ?? "로컬 관리자",
      role: (patch.role ?? "admin") as AppRole,
      organizationId: patch.organizationId ?? "local-org",
      createdAt: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(toProfileUpdate(patch))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapProfileRow(data as ProfileRow);
}
