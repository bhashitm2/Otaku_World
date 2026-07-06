// Watchlist — "Ink & Impact": horizontal queue rows with status filters
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../hooks/useWatchlist";
import { useAuth } from "../hooks/useAuth";
import { WATCH_STATUS_OPTIONS } from "../services/firestoreService";
import InkCover from "../components/ink/InkCover";
import InkEmptyState from "../components/ink/InkEmptyState";
import { InkRowSkeleton } from "../components/ink/InkSkeleton";

const STATUS_LABEL = WATCH_STATUS_OPTIONS.reduce((acc, o) => {
  acc[o.value] = o.label.toUpperCase();
  return acc;
}, {});

const WatchRow = ({ item, onOpen, onRemove }) => (
  <div className="ink-card ink-shadow-sm grid grid-cols-[72px_1fr_auto] items-stretch transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_#f2efe6]">
    <div className="border-r-[3px] border-ink">
      <InkCover
        src={item.image}
        alt={item.title}
        className="h-full min-h-[84px] w-full"
      />
    </div>
    <div
      onClick={onOpen}
      className="flex cursor-pointer flex-col justify-center gap-1.5 px-4 py-3.5 sm:px-5"
    >
      <div className="ink-display text-base tracking-[.5px] line-clamp-1 sm:text-lg">
        {item.title}
      </div>
      <div className="text-[11.5px] font-bold text-ink-mut3">
        {item.episodes ? `EP ${item.episodes}` : "EP —"}
        {item.status ? ` · ${item.status}` : ""}
        {item.score ? ` · ★ ${item.score}` : ""}
      </div>
    </div>
    <div className="flex items-center gap-2.5 px-3 sm:px-4">
      <span className="hidden border-[3px] border-ink bg-ink-bg px-2.5 py-1.5 text-[10.5px] font-black tracking-[1px] sm:inline-block">
        {STATUS_LABEL[item.watchStatus] || "PLANNED"}
      </span>
      <button
        onClick={onRemove}
        aria-label="Remove from watchlist"
        className="flex h-9 w-9 flex-none cursor-pointer items-center justify-center border-[3px] border-ink bg-ink font-body text-[15px] font-black text-ink-paper transition-colors hover:bg-ink-red"
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
      <div className="px-6 pb-16 pt-10 md:px-[72px]">
        <InkEmptyState
          shout="SIGN IN FIRST!!"
          sub="Log in to build your backlog."
          ctaLabel="Login →"
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
    <div className="animate-popIn px-6 pb-16 pt-10 md:px-[72px]">
      <h1 className="ink-display m-0 mb-2 text-4xl md:text-[44px]">
        My <span className="text-ink-red">Watchlist</span>
      </h1>
      <p className="mb-6 text-[13.5px] font-medium text-ink-mut3">
        {totalWatchlist} series queued — tap + anywhere to queue more
      </p>

      {/* Status filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveTab(f.id)}
            className={`ink-btn px-4 py-2 text-xs transition-all duration-150 hover:bg-ink-red hover:text-ink-paper ${
              activeTab === f.id
                ? "bg-ink text-ink-paper"
                : "bg-ink-paper text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? (
        <InkEmptyState shout="SIGNAL LOST!!" sub={error} />
      ) : loading && watchlist.length === 0 ? (
        <InkRowSkeleton count={4} />
      ) : displayData.length === 0 ? (
        <InkEmptyState
          shout="NOTHING QUEUED YET!!"
          sub="A true otaku always has a backlog."
          ctaLabel="Build the backlog →"
          ctaTo="/anime"
          redShadow={false}
          rotate={2}
        />
      ) : (
        <div className="flex max-w-4xl flex-col gap-4">
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
