import { Suspense } from "react";

import { LoginPanel } from "@/components/auth/login-panel";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPanel />
    </Suspense>
  );
}
