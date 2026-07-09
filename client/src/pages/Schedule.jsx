// Schedule — Nova: weekly airing calendar with day chips
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSchedules } from "../hooks/useAnimeQueries";
import { Cover, EmptyState, RowSkeleton, Badge } from "../components/nova";
import { getDisplayTitle } from "../utils/title";

const DAYS = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

const getTodayKey = () => {
  const jsDay = new Date().getDay(); // 0 = Sunday
  return DAYS[(jsDay + 6) % 7].key;
};

// Convert a JST broadcast time ("HH:mm") to the viewer's local time
const toLocalTime = (jstTime) => {
  if (!jstTime) return null;
  const [hours, minutes] = jstTime.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;
  const now = new Date();
  const utcMillis = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    hours - 9, // JST is UTC+9, no DST
    minutes
  );
  return new Date(utcMillis).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ScheduleRow = ({ anime, onOpen }) => {
  const jstTime = anime.broadcast?.time;
  const localTime = toLocalTime(jstTime);

  return (
    <div
      onClick={onOpen}
      className="grid cursor-pointer grid-cols-[60px_1fr_auto] items-center gap-4 rounded-lg border border-line bg-surface p-3 transition-colors duration-fast hover:bg-surface-2"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-sm">
        <Cover
          src={
            anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
          }
          alt={getDisplayTitle(anime)}
        />
      </div>
      <div className="min-w-0">
        <div className="font-display text-[15px] font-semibold text-text line-clamp-1">
          {getDisplayTitle(anime)}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {anime.type && (
            <Badge variant="outline" size="sm">
              {anime.type}
            </Badge>
          )}
          {anime.score && (
            <span className="font-mono text-xs font-bold text-gold">
              ★ {anime.score}
            </span>
          )}
        </div>
      </div>
      {jstTime && (
        <div className="pr-1 text-right">
          <div className="font-mono text-[13.5px] font-bold text-gold">
            {jstTime} JST
          </div>
          {localTime && (
            <div className="mt-0.5 text-[11.5px] text-faint">
              {localTime} local
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Schedule = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dayParam = searchParams.get("day");
  const activeDay = DAYS.some((d) => d.key === dayParam)
    ? dayParam
    : getTodayKey();
  const todayKey = getTodayKey();

  const { data, isLoading, error } = useSchedules(activeDay);
  const entries = data?.data || [];

  return (
    <div className="px-gutter pb-20 pt-10 lg:px-gutter-lg">
      <h1 className="m-0 mb-2 font-display text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
        Airing schedule
      </h1>
      <p className="mb-6 text-[14.5px] text-muted">
        Weekly broadcast calendar — times in JST and your local zone
      </p>

      {/* Day chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        {DAYS.map((day) => {
          const isActive = activeDay === day.key;
          const isToday = day.key === todayKey;
          return (
            <button
              key={day.key}
              onClick={() => setSearchParams({ day: day.key })}
              className={`relative rounded-pill border px-4 py-2 font-body text-[13px] font-medium transition-colors duration-fast ${
                isActive
                  ? "border-gold bg-gold text-bg"
                  : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-text"
              }`}
            >
              {day.label}
              {isToday && !isActive && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      {error ? (
        <EmptyState
          glyph="⚠"
          title="Couldn't load the schedule"
          sub={error?.message || "The schedule is unreachable. Try again."}
          ctaLabel="Retry"
          ctaTo="/schedule"
        />
      ) : isLoading ? (
        <RowSkeleton count={6} />
      ) : entries.length === 0 ? (
        <EmptyState
          title="Nothing airing"
          sub="Try another day of the week."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          {entries.map((anime) => (
            <ScheduleRow
              key={anime.mal_id}
              anime={anime}
              onOpen={() => navigate(`/anime/${anime.mal_id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
