// Nova loader — a calm gold ring spinner with an optional label. Pass
// `fullscreen` to center it on the dark stage for route-level loading.
const SIZES = {
  sm: "h-[22px] w-[22px] border-2",
  md: "h-[34px] w-[34px] border-[3px]",
  lg: "h-12 w-12 border-4",
};

export function Loader({ label, size = "md", fullscreen = false, className = "" }) {
  const ring = (
    <div className="inline-flex flex-col items-center gap-3.5">
      <span
        className={`block animate-ow-spin rounded-full border-surface-3 border-t-gold ${SIZES[size]}`}
      />
      {label && (
        <span className="font-body text-[13px] font-medium text-muted">{label}</span>
      )}
    </div>
  );

  if (!fullscreen) return <div className={className}>{ring}</div>;
  return (
    <div className={`flex min-h-[60vh] w-full items-center justify-center bg-bg ${className}`}>
      {ring}
    </div>
  );
}

export default Loader;
