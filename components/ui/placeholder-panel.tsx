type PlaceholderPanelProps = {
  title: string;
  subtitle: string;
  label?: string;
  tags?: string[];
  className?: string;
  minHeightClassName?: string;
};

export function PlaceholderPanel({
  title,
  subtitle,
  label = "Image Slot",
  tags = ["UNITOP", "Placeholder"],
  className = "",
  minHeightClassName = "min-h-52"
}: PlaceholderPanelProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(145deg,#f7fbff_0%,#ffffff_42%,#eef4fb_100%)] p-5 shadow-panel ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,30,57,0.06),transparent_45%,rgba(37,99,235,0.04)_100%)]" />
      <div className="absolute right-5 top-5 h-24 w-24 rounded-full border border-white/60 bg-white/40 blur-2xl" />

      <div
        className={`relative flex h-full flex-col justify-between rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,248,253,0.86))] p-6 backdrop-blur-sm ${minHeightClassName}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-blue">
              {label}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-navy">{title}</h3>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-[20px] border border-white/80 bg-gradient-to-br from-navy to-blue text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
            UI
          </div>
        </div>

        <div className="mt-8 flex-1 rounded-[22px] border border-dashed border-slate-300/90 bg-[linear-gradient(135deg,rgba(15,30,57,0.03),rgba(37,99,235,0.08),rgba(255,255,255,0.5))] p-5">
          <div className="flex h-full flex-col justify-between gap-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 rounded-2xl bg-white/70 shadow-sm" />
              <div className="h-16 rounded-2xl bg-white/50 shadow-sm" />
              <div className="h-16 rounded-2xl bg-white/70 shadow-sm" />
            </div>
            <p className="text-sm leading-7 text-slate-600">{subtitle}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
