// Profile — Nova: quiet header strip, mono-gold stat tiles, watchlist
// breakdown bars, and recent favorites.
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import { getUserStats, WATCH_STATUS_OPTIONS } from "../services/firestoreService";
import { MediaCard, CharacterCard, Button } from "../components/nova";

const StatTile = ({ value, label }) => (
  <div className="rounded-lg border border-line bg-surface p-5 text-center">
    <div className="font-mono text-[26px] font-bold text-gold">{value ?? 0}</div>
    <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-faint">
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
    <div>
      {/* User header */}
      <div className="border-b border-line bg-surface px-gutter py-12 lg:px-gutter-lg">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name || "Profile"}
              className="h-24 w-24 rounded-full border-2 border-line-strong object-cover"
            />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-strong font-display text-4xl font-bold text-bg">
              {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="m-0 font-display text-[30px] font-extrabold tracking-tight text-text md:text-[38px]">
              {user?.name || "Otaku"}
            </h1>
            <p className="mt-1 text-sm text-muted">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-12 px-gutter pb-20 pt-12 lg:px-gutter-lg">
        {/* Stats */}
        <section>
          <h2 className="mb-6 font-display text-xl font-bold tracking-tight text-text">
            Your stats
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="ow-shimmer h-[100px] rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <StatTile value={stats?.totalFavorites} label="Favorites" />
              <StatTile value={stats?.totalWatchlist} label="Watchlist" />
              <StatTile value={stats?.favoriteAnime} label="Fave anime" />
              <StatTile value={stats?.favoriteManga} label="Fave manga" />
              <StatTile value={stats?.favoriteCharacters} label="Characters" />
              <StatTile value={stats?.completed} label="Completed" />
            </div>
          )}
        </section>

        {/* Watchlist breakdown */}
        {watchTotal > 0 && (
          <section>
            <h2 className="mb-6 font-display text-xl font-bold tracking-tight text-text">
              Watchlist breakdown
            </h2>
            <div className="space-y-4 rounded-lg border border-line bg-surface p-6">
              {WATCH_STATUS_OPTIONS.map((status) => {
                const count = statusCounts[status.value] || 0;
                const percent = watchTotal
                  ? Math.round((count / watchTotal) * 100)
                  : 0;
                return (
                  <div key={status.value}>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="font-medium text-text">
                        {status.label}
                      </span>
                      <span className="font-mono text-faint">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-pill bg-surface-3">
                      <div
                        className="h-full rounded-pill bg-gradient-to-r from-gold to-gold-strong transition-all duration-700"
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
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="m-0 font-display text-xl font-bold tracking-tight text-text">
              Recent favorites
            </h2>
            {favorites.length > 0 && (
              <Link
                to="/favorites"
                className="text-[13px] text-faint no-underline transition-colors duration-fast hover:text-text"
              >
                See all →
              </Link>
            )}
          </div>
          {recentFavorites.length === 0 ? (
            <div className="rounded-lg border border-line bg-surface p-10 text-center">
              <p className="mb-6 text-sm text-muted">
                You haven't favorited anything yet.
              </p>
              <Button as={Link} to="/anime">
                Browse anime
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[26px] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
              {recentFavorites.map((fav) => {
                const cardItem = toCardItem(fav);
                if (fav.type === "character") {
                  return <CharacterCard key={fav.id} character={cardItem} />;
                }
                return (
                  <MediaCard
                    key={fav.id}
                    anime={cardItem}
                    mediaType={fav.type === "manga" ? "manga" : "anime"}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* For you CTA */}
        <section className="rounded-xl border border-line bg-surface p-10 text-center">
          <h2 className="m-0 font-display text-xl font-bold tracking-tight text-text">
            Picks made for you
          </h2>
          <p className="mx-auto mb-6 mt-3 max-w-xl text-sm text-muted">
            Recommendations built from everything you love.
          </p>
          <Button as={Link} to="/for-you" glow>
            See what's for you
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Profile;
