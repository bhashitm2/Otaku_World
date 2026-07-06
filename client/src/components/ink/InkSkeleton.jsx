// src/components/ink/InkSkeleton.jsx - striped loading shells
export const InkCardSkeleton = () => (
  <div className="ink-card ink-shadow animate-pulse">
    <div className="ink-stripes h-60 border-b-[3px] border-ink" />
    <div className="space-y-2 p-3 pb-4">
      <div className="h-4 w-3/4 bg-ink-stripe2" />
      <div className="h-3 w-1/2 bg-ink-stripe2" />
    </div>
  </div>
);

export const InkGridSkeleton = ({ count = 8, columnsClass }) => (
  <div
    className={
      columnsClass ||
      "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }
  >
    {[...Array(count)].map((_, i) => (
      <InkCardSkeleton key={i} />
    ))}
  </div>
);

export const InkRowSkeleton = ({ count = 5 }) => (
  <div className="flex max-w-4xl flex-col gap-4">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="ink-card ink-shadow-sm grid animate-pulse grid-cols-[84px_1fr] items-stretch"
      >
        <div className="ink-stripes min-h-[84px] border-r-[3px] border-ink" />
        <div className="space-y-2 self-center p-4">
          <div className="h-4 w-1/2 bg-ink-stripe2" />
          <div className="h-3 w-1/3 bg-ink-stripe2" />
        </div>
      </div>
    ))}
  </div>
);
