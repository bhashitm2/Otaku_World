// Watchlist — Nova: queue rows with status filters
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../hooks/useWatchlist";
import { useAuth } from "../hooks/useAuth";
import { WATCH_STATUS_OPTIONS } from "../services/firestoreService";
import { Cover, EmptyState, RowSkeleton, Badge } from "../components/nova";

const STATUS_LABEL = WATCH_STATUS_OPTIONS.reduce((acc, o) => {
  acc[o.value] = o.label;
  return acc;
}, {});

const WatchRow = ({ item, onOpen, onRemove }) => (
  <div className="grid grid-cols-[60px_1fr_auto] items-center gap-4 rounded-lg border border-line bg-surface p-3 transition-colors duration-fast hover:bg-surface-2">
    <div
      onClick={onOpen}
      className="aspect-[2/3] cursor-pointer overflow-hidden rounded-sm"
    >
      <Cover src={item.image} alt={item.title} />
    </div>
    <div onClick={onOpen} className="min-w-0 cursor-pointer">
      <div className="font-display text-[15px] font-semibold text-text line-clamp-1">
        {item.title}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
        <span>{item.episodes ? `${item.episodes} ep` : "— ep"}</span>
        {item.score && (
          <span className="font-mono text-xs font-bold text-gold">
            ★ {item.score}
          </span>
        )}
        {item.status && <span className="line-clamp-1">{item.status}</span>}
      </div>
    </div>
    <div className="flex items-center gap-2.5 pr-1">
      <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
        {STATUS_LABEL[item.watchStatus] || "Planned"}
      </Badge>
      <button
        onClick={onRemove}
        aria-label="Remove from watchlist"
        className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full border border-line-strong text-[13px] text-muted transition-colors duration-fast hover:border-danger hover:text-danger"
      >
        ✕
      </button>
    </div>
  </div>
);

const Watchlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { watchlist, totalWatchlist, loading, error, toggleWatchlist } =
    useWatchlist();
  const [activeTab, setActiveTab] = useState("all");

  if (!user) {
    return (
      <div className="px-gutter pb-20 pt-10 lg:px-gutter-lg">
        <EmptyState
          title="Sign in to build your watchlist"
          sub="Your queue syncs across every device once you're signed in."
          ctaLabel="Sign in"
          ctaTo="/login"
        />
      </div>
    );
  }

  const filters = [
    { id: "all", label: "All" },
    ...WATCH_STATUS_OPTIONS.map((o) => ({ id: o.value, label: o.label })),
  ];

  const displayData =
    activeTab === "all"
      ? watchlist
      : watchlist.filter((item) => item.watchStatus === activeTab);

  return (
    <div className="px-gutter pb-20 pt-10 lg:px-gutter-lg">
      <h1 className="m-0 mb-2 font-display text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
        My watchlist
      </h1>
      <p className="mb-6 text-[14.5px] text-muted">
        {totalWatchlist} titles queued — tap ＋ anywhere to add more
      </p>

      {/* Status filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveTab(f.id)}
            className={`rounded-pill border px-4 py-2 font-body text-[13px] font-medium transition-colors duration-fast ${
              activeTab === f.id
                ? "border-gold bg-gold text-bg"
                : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-text"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? (
        <EmptyState glyph="⚠" title="Couldn't load your watchlist" sub={error} />
      ) : loading && watchlist.length === 0 ? (
        <RowSkeleton count={4} />
      ) : displayData.length === 0 ? (
        <EmptyState
          title="Your watchlist is empty"
          sub="Every great backlog starts somewhere."
          ctaLabel="Browse anime"
          ctaTo="/anime"
        />
      ) : (
        <div className="flex max-w-[900px] flex-col gap-3.5">
          {displayData.map((item) => (
            <WatchRow
              key={`${item.type}-${item.itemId}`}
              item={item}
              onOpen={() =>
                navigate(`/${item.type === "manga" ? "manga" : "anime"}/${item.itemId}`)
              }
              onRemove={() =>
                toggleWatchlist({
                  mal_id: item.itemId,
                  type: item.type,
                  title: item.title,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
