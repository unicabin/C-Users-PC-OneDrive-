import { FormEvent } from "react";
import { DataBadge } from "@/components/used-forklift/data-badge";
import { SectionCard } from "@/components/used-forklift/section-card";
import { getConsultTone } from "@/lib/used-forklift-utils";
import { Consultation, Customer, Forklift, FormChangeEvent } from "@/types/used-forklift";

type ConsultSectionProps = {
  consultationForm: Consultation;
  filteredConsultations: Consultation[];
  canDeleteConsultation?: boolean;
  customers: Customer[];
  forklifts: Forklift[];
  consultSearch: string;
  consultStatusFilter: string;
  consultQuickPendingOnly: boolean;
  onConsultationFormChange: (event: FormChangeEvent) => void;
  onConsultSearchChange: (value: string) => void;
  onConsultStatusFilterChange: (value: string) => void;
  onConsultQuickPendingToggle: () => void;
  onAddConsultation: (event: FormEvent<HTMLFormElement>) => void;
  onConsultToShipment: (consultation: Consultation) => void;
  onDeleteConsultation: (consultationId: string) => void;
};

function FieldLabel({ children }: { children: string }) {
  return <label className="text-sm font-semibold text-slate-700">{children}</label>;
}

export function ConsultSection({
  consultationForm,
  filteredConsultations,
  canDeleteConsultation = true,
  customers,
  forklifts,
  consultSearch,
  consultStatusFilter,
  consultQuickPendingOnly,
  onConsultationFormChange,
  onConsultSearchChange,
  onConsultStatusFilterChange,
  onConsultQuickPendingToggle,
  onAddConsultation,
  onConsultToShipment,
  onDeleteConsultation,
}: ConsultSectionProps) {
  return (
    <>
      <SectionCard
        title="상담 등록"
        description="고객 선택 시 이름과 연락처를 자동 반영하고, 계약예정 상담은 출고로 전환할 수 있습니다."
        badge={`총 ${filteredConsultations.length}건`}
      >
        <div className="mb-6 grid gap-3 md:grid-cols-[1.2fr_0.9fr_auto]">
          <input value={consultSearch} onChange={(event) => onConsultSearchChange(event.target.value)} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="고객명 / 연락처 / 업체명 / 관심모델 검색" />
          <select value={consultStatusFilter} onChange={(event) => onConsultStatusFilterChange(event.target.value)} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue">
            <option value="전체">전체</option>
            <option value="신규">신규</option>
            <option value="상담중">상담중</option>
            <option value="계약예정">계약예정</option>
            <option value="종료">종료</option>
          </select>
          <button
            type="button"
            onClick={onConsultQuickPendingToggle}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              consultQuickPendingOnly
                ? "bg-orange-500 text-white"
                : "border border-line bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600"
            }`}
          >
            계약예정만 보기
          </button>
        </div>

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={onAddConsultation}>
          <div className="space-y-2">
            <FieldLabel>상담번호</FieldLabel>
            <input name="id" value={consultationForm.id} onChange={onConsultationFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="예: CON-004" />
          </div>
          <div className="space-y-2">
            <FieldLabel>고객 선택</FieldLabel>
            <select name="customerId" value={consultationForm.customerId} onChange={onConsultationFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue">
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
            <input name="customerName" value={consultationForm.customerName} onChange={onConsultationFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="고객명을 입력하세요" />
          </div>
          <div className="space-y-2">
            <FieldLabel>연락처</FieldLabel>
            <input name="phone" value={consultationForm.phone} onChange={onConsultationFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="연락처를 입력하세요" />
          </div>
          <div className="space-y-2">
            <FieldLabel>업체명</FieldLabel>
            <input name="company" value={consultationForm.company} onChange={onConsultationFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="업체명을 입력하세요" />
          </div>
          <div className="space-y-2">
            <FieldLabel>관심차량번호</FieldLabel>
            <select name="forkliftId" value={consultationForm.forkliftId} onChange={onConsultationFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue">
              <option value="">선택</option>
              {forklifts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.vehicleNumber} / {item.model}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <FieldLabel>관심모델</FieldLabel>
            <input name="model" value={consultationForm.model} onChange={onConsultationFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="관심모델을 입력하세요" />
          </div>
          <div className="space-y-2">
            <FieldLabel>상담일자</FieldLabel>
            <input type="date" name="consultDate" value={consultationForm.consultDate} onChange={onConsultationFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" />
          </div>
          <div className="space-y-2">
            <FieldLabel>진행상태</FieldLabel>
            <select name="status" value={consultationForm.status} onChange={onConsultationFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue">
              <option value="신규">신규</option>
              <option value="상담중">상담중</option>
              <option value="계약예정">계약예정</option>
              <option value="종료">종료</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2 xl:col-span-4">
            <FieldLabel>메모</FieldLabel>
            <textarea name="note" value={consultationForm.note} onChange={onConsultationFormChange} rows={3} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="상담 메모를 입력하세요" />
          </div>
          <div>
            <button type="submit" className="primary-button">
              상담 등록
            </button>
          </div>
        </form>
      </SectionCard>

      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-navy">상담 리스트</h2>
            <p className="mt-1 text-sm text-slate-500">계약예정 또는 종료 상태의 상담은 출고 전환 버튼으로 바로 연결할 수 있습니다.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">상담번호</th>
                <th className="px-4 py-3 text-left font-semibold">고객명</th>
                <th className="px-4 py-3 text-left font-semibold">연락처</th>
                <th className="px-4 py-3 text-left font-semibold">업체명</th>
                <th className="px-4 py-3 text-left font-semibold">관심차량번호</th>
                <th className="px-4 py-3 text-left font-semibold">관심모델</th>
                <th className="px-4 py-3 text-left font-semibold">상담일자</th>
                <th className="px-4 py-3 text-left font-semibold">진행상태</th>
                <th className="px-4 py-3 text-left font-semibold">메모</th>
                <th className="px-4 py-3 text-left font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredConsultations.map((item) => {
                const canConvert = ["계약예정", "종료"].includes(item.status);
                const linkedForklift = forklifts.find((forklift) => forklift.id === item.forkliftId);

                return (
                  <tr key={item.id} className="border-t border-line/80 align-top">
                    <td className="px-4 py-4 font-semibold text-navy">{item.id}</td>
                    <td className="px-4 py-4">{item.customerName}</td>
                    <td className="px-4 py-4">{item.phone}</td>
                    <td className="px-4 py-4">{item.company || "-"}</td>
                    <td className="px-4 py-4">{linkedForklift?.vehicleNumber || "-"}</td>
                    <td className="px-4 py-4">{item.model || "-"}</td>
                    <td className="px-4 py-4">{item.consultDate || "-"}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <DataBadge tone={getConsultTone(item.status)}>{item.status}</DataBadge>
                        {item.convertedToShipment ? (
                          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                            출고연결됨
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{item.note || "-"}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {canConvert ? (
                          <button type="button" onClick={() => onConsultToShipment(item)} className="rounded-full border border-blue/20 bg-blue/5 px-3 py-1.5 text-xs font-semibold text-blue transition hover:bg-blue hover:text-white">
                            출고전환
                          </button>
                        ) : null}
                        {canDeleteConsultation ? (
                          <button type="button" onClick={() => onDeleteConsultation(item.id)} className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50">
                            삭제
                          </button>
                        ) : null}
                      </div>
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
