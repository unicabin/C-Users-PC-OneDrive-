import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

const fields = [
  { label: "이름", name: "name", type: "text", placeholder: "담당자 이름" },
  { label: "회사명", name: "company", type: "text", placeholder: "회사명" },
  { label: "연락처", name: "phone", type: "tel", placeholder: "연락 가능한 번호" },
  { label: "이메일", name: "email", type: "email", placeholder: "example@company.com" }
];

const contactInfo = [
  { title: "대표 문의", value: "sales@unitop.kr" },
  { title: "상담 가능 항목", value: "제품 문의 / 프로젝트 협의 / 바이어 대응" },
  { title: "응답 방향", value: "추후 이메일 연동 및 실제 접수 프로세스 연결 예정" }
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="프로젝트 문의와 제품 상담을 위한 신뢰감 있는 접점"
        description="실제 전송 기능은 아직 연결하지 않고, 추후 이메일 연동이나 API 접수를 붙이기 쉬운 형태로 UI를 정리했습니다. 처음 접속한 바이어나 고객이 보더라도 안정감 있게 느껴지는 문의 화면을 목표로 구성했습니다."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <form className="panel overflow-hidden">
              <div className="border-b border-line bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-8 py-8">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue">
                  Inquiry Form
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-navy">
                  UNITOP 문의 접수
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                  제품 상담, 프로젝트 검토, 도입 문의 등 필요한 내용을 남겨주시면
                  추후 실제 접수 기능과 연결하기 쉬운 구조로 확장할 수 있도록
                  설계된 UI입니다.
                </p>
              </div>

              <div className="px-8 py-8">
                <div className="rounded-[24px] border border-blue-100 bg-blue-50 px-5 py-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue">
                    Guide
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    기본 정보와 문의 목적을 남겨주시면, 추후 이메일 접수 또는
                    CRM/폼 연동으로 자연스럽게 확장할 수 있습니다.
                  </p>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {fields.map((field) => (
                    <label key={field.name} className="block">
                      <span className="text-sm font-medium text-slate-700">
                        {field.label}
                      </span>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="mt-3 w-full rounded-[20px] border border-line bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue focus:bg-white"
                      />
                    </label>
                  ))}
                </div>

                <label className="mt-6 block">
                  <span className="text-sm font-medium text-slate-700">문의내용</span>
                  <textarea
                    name="message"
                    rows={7}
                    placeholder="문의하실 내용을 입력해 주세요."
                    className="mt-3 w-full rounded-[24px] border border-line bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-blue focus:bg-white"
                  />
                </label>

                <label className="mt-6 flex items-start gap-3 rounded-[22px] border border-line bg-slate-50 px-4 py-4">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    className="mt-1 h-4 w-4 rounded border-line text-blue focus:ring-blue"
                  />
                  <span className="text-sm leading-7 text-slate-700">
                    문의 응대 및 후속 연락을 위한 개인정보 수집·이용에 동의합니다.
                    실제 저장 및 전송 기능은 아직 연결되지 않은 UI 단계입니다.
                  </span>
                </label>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm leading-7 text-slate-500">
                    제출 기능은 추후 이메일 연동 또는 서버 액션으로 연결할 수 있도록
                    구조화되어 있습니다.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full bg-[linear-gradient(135deg,#0f1e39,#2563eb)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.22)] transition hover:translate-y-[-1px] hover:shadow-[0_24px_50px_rgba(37,99,235,0.26)]"
                  >
                    문의 내용 제출
                  </button>
                </div>
              </div>
            </form>

            <div className="grid gap-6">
              <div className="panel p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue">
                  Contact Information
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-navy">
                  회사 연락처 정보 카드
                </h2>
                <div className="mt-6 grid gap-4">
                  {contactInfo.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-line bg-slate-50 px-5 py-5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        {item.title}
                      </p>
                      <p className="mt-3 text-base leading-7 text-navy">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <PlaceholderPanel
                label="Brand Slot"
                title="Factory / Office Placeholder"
                subtitle="추후 공장 전경, 사무실, 상담 이미지 등으로 교체할 수 있는 브랜드형 이미지 슬롯입니다."
                tags={["Factory", "Office", "Brand"]}
                minHeightClassName="min-h-72"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
