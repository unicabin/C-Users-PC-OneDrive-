import { FormEvent } from "react";
import { DataBadge } from "@/components/used-forklift/data-badge";
import { SectionCard } from "@/components/used-forklift/section-card";
import { getShipmentStatusTone, nextShipmentStatus } from "@/lib/used-forklift-utils";
import { Customer, Forklift, FormChangeEvent, Shipment } from "@/types/used-forklift";

type ShipmentSectionProps = {
  shipmentForm: Shipment;
  filteredShipments: Shipment[];
  customers: Customer[];
  forklifts: Forklift[];
  shipmentSearch: string;
  shipmentStatusFilter: string;
  onShipmentFormChange: (event: FormChangeEvent) => void;
  onShipmentSearchChange: (value: string) => void;
  onShipmentStatusFilterChange: (value: string) => void;
  onAddShipment: (event: FormEvent<HTMLFormElement>) => void;
  onShipmentStatusChange: (shipmentId: string) => void;
};

function FieldLabel({ children }: { children: string }) {
  return <label className="text-sm font-semibold text-slate-700">{children}</label>;
}

export function ShipmentSection({
  shipmentForm,
  filteredShipments,
  customers,
  forklifts,
  shipmentSearch,
  shipmentStatusFilter,
  onShipmentFormChange,
  onShipmentSearchChange,
  onShipmentStatusFilterChange,
  onAddShipment,
  onShipmentStatusChange,
}: ShipmentSectionProps) {
  return (
    <>
      <SectionCard
        title="출고 등록"
        description="차량 선택 시 재고와 연결되고, 등록과 동시에 재고 상태가 판매완료로 반영됩니다."
        badge={`총 ${filteredShipments.length}건`}
      >
        <div className="mb-6 grid gap-3 md:grid-cols-[1.2fr_0.9fr_0.7fr]">
          <input
            value={shipmentSearch}
            onChange={(event) => onShipmentSearchChange(event.target.value)}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue"
            placeholder="출고번호 / 차량번호 / 고객명 검색"
          />
          <select
            value={shipmentStatusFilter}
            onChange={(event) => onShipmentStatusFilterChange(event.target.value)}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue"
          >
            <option value="전체">전체</option>
            <option value="준비중">준비중</option>
            <option value="출고완료">출고완료</option>
            <option value="인도완료">인도완료</option>
          </select>
        </div>

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={onAddShipment}>
          <div className="space-y-2">
            <FieldLabel>출고번호</FieldLabel>
            <input
              name="id"
              value={shipmentForm.id}
              onChange={onShipmentFormChange}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue"
              placeholder="예: SHIP-2026032401"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>차량 선택</FieldLabel>
            <select
              name="forkliftId"
              value={shipmentForm.forkliftId}
              onChange={onShipmentFormChange}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue"
            >
              <option value="">선택</option>
              {forklifts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.vehicleNumber} / {item.model} / {item.status}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <FieldLabel>고객 선택</FieldLabel>
            <select
              name="customerId"
              value={shipmentForm.customerId}
              onChange={onShipmentFormChange}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue"
            >
              <option value="">직접 입력</option>
              {customers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} / {item.company}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <FieldLabel>고객명</FieldLabel>
            <input
              name="customerName"
              value={shipmentForm.customerName}
              onChange={onShipmentFormChange}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue"
              placeholder="고객명을 입력하세요."
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>차량번호</FieldLabel>
            <input
              name="vehicleNumber"
              value={shipmentForm.vehicleNumber}
              onChange={onShipmentFormChange}
              className="w-full rounded-2xl border border-line bg-slate-50 px-4 py-3 text-slate-600 outline-none"
              placeholder="차량 선택 시 자동 반영"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>출고일</FieldLabel>
            <input
              type="date"
              name="shipmentDate"
              value={shipmentForm.shipmentDate}
              onChange={onShipmentFormChange}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>운송방법</FieldLabel>
            <input
              name="transportMethod"
              value={shipmentForm.transportMethod}
              onChange={onShipmentFormChange}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue"
              placeholder="예: 직송"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>담당자</FieldLabel>
            <input
              name="manager"
              value={shipmentForm.manager}
              onChange={onShipmentFormChange}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue"
              placeholder="예: 김대리"
            />
          </div>
          <div className="space-y-2 md:col-span-2 xl:col-span-4">
            <FieldLabel>특이사항</FieldLabel>
            <textarea
              name="note"
              value={shipmentForm.note}
              onChange={onShipmentFormChange}
              rows={3}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue"
              placeholder="출고 관련 메모를 입력하세요."
            />
          </div>
          <div>
            <button type="submit" className="primary-button">
              출고 등록
            </button>
          </div>
        </form>
      </SectionCard>

      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-navy">출고 리스트</h2>
            <p className="mt-1 text-sm text-slate-500">
              최신 등록건이 위에 오도록 유지하고, 관리 컬럼에서 단계별 상태 변경이 가능합니다.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">출고번호</th>
                <th className="px-4 py-3 text-left font-semibold">차량번호</th>
                <th className="px-4 py-3 text-left font-semibold">고객명</th>
                <th className="px-4 py-3 text-left font-semibold">출고일</th>
                <th className="px-4 py-3 text-left font-semibold">운송방법</th>
                <th className="px-4 py-3 text-left font-semibold">담당자</th>
                <th className="px-4 py-3 text-left font-semibold">상태</th>
                <th className="px-4 py-3 text-left font-semibold">특이사항</th>
                <th className="px-4 py-3 text-left font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((item) => {
                const nextStatus = nextShipmentStatus(item.status);
                return (
                  <tr key={item.id} className="border-t border-line/80 align-top">
                    <td className="px-4 py-4 font-semibold text-navy">{item.id}</td>
                    <td className="px-4 py-4">{item.vehicleNumber}</td>
                    <td className="px-4 py-4">{item.customerName}</td>
                    <td className="px-4 py-4">{item.shipmentDate || "-"}</td>
                    <td className="px-4 py-4">{item.transportMethod || "-"}</td>
                    <td className="px-4 py-4">{item.manager || "-"}</td>
                    <td className="px-4 py-4">
                      <DataBadge tone={getShipmentStatusTone(item.status)}>
                        {item.status}
                      </DataBadge>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{item.note || "-"}</td>
                    <td className="px-4 py-4">
                      {nextStatus ? (
                        <button
                          type="button"
                          onClick={() => onShipmentStatusChange(item.id)}
                          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                            item.status === "준비중"
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-emerald-600 text-white hover:bg-emerald-700"
                          }`}
                        >
                          {item.status === "준비중"
                            ? "준비중 → 출고완료"
                            : "출고완료 → 인도완료"}
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600">완료</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
