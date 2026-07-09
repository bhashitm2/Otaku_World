// Nova media card — the workhorse of every grid and rail. A 2:3 poster
// tile: rounded cover art with a score mark and optional live pill, a
// hover scrim revealing favorite / watchlist actions, and a clean
// title + meta line beneath. Works for anime and manga (mediaType
// drives the details link + save type).
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { useWatchlist } from "../../hooks/useWatchlist";
import { getDisplayTitle } from "../../utils/title";
import { Cover } from "./Cover";
import { Badge } from "./Badge";

const statusLabel = (status) => {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s.includes("currently airing")) return { text: "Airing", hot: true };
  if (s.includes("publishing")) return { text: "Publishing", hot: true };
  if (s.includes("not yet") || s.includes("upcoming"))
    return { text: "Upcoming", hot: false };
  return { text: "Finished", hot: false };
};

export function MediaCard({ anime, mediaType = "anime", rank, width, className = "" }) {
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
  const countLabel = mediaType === "manga" ? "ch" : "ep";
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

  const actionBase =
    "flex h-[34px] w-[34px] items-center justify-center rounded-full transition-colors duration-fast";
  const actionOff =
    "border border-line-strong bg-[rgba(21,21,27,0.7)] text-text hover:border-gold hover:text-gold";
  const actionOn = "bg-gold text-bg";

  return (
    <div
      onClick={() => navigate(`/${mediaType}/${id}`)}
      className={`ow-lift cursor-pointer ${width ? "shrink-0" : ""} ${className}`}
      style={width ? { width } : undefined}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-2 shadow">
        <Cover src={image} alt={title} />
        {rank ? (
          <span className="absolute left-2 top-2">
            <Badge variant="accent" size="sm" className="font-mono">
              #{rank}
            </Badge>
          </span>
        ) : (
          status?.hot && (
            <span className="absolute left-2 top-2">
              <Badge variant="live" size="sm">
                ● {status.text}
              </Badge>
            </span>
          )
        )}
        {score != null && score !== "" && (
          <span className="absolute right-2 top-2">
            <Badge variant="score" size="sm">★ {score}</Badge>
          </span>
        )}
        {user && (
          <div className="ow-scrim-poster ow-mediacard-scrim absolute inset-0 flex flex-col justify-end gap-2 p-3 opacity-0 transition-opacity duration-normal">
            <div className="flex gap-2">
              <button
                onClick={onFav}
                aria-label={faved ? "Remove from favorites" : "Add to favorites"}
                className={`${actionBase} text-sm ${faved ? actionOn : actionOff}`}
              >
                ♥
              </button>
              <button
                onClick={onWatch}
                aria-label={queued ? "Remove from watchlist" : "Add to watchlist"}
                className={`${actionBase} text-base ${queued ? actionOn : actionOff}`}
              >
                {queued ? "✓" : "+"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2.5">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap font-display text-[13.5px] font-semibold leading-snug text-text">
          {title}
        </div>
        <div className="mt-1 flex items-center gap-1.5 font-body text-xs text-muted">
          {score != null && score !== "" && (
            <span className="font-mono font-bold text-gold">★ {score}</span>
          )}
          {score != null && score !== "" && (year || type) && <span>·</span>}
          {year && <span>{year}</span>}
          {type && (
            <>
              {year && <span>·</span>}
              <span>
                {type}
                {count ? ` · ${count} ${countLabel}` : ""}
              </span>
            </>
          )}
          {status && !status.hot && (
            <>
              <span>·</span>
              <span>{status.text}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaCard;
