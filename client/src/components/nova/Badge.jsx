// Nova badge — compact rounded labels used on and around cards:
// score marks, live "Airing" pills, genre pills, age ratings.
const VARIANTS = {
  pill: "bg-surface-2 text-text",
  accent: "bg-gold text-bg",
  live: "bg-gold-dim text-gold",
  score: "bg-[rgba(11,11,15,0.82)] font-mono font-bold text-gold backdrop-blur-[4px]",
  outline: "border border-line-strong text-muted",
};

const SIZES = {
  sm: "px-2 py-[3px] text-[11px]",
  md: "px-3 py-[5px] text-[12.5px]",
  lg: "px-3.5 py-1.5 text-[13.5px]",
};

export function Badge({ children, variant = "pill", size = "md", className = "", ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-[5px] whitespace-nowrap rounded-pill font-body font-semibold leading-[1.1] ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
