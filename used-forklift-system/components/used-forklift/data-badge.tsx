import { ReactNode } from "react";

type DataBadgeProps = {
  tone: string;
  children: ReactNode;
};

export function DataBadge({ tone, children }: DataBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      {children}
    </span>
  );
}
