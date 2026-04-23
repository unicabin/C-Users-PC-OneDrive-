import { AppRole, TabKey } from "@/types/used-forklift";

export function canAccessTab(role: AppRole | undefined, tab: TabKey) {
  if (role === "admin") {
    return true;
  }

  if (role === "staff") {
    return tab !== "customer";
  }

  return false;
}

export function roleLabel(role: AppRole | undefined) {
  if (role === "admin") {
    return "관리자";
  }
  if (role === "staff") {
    return "직원";
  }
  return "권한 확인중";
}
