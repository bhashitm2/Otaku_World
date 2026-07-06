// Profile — "Ink & Impact": stat blocks + watchlist breakdown + recent faves
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import { getUserStats, WATCH_STATUS_OPTIONS } from "../services/firestoreService";
import InkAnimeCard from "../components/ink/InkAnimeCard";
import InkCharacterCard from "../components/ink/InkCharacterCard";

const StatBlock = ({ value, label }) => (
  <div className="ink-card ink-shadow-sm p-5 text-center">
    <div className="font-display text-[34px] text-ink-red">{value ?? 0}</div>
    <div className="mt-1 text-[10.5px] font-black uppercase tracking-[1px] text-ink-mut3">
      {label}
    </div>
  </div>
);

const toCardItem = (item) => ({
  mal_id: item.itemId,
  title: item.title,
  name: item.title,
  images: { jpg: { image_url: item.image, large_image_url: item.image } },
  image: item.image,
  score: item.score,
  status: item.status,
  genres: item.genres,
  episodes: item.episodes,
  chapters: item.chapters,
  type: item.type,
});

const Profile = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();

  const { data: statsResult, isLoading } = useQuery({
    queryKey: ["user-stats", user?.uid, favorites.length],
    queryFn: () => getUserStats(user.uid),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const stats = statsResult?.data;
  const recentFavorites = favorites.slice(0, 4);
  const watchTotal = stats?.totalWatchlist || 0;
  const statusCounts = {
    watching: stats?.watching || 0,
    completed: stats?.completed || 0,
    plan_to_watch: stats?.planToWatch || 0,
    on_hold: stats?.onHold || 0,
    dropped: stats?.dropped || 0,
  };

  return (
    <div className="animate-popIn">
      {/* User header — halftone strip */}
      <div className="ink-halftone border-b-4 border-ink bg-ink-paper px-6 py-12 md:px-[72px]">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name || "Profile"}
              className="h-24 w-24 border-[3px] border-ink object-cover ink-shadow"
            />
          ) : (
            <div className="ink-shadow flex h-24 w-24 items-center justify-center border-[3px] border-ink bg-ink-red font-display text-5xl text-ink-paper">
              {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="ink-display m-0 text-4xl md:text-5xl">
              {user?.name || "Otaku"}
            </h1>
            <p className="mt-1 text-sm font-bold text-ink-mut3">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-12 px-6 pb-16 pt-12 md:px-[72px]">
        {/* Stats */}
        <section>
          <h2 className="ink-display mb-6 text-[28px]">
            Your <span className="text-ink-red">stats</span>
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="ink-card ink-shadow-sm h-28 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <StatBlock value={stats?.totalFavorites} label="Favorites" />
              <StatBlock value={stats?.totalWatchlist} label="Watchlist" />
              <StatBlock value={stats?.favoriteAnime} label="Fave Anime" />
              <StatBlock value={stats?.favoriteManga} label="Fave Manga" />
              <StatBlock
                value={stats?.favoriteCharacters}
                label="Characters"
              />
              <StatBlock value={stats?.completed} label="Completed" />
            </div>
          )}
        </section>

        {/* Watchlist breakdown */}
        {watchTotal > 0 && (
          <section>
            <h2 className="ink-display mb-6 text-[28px]">
              Watchlist <span className="text-ink-red">breakdown</span>
            </h2>
            <div className="ink-card ink-shadow space-y-4 p-6">
              {WATCH_STATUS_OPTIONS.map((status) => {
                const count = statusCounts[status.value] || 0;
                const percent = watchTotal
                  ? Math.round((count / watchTotal) * 100)
                  : 0;
                return (
                  <div key={status.value}>
                    <div className="mb-1 flex justify-between text-xs font-black uppercase tracking-[1px]">
                      <span>{status.label}</span>
                      <span className="text-ink-mut3">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-3.5 border-[3px] border-ink bg-ink-bg">
                      <div
                        className="h-full bg-ink-red transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recent favorites */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="ink-display text-[28px]">
              Recent <span className="text-ink-red">favorites</span>
            </h2>
            {favorites.length > 0 && (
              <Link
                to="/favorites"
                className="border-b-[3px] border-ink-red text-xs font-black uppercase tracking-[1px] text-ink"
              >
                View all →
              </Link>
            )}
          </div>
          {recentFavorites.length === 0 ? (
            <div className="ink-card ink-shadow p-10 text-center">
              <p className="mb-6 text-sm font-bold text-ink-mut3">
                You haven't favorited anything yet.
              </p>
              <Link
                to="/anime"
                className="ink-btn ink-press ink-sh-red inline-block bg-ink px-8 py-3.5 text-sm text-ink-paper"
              >
                Discover Anime →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {recentFavorites.map((fav) => {
                const cardItem = toCardItem(fav);
                if (fav.type === "character") {
                  return (
                    <InkCharacterCard key={fav.id} character={cardItem} />
                  );
                }
                return (
                  <InkAnimeCard
                    key={fav.id}
                    anime={cardItem}
                    mediaType={fav.type === "manga" ? "manga" : "anime"}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* For You CTA */}
        <section className="ink-card ink-shadow-red p-10 text-center">
          <h2 className="ink-display text-[28px]">
            Picks made <span className="text-ink-red">for you</span>
          </h2>
          <p className="mx-auto mb-6 mt-3 max-w-xl text-sm font-bold text-ink-mut3">
            Recommendations built from everything you love.
          </p>
          <Link
            to="/for-you"
            className="ink-btn ink-press ink-sh-red inline-block bg-ink px-10 py-3.5 text-sm text-ink-paper"
          >
            See what's for you →
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Profile;
