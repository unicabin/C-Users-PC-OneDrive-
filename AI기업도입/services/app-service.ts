import { defaultModuleStatuses, navigationItems, pageContent } from "@/data/app-data";
import { withServiceContext } from "@/lib/data-provider";

export function getNavigationItems() {
  return withServiceContext(() => navigationItems);
}

export function getPageContent(key: keyof typeof pageContent) {
  return withServiceContext(() => pageContent[key]);
}

export function getModuleStatuses() {
  return withServiceContext(() => defaultModuleStatuses);
}
