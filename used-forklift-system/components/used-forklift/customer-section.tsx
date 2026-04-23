import { FormEvent } from "react";
import { DataBadge } from "@/components/used-forklift/data-badge";
import { SectionCard } from "@/components/used-forklift/section-card";
import { getConsultTone } from "@/lib/used-forklift-utils";
import { Customer, FormChangeEvent } from "@/types/used-forklift";

type CustomerSectionProps = {
  customerForm: Customer;
  filteredCustomers: Customer[];
  canDeleteCustomer?: boolean;
  customerSearch: string;
  customerStatusFilter: string;
  customerRegionFilter: string;
  customerRegions: string[];
  onCustomerFormChange: (event: FormChangeEvent) => void;
  onCustomerSearchChange: (value: string) => void;
  onCustomerStatusFilterChange: (value: string) => void;
  onCustomerRegionFilterChange: (value: string) => void;
  onAddCustomer: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteCustomer: (customerId: string) => void;
};

function FieldLabel({ children }: { children: string }) {
  return <label className="text-sm font-semibold text-slate-700">{children}</label>;
}

export function CustomerSection({
  customerForm,
  filteredCustomers,
  canDeleteCustomer = true,
  customerSearch,
  customerStatusFilter,
  customerRegionFilter,
  customerRegions,
  onCustomerFormChange,
  onCustomerSearchChange,
  onCustomerStatusFilterChange,
  onCustomerRegionFilterChange,
  onAddCustomer,
  onDeleteCustomer,
}: CustomerSectionProps) {
  return (
    <>
      <SectionCard
        title="고객 등록"
        description="상담과 출고에서 사용할 수 있는 고객 기본 데이터를 관리합니다."
        badge={`총 ${filteredCustomers.length}명`}
      >
        <div className="mb-6 grid gap-3 md:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <input value={customerSearch} onChange={(event) => onCustomerSearchChange(event.target.value)} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="고객명 / 업체명 / 연락처 검색" />
          <select value={customerStatusFilter} onChange={(event) => onCustomerStatusFilterChange(event.target.value)} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue">
            <option value="전체">전체</option>
            <option value="신규">신규</option>
            <option value="상담중">상담중</option>
            <option value="계약예정">계약예정</option>
            <option value="종료">종료</option>
          </select>
          <select value={customerRegionFilter} onChange={(event) => onCustomerRegionFilterChange(event.target.value)} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue">
            <option value="전체">전체 지역</option>
            {customerRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={onAddCustomer}>
          {[
            ["id", "고객번호", "예: CUS-004"],
            ["name", "고객명", "고객명을 입력하세요"],
            ["phone", "연락처", "예: 010-0000-0000"],
            ["company", "업체명", "업체명을 입력하세요"],
            ["region", "지역", "예: 경기 김포"],
            ["interestModel", "관심모델", "관심모델을 입력하세요"],
          ].map(([name, label, placeholder]) => (
            <div key={name} className="space-y-2">
              <FieldLabel>{label}</FieldLabel>
              <input
                name={name}
                value={customerForm[name as keyof Customer] as string}
                onChange={onCustomerFormChange}
                className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue"
                placeholder={placeholder}
              />
            </div>
          ))}
          <div className="space-y-2">
            <FieldLabel>상담상태</FieldLabel>
            <select name="status" value={customerForm.status} onChange={onCustomerFormChange} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue">
              <option value="신규">신규</option>
              <option value="상담중">상담중</option>
              <option value="계약예정">계약예정</option>
              <option value="종료">종료</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2 xl:col-span-4">
            <FieldLabel>메모</FieldLabel>
            <textarea name="memo" value={customerForm.memo} onChange={onCustomerFormChange} rows={3} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-blue" placeholder="고객 특이사항을 입력하세요" />
          </div>
          <div>
            <button type="submit" className="primary-button">
              고객 등록
            </button>
          </div>
        </form>
      </SectionCard>

      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-navy">고객 리스트</h2>
            <p className="mt-1 text-sm text-slate-500">고객 선택 기반으로 상담 등록 시 이름과 연락처가 자동 반영됩니다.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">고객번호</th>
                <th className="px-4 py-3 text-left font-semibold">고객명</th>
                <th className="px-4 py-3 text-left font-semibold">연락처</th>
                <th className="px-4 py-3 text-left font-semibold">업체명</th>
                <th className="px-4 py-3 text-left font-semibold">지역</th>
                <th className="px-4 py-3 text-left font-semibold">관심모델</th>
                <th className="px-4 py-3 text-left font-semibold">상담상태</th>
                <th className="px-4 py-3 text-left font-semibold">메모</th>
                <th className="px-4 py-3 text-left font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((item) => (
                <tr key={item.id} className="border-t border-line/80 align-top">
                  <td className="px-4 py-4 font-semibold text-navy">{item.id}</td>
                  <td className="px-4 py-4">{item.name}</td>
                  <td className="px-4 py-4">{item.phone}</td>
                  <td className="px-4 py-4">{item.company || "-"}</td>
                  <td className="px-4 py-4">{item.region || "-"}</td>
                  <td className="px-4 py-4">{item.interestModel || "-"}</td>
                  <td className="px-4 py-4">
                    <DataBadge tone={getConsultTone(item.status)}>{item.status}</DataBadge>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{item.memo || "-"}</td>
                  <td className="px-4 py-4">
                    {canDeleteCustomer ? (
                      <button type="button" onClick={() => onDeleteCustomer(item.id)} className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50">
                        삭제
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">조회 전용</span>
                    )}
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
