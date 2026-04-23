import * as XLSX from "xlsx";
import {
  AsRequest,
  Consultation,
  Customer,
  Forklift,
  ForkliftStatus,
  InventoryImportPreview,
  Shipment,
} from "@/types/used-forklift";

function normalizeExcelKey(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function pickExcelValue(row: Record<string, unknown>, keys: string[]) {
  const normalizedEntries = Object.entries(row).map(([key, value]) => [
    normalizeExcelKey(String(key)),
    value,
  ] as const);

  for (const key of keys) {
    const matched = normalizedEntries.find(([entryKey]) => entryKey === normalizeExcelKey(key));
    if (matched && matched[1] !== undefined && matched[1] !== null) {
      return String(matched[1]).trim();
    }
  }

  return "";
}

function parseSheetByHeaders(sheet: XLSX.WorkSheet, requiredHeaders: string[]) {
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
  });

  const headerRowIndex = rows.findIndex((row) =>
    requiredHeaders.every((header) =>
      row.some((cell) => normalizeExcelKey(String(cell)) === normalizeExcelKey(header)),
    ),
  );

  if (headerRowIndex === -1) {
    return [];
  }

  const header = rows[headerRowIndex].map((cell) => String(cell).trim());

  return rows
    .slice(headerRowIndex + 1)
    .filter((row) => row.some((cell) => String(cell).trim() !== ""))
    .map(
      (row) =>
        Object.fromEntries(header.map((key, index) => [key, row[index] ?? ""])) as Record<
          string,
          unknown
        >,
    );
}

function mapExcelRowToForklift(row: Record<string, unknown>, index: number): Forklift | null {
  const managementId =
    pickExcelValue(row, ["관리번호", "재고번호", "재고id", "id"]) ||
    `FLT-IMPORT-${index + 1}`;
  const manufacturer = pickExcelValue(row, ["제조사"]);
  const modelName = pickExcelValue(row, ["모델명", "모델", "차종"]);
  const typeName = pickExcelValue(row, ["유형"]);
  const vehicleNumber = pickExcelValue(row, ["차량번호", "장비번호", "차대번호"]) || managementId;
  const year = pickExcelValue(row, ["연식", "제작연도"]);
  const price = pickExcelValue(row, ["가격", "매입가", "판매가", "금액"]).replace(/[^\d]/g, "");
  const rawStatus = pickExcelValue(row, ["현상태", "상태", "재고상태"]);
  const option = pickExcelValue(row, ["옵션"]);
  const etc = pickExcelValue(row, ["기타", "메모", "비고", "특이사항"]);

  if (!managementId && !modelName) {
    return null;
  }

  const statusMap: Record<string, ForkliftStatus> = {
    판매: "판매완료",
    판매완료: "판매완료",
    사용불가: "정비중",
    정비중: "정비중",
    수리중: "정비중",
    신품: "판매중",
    정상: "판매중",
    판매중: "판매중",
  };

  return {
    id: managementId,
    vehicleNumber,
    model: [manufacturer, modelName, typeName].filter(Boolean).join(" / "),
    year,
    price,
    status: statusMap[rawStatus] ?? "판매중",
    note: [option, etc].filter(Boolean).join(" / "),
  };
}

function parseInventorySheet(sheet: XLSX.WorkSheet) {
  return parseSheetByHeaders(sheet, ["관리번호", "모델명"]);
}

function parseRepairSheet(sheet: XLSX.WorkSheet): AsRequest[] {
  const rows = parseSheetByHeaders(sheet, ["날짜", "차량", "수리내용"]);

  return rows
    .map((row, index) => {
      const forkliftId = pickExcelValue(row, ["차량", "관리번호", "차량번호"]).trim();
      const note = pickExcelValue(row, ["수리내용", "비고"]);

      if (!forkliftId || !note || note === "합계") {
        return null;
      }

      return {
        id: `AS-IMPORT-${index + 1}`,
        forkliftId,
      };
    })
    .filter((item): item is AsRequest => Boolean(item));
}

