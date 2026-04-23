import { ChangeEvent, FormEvent, RefObject } from "react";
import { DataBadge } from "@/components/used-forklift/data-badge";
import { SectionCard } from "@/components/used-forklift/section-card";
import { formatPrice, getForkliftStatusTone } from "@/lib/used-forklift-utils";
import { AsRequest, Forklift, FormChangeEvent, InventoryImportPreview } from "@/types/used-forklift";

type InventorySectionProps = {
  forkliftForm: Forklift;
  forklifts: Forklift[];
  filteredForklifts: Forklift[];
  asList: AsRequest[];
  canDeleteForklift?: boolean;
  importPreview: InventoryImportPreview | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  inventorySearch: string;
  inventoryStatusFilter: string;
  onForkliftFormChange: (event: FormChangeEvent) => void;
  onAddForklift: (event: FormEvent<HTMLFormElement>) => void;
  onUploadChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDownloadExcel: () => void;
  onDownloadAllExcel: () => void;
  onApplyImportPreview: () => void;
  onCancelImportPreview: () => void;
  onInventorySearchChange: (value: string) => void;
  onInventoryStatusFilterChange: (value: string) => void;
  onUpdateForkliftStatus: (forkliftId: string, status: Forklift["status"]) => void;
  onDeleteForklift: (forkliftId: string) => void;
};

function FieldLabel({ children }: { children: string }) {
  return <label className="text-sm font-semibold text-slate-700">{children}</label>;
}

