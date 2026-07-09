// Home — Nova: full-bleed backdrop hero for the featured title, then
// horizontal rails. The cover art is the brightest thing on screen.
import { Link, useNavigate } from "react-router-dom";
import {
  useTrendingAnime,
  useTopAnime,
  useSeasonalAnime,
} from "../hooks/useAnimeQueries";
import { useAuth } from "../hooks/useAuth";
import { useWatchlist } from "../hooks/useWatchlist";
import { Cover, Button, MediaCard, Skeleton } from "../components/nova";
import { dedupeById } from "../utils/dedupe";
import { getDisplayTitle } from "../utils/title";

// Jikan covers are 2:3 portraits; prefer the 16:9 trailer still for the
// backdrop and fall back to the poster (scrims hide the cropping).
const wideImage = (item) =>
  item?.trailer?.images?.maximum_image_url ||
  item?.trailer?.images?.large_image_url ||
  item?.images?.jpg?.large_image_url;

const Rail = ({ title, to, items, isLoading, mediaType = "anime" }) => (
  <section className="mt-11">
    <div className="mb-4 flex items-baseline justify-between px-gutter lg:px-gutter-lg">
      <h2 className="m-0 font-display text-xl font-bold tracking-tight text-text">
        {title}
      </h2>
      {to && (
        <Link
          to={to}
          className="text-[13px] text-faint no-underline transition-colors duration-fast hover:text-text"
        >
          See all →
        </Link>
      )}
    </div>
    <div className="ow-scroll flex gap-[18px] overflow-x-auto px-gutter pb-2 lg:px-gutter-lg">
      {isLoading || !items?.length
        ? [...Array(7)].map((_, i) => (
            <Skeleton key={i} className="w-[200px] shrink-0" />
          ))
        : items.map((item) => (
            <MediaCard
              key={item.mal_id}
              anime={item}
              mediaType={mediaType}
              width={200}
            />
          ))}
    </div>
  </section>
);

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const { data: trendingData, isLoading: trendingLoading } = useTrendingAnime(1);
  const { data: topData, isLoading: topLoading } = useTopAnime(1);
  const { data: seasonalData, isLoading: seasonalLoading } = useSeasonalAnime();

  const trending = dedupeById(trendingData?.data || []);
  const featured = trending.find((item) => wideImage(item)) || trending[0];
  const trendingRail = trending
    .filter((item) => item.mal_id !== featured?.mal_id)
    .slice(0, 14);
  const seasonalRail = dedupeById(seasonalData?.data || []).slice(0, 14);
  const topRail = dedupeById(topData?.data || []).slice(0, 14);

  const featuredSave = featured && {
    mal_id: featured.mal_id,
    type: "anime",
    title: getDisplayTitle(featured),
    image:
      featured.images?.jpg?.large_image_url ||
      featured.images?.jpg?.image_url ||
      "",
    genres: featured.genres || [],
    score: featured.score || null,
    status: featured.status || "",
    episodes: featured.episodes || null,
    chapters: null,
  };
  const queued = user && featured && isInWatchlist(featured.mal_id, "anime");

  const onWatchlist = () => {
    if (!user) return navigate("/login");
    toggleWatchlist(featuredSave);
  };

  return (
    <div className="bg-bg pb-20 text-text">
      {/* ============ HERO ============ */}
      <section className="relative -mt-nav h-[560px] overflow-hidden md:h-[620px]">
        {featured ? (
          <>
            <Cover
              src={wideImage(featured)}
              alt={getDisplayTitle(featured)}
              imgClassName="object-top"
            />
            <div className="ow-scrim-hero pointer-events-none absolute inset-0" />
            <div className="ow-scrim-bottom pointer-events-none absolute inset-0" />

            <div className="absolute bottom-16 left-gutter max-w-[560px] pr-gutter lg:left-gutter-lg">
              <div className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.12em] text-gold">
                ● Featured today
              </div>
              <h1 className="m-0 font-display text-[34px] font-extrabold leading-[1.02] tracking-tight md:text-[56px]">
                {getDisplayTitle(featured)}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[13.5px] text-muted">
                {featured.score && (
                  <span className="font-mono font-bold text-gold">
                    ★ {featured.score}
                  </span>
                )}
                {featured.year && <span>{featured.year}</span>}
                {featured.episodes && <span>· {featured.episodes} ep</span>}
                {(featured.genres || []).slice(0, 3).map((g) => (
                  <span key={g.mal_id || g.name || g}>
                    · {typeof g === "string" ? g : g.name}
                  </span>
                ))}
              </div>
              {featured.synopsis && (
                <p className="mt-4 max-w-[520px] text-[14.5px] leading-relaxed text-muted line-clamp-3">
                  {featured.synopsis}
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3.5">
                <Button
                  as={Link}
                  to={`/anime/${featured.mal_id}`}
                  size="lg"
                  glow
                >
                  ▶ View details
                </Button>
                <Button variant="ghost" size="lg" onClick={onWatchlist}>
                  {queued ? "✓ In watchlist" : "＋ Watchlist"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="ow-shimmer h-full w-full" />
        )}
      </section>

      {/* ============ RAILS ============ */}
      <Rail
        title="Trending now"
        to="/trending"
        items={trendingRail}
        isLoading={trendingLoading}
      />
      <Rail
        title="New this season"
        to="/seasonal"
        items={seasonalRail}
        isLoading={seasonalLoading}
      />
      <Rail
        title="Top rated of all time"
        to="/anime"
        items={topRail}
        isLoading={topLoading}
      />
    </div>
  );
};

export default Home;
