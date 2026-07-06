// Home — "Ink & Impact": Three.js hero, real power rankings, quest cards
import React, { Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTrendingAnime } from "../hooks/useAnimeQueries";
import InkCover from "../components/ink/InkCover";
import { InkCardSkeleton } from "../components/ink/InkSkeleton";
import { dedupeById } from "../utils/dedupe";
import { getDisplayTitle } from "../utils/title";

// three.js is heavy — load the hero canvas after the page paints
const ThreeHero = React.lazy(() => import("../components/ink/ThreeHero"));

const QUESTS = [
  {
    num: "01",
    title: "Anime Archive",
    desc: "Search 50,000+ series with filters sharp enough to find that one show you half-remember.",
    to: "/anime",
  },
  {
    num: "02",
    title: "Character Files",
    desc: "Dossiers on every hero, rival and menace. Know your cast before the plot twist does.",
    to: "/characters",
  },
  {
    num: "03",
    title: "Power Rankings",
    desc: "The community's verdict, updated weekly. Argue with the data, not with strangers.",
    to: "/trending",
  },
  {
    num: "04",
    title: "Your Collection",
    desc: "Favorites, watchlist, and picks tailored to your taste — synced everywhere.",
    to: "/favorites",
  },
];

const compactMembers = (n) => {
  if (!n) return null;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
};

const Home = () => {
  const navigate = useNavigate();
  const { data: trendingData, isLoading } = useTrendingAnime(1);
  const topFive = dedupeById(trendingData?.data || []).slice(0, 5);

  return (
    <div className="bg-ink-bg text-ink">
      {/* ============ HERO ============ */}
      <section className="ink-halftone relative h-[640px] overflow-hidden bg-ink-paper">
        <Suspense fallback={null}>
          <ThreeHero />
        </Suspense>

        {/* floating stickers */}
        <div className="ink-display absolute top-12 right-6 z-[3] hidden rotate-6 animate-bob2 bg-ink-red px-5 py-3 text-[17px] text-ink-paper shadow-[5px_5px_0_#f2efe6] md:block">
          #1 ANIME DATABASE
        </div>
        <div className="ink-display absolute top-[170px] right-[140px] z-[3] hidden -rotate-6 animate-bob border-[3px] border-ink bg-ink-paper px-4 py-2.5 text-sm text-ink shadow-[5px_5px_0_#e63946] lg:block">
          50K+ SERIES!!
        </div>
        <div className="absolute bottom-[70px] right-20 z-[3] hidden rotate-3 animate-bob2 bg-ink px-4 py-2.5 font-jp text-[13px] font-bold tracking-[2px] text-ink-paper lg:block">
          トラッキング開始!
        </div>
        <div
          className="absolute top-[90px] left-5 z-[3] hidden font-jp text-sm font-bold tracking-[8px] text-ink/25 md:block"
          style={{ writingMode: "vertical-rl" }}
        >
          オタクワールド
        </div>

        {/* hero copy */}
        <div className="pointer-events-none relative z-[4] max-w-[700px] px-6 pt-16 md:px-[72px] md:pt-24">
          <div className="ink-display mb-6 inline-block -rotate-1 bg-ink px-3.5 py-1.5 text-[13px] tracking-[3px] text-ink-paper">
            CHAPTER 01 — THE PORTAL
          </div>
          <h1 className="ink-display m-0 text-[56px] leading-[.94] md:text-[104px]">
            Your next
            <br />
            <span className="relative z-[1] inline-block">
              obsession
              <span className="absolute -left-1.5 -right-1.5 bottom-1.5 -z-[1] h-[34%] -skew-x-6 bg-ink-red" />
            </span>
            <br />
            awaits.
          </h1>
          <p className="my-6 max-w-[440px] text-[17px] font-medium leading-[1.7] text-ink-body md:mb-9">
            Track every episode. Rank every character. Argue about power
            levels with data on your side.
          </p>
          <div className="pointer-events-auto flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/anime")}
              className="ink-btn ink-press ink-sh-red bg-ink px-9 py-4 text-[15px] text-ink-paper"
            >
              Dive in →
            </button>
            <button
              onClick={() => navigate("/trending")}
              className="ink-btn ink-press bg-ink-paper px-9 py-4 text-[15px] text-ink"
            >
              Trending
            </button>
          </div>
          <div className="pointer-events-auto mt-11 hidden gap-3.5 sm:flex">
            {[
              ["50K+", "SERIES"],
              ["200K+", "CHARACTERS"],
              ["1M+", "RATINGS"],
            ].map(([num, label]) => (
              <div
                key={label}
                className="ink-card ink-shadow-sm px-5 py-2.5"
              >
                <span className="font-display text-[22px] text-ink-red">
                  {num}
                </span>
                <span className="ml-2 text-[11px] font-black tracking-[1px] text-ink">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POWER RANKINGS ============ */}
      <section className="border-t-4 border-ink bg-ink-bg px-6 pb-14 pt-11 md:px-[72px]">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="ink-display m-0 text-[28px] md:text-[34px]">
            This week's <span className="text-ink-red">power rankings</span>
          </h2>
          <Link
            to="/trending"
            className="border-b-[3px] border-ink-red text-[13px] font-black uppercase tracking-[1px] text-ink no-underline"
          >
            Full chart →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {isLoading
            ? [...Array(5)].map((_, i) => <InkCardSkeleton key={i} />)
            : topFive.map((anime, i) => (
                <div
                  key={anime.mal_id}
                  onClick={() => navigate(`/anime/${anime.mal_id}`)}
                  className="ink-card ink-press relative cursor-pointer"
                >
                  <div className="ink-display absolute -top-3.5 -left-2.5 z-[2] border-[3px] border-ink bg-ink-red px-2.5 py-0.5 text-[18px] text-ink-paper">
                    #{i + 1}
                  </div>
                  <div className="relative h-[230px] border-b-[3px] border-ink">
                    <InkCover
                      src={
                        anime.images?.jpg?.large_image_url ||
                        anime.images?.jpg?.image_url
                      }
                      alt={anime.title}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="p-3 pb-4">
                    <div className="ink-display text-[15px] leading-tight tracking-[.5px] line-clamp-2">
                      {getDisplayTitle(anime)}
                    </div>
                    <div className="mt-1.5 text-[11.5px] font-bold text-ink-mut3">
                      {anime.score ? `SCORE ${anime.score}` : "UNRATED"}
                      {compactMembers(anime.members)
                        ? ` · ${compactMembers(anime.members)} MEMBERS`
                        : ""}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* ============ QUESTS ============ */}
      <section className="ink-halftone-soft border-t-4 border-ink bg-ink-paper px-6 pb-16 pt-11 md:px-[72px]">
        <h2 className="ink-display m-0 mb-8 text-[28px] md:text-[34px]">
          Choose your{" "}
          <span className="relative z-[1] inline-block">
            quest
            <span className="absolute -left-1 -right-1 bottom-0.5 -z-[1] h-[36%] -skew-x-6 bg-ink-red" />
          </span>
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {QUESTS.map((quest) => (
            <div
              key={quest.num}
              onClick={() => navigate(quest.to)}
              className="ink-card ink-press-redhov flex cursor-pointer flex-col gap-2.5 p-5"
            >
              <div className="font-display text-[30px] text-ink-red">
                {quest.num}
              </div>
              <div className="ink-display text-[19px] tracking-[.5px]">
                {quest.title}
              </div>
              <div className="text-[13.5px] font-medium leading-relaxed text-ink-mut1">
                {quest.desc}
              </div>
              <div className="mt-auto text-xs font-black uppercase tracking-[1px]">
                Go →
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