export function InventorySection({
  forkliftForm,
  forklifts,
  filteredForklifts,
  asList,
  canDeleteForklift = true,
  importPreview,
  fileInputRef,
  inventorySearch,
  inventoryStatusFilter,
  onForkliftFormChange,
  onAddForklift,
  onUploadChange,
  onDownloadExcel,
  onDownloadAllExcel,
  onApplyImportPreview,
  onCancelImportPreview,
  onInventorySearchChange,
  onInventoryStatusFilterChange,
  onUpdateForkliftStatus,
  onDeleteForklift,
}: InventorySectionProps) {
  return (
    <>
      <SectionCard
        title="재고 등록"
        description="현재 재고 흐름과 상태를 실무형 화면에 맞춰 빠르게 입력합니다."
        badge={`총 ${forklifts.length}대`}
      >
        {importPreview ? (
          <div className="mb-6 rounded-3xl border border-blue/20 bg-blue/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-blue">엑셀 미리보기</p>
                <p className="mt-1 text-sm text-slate-600">
                  {importPreview.sheetName} 시트 기준으로 재고 {importPreview.forklifts.length}건,
                  판매 반영 {importPreview.soldForkliftIds.length}건, A/S {importPreview.asRequests.length}건을 감지했습니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={onApplyImportPreview} className="primary-button">
                  가져오기 적용
                </button>
                <button type="button" onClick={onCancelImportPreview} className="secondary-button">
                  취소
                </button>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/80 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">재고번호</th>
                    <th className="px-4 py-3 text-left font-semibold">차량번호</th>
                    <th className="px-4 py-3 text-left font-semibold">모델명</th>
                    <th className="px-4 py-3 text-left font-semibold">연식</th>
                    <th className="px-4 py-3 text-left font-semibold">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {importPreview.forklifts.slice(0, 8).map((item) => (
                    <tr key={item.id} className="border-t border-blue/10">
                      <td className="px-4 py-3 font-semibold text-navy">{item.id}</td>
                      <td className="px-4 py-3 text-slate-600">{item.vehicleNumber}</td>
                      <td className="px-4 py-3 text-slate-600">{item.model}</td>
                      <td className="px-4 py-3 text-slate-600">{item.year || "-"}</td>
                      <td className="px-4 py-3">
                        <DataBadge tone={getForkliftStatusTone(item.status)}>{item.status}</DataBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <div className="mb-6 flex flex-wrap gap-3">
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={onUploadChange} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="secondary-button">
            엑셀 업로드
          </button>
          <button type="button" onClick={onDownloadExcel} className="rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-navy transition hover:border-blue hover:text-blue">
            엑셀 다운로드
          </button>
          <button type="button" onClick={onDownloadAllExcel} className="rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-navy transition hover:border-blue hover:text-blue">
            전체 데이터 내보내기
          </button>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
          <input value={inventorySearch} onChange={(event) => onInventorySearchChange(event.target.value)} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="재고번호 / 차량번호 / 모델명 검색" />
          <select value={inventoryStatusFilter} onChange={(event) => onInventoryStatusFilterChange(event.target.value)} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue">
            <option value="전체">전체</option>
            <option value="판매중">판매중</option>
            <option value="정비중">정비중</option>
            <option value="판매완료">판매완료</option>
          </select>
        </div>

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={onAddForklift}>
          <div className="space-y-2">
            <FieldLabel>재고번호</FieldLabel>
            <input name="id" value={forkliftForm.id} onChange={onForkliftFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="예: FLT-004" />
          </div>
          <div className="space-y-2">
            <FieldLabel>차량번호</FieldLabel>
            <input name="vehicleNumber" value={forkliftForm.vehicleNumber} onChange={onForkliftFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="예: UT-104" />
          </div>
          <div className="space-y-2">
            <FieldLabel>모델명</FieldLabel>
            <input name="model" value={forkliftForm.model} onChange={onForkliftFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="예: 도요타 2톤" />
          </div>
          <div className="space-y-2">
            <FieldLabel>연식</FieldLabel>
            <input name="year" value={forkliftForm.year} onChange={onForkliftFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="예: 2022" />
          </div>
          <div className="space-y-2">
            <FieldLabel>가격</FieldLabel>
            <input name="price" value={forkliftForm.price} onChange={onForkliftFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="예: 21000000" />
          </div>
          <div className="space-y-2">
            <FieldLabel>상태</FieldLabel>
            <select name="status" value={forkliftForm.status} onChange={onForkliftFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue">
              <option value="판매중">판매중</option>
              <option value="정비중">정비중</option>
              <option value="판매완료">판매완료</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2 xl:col-span-3">
            <FieldLabel>메모</FieldLabel>
            <textarea name="note" value={forkliftForm.note} onChange={onForkliftFormChange} rows={3} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="재고 비고를 입력하세요" />
          </div>
          <div>
            <button type="submit" className="primary-button">
              재고 등록
            </button>
          </div>
        </form>
      </SectionCard>

      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-navy">재고 리스트</h2>
            <p className="mt-1 text-sm text-slate-500">출고 등록과 연동되어 판매완료 상태가 즉시 반영됩니다.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">재고번호</th>
                <th className="px-4 py-3 text-left font-semibold">차량번호</th>
                <th className="px-4 py-3 text-left font-semibold">모델명</th>
                <th className="px-4 py-3 text-left font-semibold">연식</th>
                <th className="px-4 py-3 text-left font-semibold">가격</th>
                <th className="px-4 py-3 text-left font-semibold">상태</th>
                <th className="px-4 py-3 text-left font-semibold">메모</th>
                <th className="px-4 py-3 text-left font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredForklifts.map((item) => (
                <tr key={item.id} className="border-t border-line/80 align-top">
                  <td className="px-4 py-4 font-semibold text-navy">{item.id}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <span>{item.vehicleNumber}</span>
                      <span className="text-xs text-slate-400">A/S {asList.filter((request) => request.forkliftId === item.id).length}회</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{item.model}</td>
                  <td className="px-4 py-4 text-slate-600">{item.year}</td>
                  <td className="px-4 py-4 text-slate-600">{formatPrice(item.price)}</td>
                  <td className="px-4 py-4">
                    <DataBadge tone={getForkliftStatusTone(item.status)}>{item.status}</DataBadge>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{item.note || "-"}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => onUpdateForkliftStatus(item.id, "판매중")} className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue hover:text-blue">
                        판매중
                      </button>
                      <button type="button" onClick={() => onUpdateForkliftStatus(item.id, "정비중")} className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue hover:text-blue">
                        정비중
                      </button>
                      {canDeleteForklift ? (
                        <button type="button" onClick={() => onDeleteForklift(item.id)} className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50">
                          삭제
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
