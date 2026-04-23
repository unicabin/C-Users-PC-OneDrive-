import {
  mlDataAssets,
  platformMenuGroups,
  ragDataAssets,
} from "@/data/architecture-data";
import { withServiceContext } from "@/lib/data-provider";

export function getPlatformMenuGroups() {
  return withServiceContext(() => platformMenuGroups);
}

export function getArchitectureDataAssets() {
  return withServiceContext(() => ({
    rag: ragDataAssets,
    ml: mlDataAssets,
  }));
}
