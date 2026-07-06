// src/components/ink/InkCharacterCard.jsx - dossier card (ink & impact)
// Jikan's top/search character endpoints only return name, favorites and
// images — no role or source anime — so the badge shows the popularity rank
// (with the mockup's red/ink/paper colour variety) and the secondary line
// shows the Japanese name.
import { useNavigate } from "react-router-dom";
import InkCover from "./InkCover";

// Rank → badge palette, echoing the mockup's HERO=red / VILLAIN=ink / rest=paper
const rankStyle = (rank) => {
  if (rank && rank <= 3) return { bg: "bg-ink-red", text: "text-ink-paper" };
  if (rank && rank <= 10) return { bg: "bg-ink", text: "text-ink-paper" };
  return { bg: "bg-ink-paper", text: "text-ink" };
};

const compactFavs = (n) => {
  if (!n) return "0";
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
};

const InkCharacterCard = ({ character, rank }) => {
  const navigate = useNavigate();
  if (!character) return null;

  const id = character.mal_id;
  const name = character.name || "Unknown";
  const image =
    character.images?.jpg?.image_url || character.images?.webp?.image_url;
  const favs = character.favorites;
  const subtitle = character.name_kanji || character.nicknames?.[0] || null;
  const style = rankStyle(rank);

  return (
    <div
      onClick={() => navigate(`/characters/${id}`)}
      className="ink-card ink-press-redhov relative cursor-pointer"
    >
      {rank && (
        <div
          className={`ink-display absolute -top-3 -right-2 z-[2] rotate-3 border-[3px] border-ink px-2.5 py-[3px] text-[13px] tracking-[1px] ${style.bg} ${style.text}`}
        >
          #{rank}
        </div>
      )}
      <div className="relative h-[230px] border-b-[3px] border-ink">
        <InkCover src={image} alt={name} className="h-full w-full" />
      </div>
      <div className="p-3.5 pb-4">
        <div className="ink-display text-[17px] tracking-[.5px] line-clamp-1">
          {name}
        </div>
        {subtitle && (
          <div className="mt-1 font-jp text-[12.5px] font-bold text-ink-mut3 line-clamp-1">
            {subtitle}
          </div>
        )}
        <div className="mt-2.5 flex items-center gap-1.5 text-[11.5px] font-black text-ink-red">
          ♥ {compactFavs(favs)}
          <span className="font-bold text-ink-mut4">FANS</span>
        </div>
      </div>
    </div>
  );
};

export default InkCharacterCard;