function parseSoldForkliftIds(sheet: XLSX.WorkSheet) {
  const rows = parseSheetByHeaders(sheet, ["관리번호", "모델명"]);

  return rows
    .map((row) => pickExcelValue(row, ["관리번호"]).trim())
    .filter(Boolean);
}

export async function buildInventoryImportPreviewFromFile(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const preferredSheetName =
    workbook.SheetNames.find((name) => name.includes("현재 지게차 현황")) ??
    workbook.SheetNames[0];
  const targetSheet = workbook.Sheets[preferredSheetName];
  const soldSheetName = workbook.SheetNames.find((name) => name.includes("판매지게차현황"));
  const repairSheetName = workbook.SheetNames.find((name) => name.includes("수리내역"));
  const soldSheet = soldSheetName ? workbook.Sheets[soldSheetName] : undefined;
  const repairSheet = repairSheetName ? workbook.Sheets[repairSheetName] : undefined;

  if (!targetSheet) {
    return null;
  }

  const forklifts = parseInventorySheet(targetSheet)
    .map((row, index) => mapExcelRowToForklift(row, index))
    .filter((item): item is Forklift => Boolean(item));

  if (!forklifts.length) {
    return null;
  }

  const soldForkliftIds = soldSheet ? parseSoldForkliftIds(soldSheet) : [];
  const soldForkliftIdSet = new Set(soldForkliftIds);
  const asRequests = repairSheet ? parseRepairSheet(repairSheet) : [];

  return {
    sheetName: preferredSheetName,
    forklifts: forklifts.map((item) =>
      soldForkliftIdSet.has(item.id) ? { ...item, status: "판매완료" } : item,
    ),
    soldForkliftIds,
    asRequests,
  } satisfies InventoryImportPreview;
}

export function downloadForkliftsExcel(forklifts: Forklift[]) {
  const rows = forklifts.map((item) => ({
    재고번호: item.id,
    차량번호: item.vehicleNumber,
    모델명: item.model,
    연식: item.year,
    가격: item.price,
    상태: item.status,
    메모: item.note,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "재고리스트");
  XLSX.writeFile(workbook, "중고지게차_재고리스트.xlsx");
}

export function downloadAllDataExcel(params: {
  forklifts: Forklift[];
  customers: Customer[];
  consultations: Consultation[];
  shipments: Shipment[];
  asList: AsRequest[];
}) {
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      params.forklifts.map((item) => ({
        재고번호: item.id,
        차량번호: item.vehicleNumber,
        모델명: item.model,
        연식: item.year,
        가격: item.price,
        상태: item.status,
        메모: item.note,
      })),
    ),
    "재고",
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      params.customers.map((item) => ({
        고객번호: item.id,
        고객명: item.name,
        연락처: item.phone,
        업체명: item.company,
        지역: item.region,
        관심모델: item.interestModel,
        상담상태: item.status,
        메모: item.memo,
      })),
    ),
    "고객",
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      params.consultations.map((item) => ({
        상담번호: item.id,
        고객번호: item.customerId,
        고객명: item.customerName,
        연락처: item.phone,
        업체명: item.company,
        관심차량번호: item.forkliftId,
        관심모델: item.model,
        상담일자: item.consultDate,
        진행상태: item.status,
        메모: item.note,
      })),
    ),
    "상담",
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      params.shipments.map((item) => ({
        출고번호: item.id,
        재고번호: item.forkliftId,
        차량번호: item.vehicleNumber,
        고객번호: item.customerId,
        고객명: item.customerName,
        출고일: item.shipmentDate,
        운송방법: item.transportMethod,
        담당자: item.manager,
        상태: item.status,
        특이사항: item.note,
      })),
    ),
    "출고",
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      params.asList.map((item) => ({
        "A/S번호": item.id,
        재고번호: item.forkliftId,
      })),
    ),
    "A/S",
  );

  XLSX.writeFile(workbook, "중고지게차_전체데이터.xlsx");
}
