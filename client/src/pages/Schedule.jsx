// Schedule — "Ink & Impact": weekly airing calendar with day tabs
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSchedules } from "../hooks/useAnimeQueries";
import InkCover from "../components/ink/InkCover";
import InkEmptyState from "../components/ink/InkEmptyState";
import { InkRowSkeleton } from "../components/ink/InkSkeleton";
import { getDisplayTitle } from "../utils/title";

const DAYS = [
  { key: "monday", label: "MON" },
  { key: "tuesday", label: "TUE" },
  { key: "wednesday", label: "WED" },
  { key: "thursday", label: "THU" },
  { key: "friday", label: "FRI" },
  { key: "saturday", label: "SAT" },
  { key: "sunday", label: "SUN" },
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
      className="ink-card ink-press-redhov grid cursor-pointer grid-cols-[80px_1fr] items-stretch"
    >
      <div className="border-r-[3px] border-ink">
        <InkCover
          src={
            anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
          }
          alt={anime.title}
          className="h-full min-h-[96px] w-full"
        />
      </div>
      <div className="flex flex-col justify-between gap-2 p-4">
        <div>
          <div className="ink-display text-base tracking-[.5px] line-clamp-1 sm:text-lg">
            {getDisplayTitle(anime)}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] font-bold text-ink-mut3">
            {anime.type && (
              <span className="border-2 border-ink bg-ink-bg px-2 py-0.5 uppercase">
                {anime.type}
              </span>
            )}
            {anime.score && (
              <span className="border-2 border-ink bg-ink-bg px-2 py-0.5">
                ★ {anime.score}
              </span>
            )}
          </div>
        </div>
        {jstTime && (
          <div className="text-[12.5px] font-black uppercase tracking-[.5px]">
            <span className="text-ink-red">{jstTime} JST</span>
            {localTime && (
              <span className="ml-2 text-ink-mut3">({localTime} local)</span>
            )}
          </div>
        )}
      </div>
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

  const { data, isLoading, error, refetch } = useSchedules(activeDay);
  const entries = data?.data || [];

  return (
    <div className="animate-popIn px-6 pb-16 pt-10 md:px-[72px]">
      <h1 className="ink-display m-0 mb-2 text-4xl md:text-[44px]">
        Airing <span className="text-ink-red">Schedule</span>
      </h1>
      <p className="mb-6 text-[13.5px] font-medium text-ink-mut3">
        Never miss an episode — broadcast times in JST and your local time
      </p>

      {/* Day tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {DAYS.map((day) => {
          const isActive = activeDay === day.key;
          const isToday = day.key === todayKey;
          return (
            <button
              key={day.key}
              onClick={() => setSearchParams({ day: day.key })}
              className={`ink-btn relative px-4 py-2.5 text-xs transition-all duration-150 hover:bg-ink-red hover:text-ink-paper ${
                isActive ? "bg-ink text-ink-paper" : "bg-ink-paper text-ink"
              }`}
            >
              {day.label}
              {isToday && !isActive && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 border-2 border-ink bg-ink-red" />
              )}
            </button>
          );
        })}
      </div>

      {error ? (
        <InkEmptyState
          shout="SIGNAL LOST!!"
          sub={error?.message || "Could not load the schedule."}
          ctaLabel="Retry"
          ctaTo="/schedule"
        />
      ) : isLoading ? (
        <InkRowSkeleton count={6} />
      ) : entries.length === 0 ? (
        <InkEmptyState
          shout="NOTHING AIRING!!"
          sub="Try another day of the week."
          redShadow={false}
          rotate={2}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
