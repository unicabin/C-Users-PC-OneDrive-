import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { Container } from "@/components/ui/container";
import { getServerUser } from "@/lib/auth-server";

export default async function LoginPage() {
  const user = await getServerUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="py-14 sm:py-16">
      <Container>
        <section className="mx-auto max-w-xl panel overflow-hidden">
          <div className="border-b border-line bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_34%),linear-gradient(135deg,#f7fbff_0%,#ffffff_62%,#eef4ff_100%)] px-6 py-8 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue">
              Used Forklift Management
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              관리자 로그인
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              로그인 후에만 재고, 고객, 상담, 출고 데이터를 조회하고 수정할 수 있습니다.
            </p>
          </div>

          <div className="px-6 py-8 sm:px-8">
            <LoginForm />
          </div>
        </section>
      </Container>
    </div>
  );
}
