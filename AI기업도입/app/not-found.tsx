import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <SearchX className="h-7 w-7 text-slate-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">페이지를 찾을 수 없습니다</h2>
        <p className="mt-2 text-sm text-slate-500">
          요청한 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
      >
        <Home className="h-4 w-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
