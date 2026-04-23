export type DataDomain = "RAG" | "ML";

export type DataFieldDefinition = {
  name: string;
  type: string;
  description: string;
};

export type DataTableDefinition = {
  table: string;
  domain: DataDomain;
  description: string;
  fields: DataFieldDefinition[];
  relation: string;
};

export type DataHoldingRow = {
  name: string;
  dataType: "비정형 데이터" | "정형 데이터";
  hasNow: "보유" | "부분 보유" | "미보유";
  nextPlan: "고도화" | "구축 예정" | "유지";
  featureUsage: string;
};
