import { mlDataHoldings, mlTableDefinitions } from "@/data/mock/ml-data";
import { ragDataHoldings, ragTableDefinitions } from "@/data/mock/rag-data";
import { withServiceContext } from "@/lib/data-provider";

export function getDataCatalog() {
  return withServiceContext(() => ({
    rag: {
      holdings: ragDataHoldings,
      tables: ragTableDefinitions,
    },
    ml: {
      holdings: mlDataHoldings,
      tables: mlTableDefinitions,
    },
  }));
}
