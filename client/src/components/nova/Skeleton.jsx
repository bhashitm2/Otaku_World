// Nova skeleton — shimmering placeholder shaped like the content it stands
// in for. `poster` mirrors a MediaCard tile; `row` mirrors a list row.
// GridSkeleton / RowSkeleton render several while data streams in.
export function Skeleton({ variant = "poster", className = "" }) {
  if (variant === "row") {
    return (
      <div
        className={`grid grid-cols-[60px_1fr_auto] items-center gap-5 rounded-lg border border-line bg-surface p-3 ${className}`}
      >
        <div className="ow-shimmer aspect-[2/3] rounded-sm" />
        <div className="flex flex-col gap-2">
          <div className="ow-shimmer h-[15px] w-[55%] rounded-[6px]" />
          <div className="ow-shimmer h-3 w-1/3 rounded-[6px]" />
        </div>
        <div className="ow-shimmer h-3.5 w-12 rounded-[6px]" />
      </div>
    );
  }
  return (
    <div className={className}>
      <div className="ow-shimmer aspect-[2/3] rounded-md" />
      <div className="mt-2.5 flex flex-col gap-[7px]">
        <div className="ow-shimmer h-3.5 w-4/5 rounded-[6px]" />
        <div className="ow-shimmer h-[11px] w-1/2 rounded-[6px]" />
      </div>
    </div>
  );
}

export const GridSkeleton = ({ count = 8, columnsClass }) => (
  <div
    className={
      columnsClass ||
      "grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[26px] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
    }
  >
    {[...Array(count)].map((_, i) => (
      <Skeleton key={i} />
    ))}
  </div>
);

export const RowSkeleton = ({ count = 5 }) => (
  <div className="flex max-w-[900px] flex-col gap-3.5">
    {[...Array(count)].map((_, i) => (
      <Skeleton key={i} variant="row" />
    ))}
  </div>
);

export default Skeleton;
