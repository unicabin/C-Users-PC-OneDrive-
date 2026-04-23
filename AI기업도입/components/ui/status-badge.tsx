import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  variant?: "neutral" | "success" | "warning" | "danger";
};

const styles = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
};

export function StatusBadge({
  label,
  variant = "neutral",
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles[variant],
      )}
    >
      {label}
    </span>
  );
}
