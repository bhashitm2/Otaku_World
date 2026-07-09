// Nova button — rounded, hairline or filled, DM Sans bold. `solid` is the
// gold CTA (optional glow — one per screen), `ghost` is a glass outline,
// `subtle` is a raised surface. Pass as={Link} with `to` for router links.
const VARIANTS = {
  solid: "bg-gold text-bg",
  ghost: "border border-line-strong bg-white/10 text-text backdrop-blur-[8px]",
  subtle: "border border-line-strong bg-surface-2 text-text",
};

const SIZES = {
  sm: "rounded-sm px-4 py-[9px] text-[13px]",
  md: "rounded px-6 py-3 text-[14.5px]",
  lg: "rounded px-[30px] py-[13px] text-[15px]",
};

export function Button({
  children,
  variant = "solid",
  size = "md",
  glow = false,
  block = false,
  disabled = false,
  as: Tag = "button",
  className = "",
  ...props
}) {
  return (
    <Tag
      disabled={Tag === "button" ? disabled : undefined}
      className={`${block ? "flex w-full" : "inline-flex"} items-center justify-center gap-[9px] font-body font-bold leading-none no-underline transition-transform duration-fast active:scale-[0.97] ${VARIANTS[variant]} ${SIZES[size]} ${glow && variant === "solid" ? "shadow-glow" : ""} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Button;
