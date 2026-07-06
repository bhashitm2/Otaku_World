// src/components/ink/InkAnimeCard.jsx - "Ink & Impact" media card
// Works for anime and manga (mediaType drives the details link + save type).
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { useWatchlist } from "../../hooks/useWatchlist";
import InkCover from "./InkCover";
import { getDisplayTitle } from "../../utils/title";

const statusLabel = (status) => {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s.includes("currently airing")) return { text: "AIRING", hot: true };
  if (s.includes("publishing")) return { text: "PUBLISHING", hot: true };
  if (s.includes("not yet") || s.includes("upcoming"))
    return { text: "UPCOMING", hot: false };
  return { text: "FINISHED", hot: false };
};

const InkAnimeCard = ({ anime, mediaType = "anime", badge }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  if (!anime) return null;

  const id = anime.mal_id || anime.id;
  const title = getDisplayTitle(anime);
  const image =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    anime.image;
  const score = anime.score;
  const type = anime.type;
  const year =
    anime.year ||
    anime.aired?.prop?.from?.year ||
    anime.published?.prop?.from?.year;
  const count = anime.episodes ?? anime.chapters;
  const countLabel = mediaType === "manga" ? "CH" : "EP";
  const genres = (anime.genres || [])
    .slice(0, 2)
    .map((g) => (typeof g === "string" ? g : g.name));
  const status = statusLabel(anime.status);

  const saveItem = {
    mal_id: id,
    type: mediaType,
    title,
    image: image || "",
    genres: anime.genres || [],
    score: score || null,
    status: anime.status || "",
    episodes: anime.episodes || null,
    chapters: anime.chapters || null,
  };

  const faved = user && isFavorite(id, mediaType);
  const queued = user && isInWatchlist(id, mediaType);

  const onFav = (e) => {
    e.stopPropagation();
    toggleFavorite(saveItem);
  };
  const onWatch = (e) => {
    e.stopPropagation();
    toggleWatchlist(saveItem);
  };

  return (
    <div
      onClick={() => navigate(`/${mediaType}/${id}`)}
      className="ink-card ink-press relative flex cursor-pointer flex-col"
    >
      {/* overhanging badge: custom (rank) or media type */}
      {badge ? (
        <div className="ink-display absolute -top-3.5 -left-2.5 z-[2] border-[3px] border-ink bg-ink-red px-2.5 py-0.5 text-[18px] text-ink-paper">
          {badge}
        </div>
      ) : (
        type && (
          <div className="ink-display absolute -top-3 -left-2 z-[2] bg-ink px-2 py-[3px] text-[12px] text-ink-paper">
            {type}
          </div>
        )
      )}

      <div className="relative h-60 border-b-[3px] border-ink">
        <InkCover src={image} alt={title} className="h-full w-full" />
        {score && (
          <div className="ink-display absolute top-2 right-2 border-[3px] border-ink bg-ink-paper px-2 py-0.5 text-[13px]">
            ★ {score}
          </div>
        )}
        {user && (
          <>
            <button
              onClick={onFav}
              aria-label={faved ? "Remove from favorites" : "Add to favorites"}
              className={`absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center border-[3px] border-ink text-base transition-all duration-150 shadow-[3px_3px_0_#f2efe6] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_#f2efe6] ${
                faved ? "bg-ink-red text-ink-paper" : "bg-ink-paper text-ink"
              }`}
            >
              ♥
            </button>
            <button
              onClick={onWatch}
              aria-label={queued ? "Remove from watchlist" : "Add to watchlist"}
              className={`absolute bottom-2.5 right-14 flex h-9 w-9 items-center justify-center border-[3px] border-ink font-body text-lg font-black transition-all duration-150 shadow-[3px_3px_0_#f2efe6] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_#f2efe6] ${
                queued ? "bg-ink text-ink-paper" : "bg-ink-paper text-ink"
              }`}
            >
              +
            </button>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-[7px] p-3 pb-4">
        <div className="ink-display text-[16px] leading-tight tracking-[.5px] line-clamp-2">
          {title}
        </div>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <span
                key={g}
                className="border-2 border-ink bg-ink-bg px-2 py-[3px] text-[10.5px] font-black uppercase tracking-[.5px]"
              >
                {g}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex justify-between text-[11px] font-bold text-ink-mut3">
          <span>
            {year || "—"}
            {count ? ` · ${countLabel} ${count}` : ""}
          </span>
          {status && (
            <span className={status.hot ? "text-ink-red" : ""}>
              {status.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InkAnimeCard;
