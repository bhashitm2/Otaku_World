// Nova character card — a circular portrait with the character's name,
// secondary line, and fan count. Optional gold rank flag. Jikan's list
// endpoints return no source series, so the sub-line falls back to the
// Japanese name / nickname.
import { useNavigate } from "react-router-dom";
import { Cover } from "./Cover";

const compact = (n) => (!n ? "0" : n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`);

export function CharacterCard({ character, rank, from, className = "" }) {
  const navigate = useNavigate();
  if (!character) return null;

  const id = character.mal_id;
  const name = character.name || "Unknown";
  const image =
    character.images?.jpg?.image_url || character.images?.webp?.image_url;
  const subtitle = from || character.name_kanji || character.nicknames?.[0] || null;

  return (
    <div
      onClick={() => navigate(`/characters/${id}`)}
      className={`ow-lift cursor-pointer text-center ${className}`}
    >
      <div className="relative mx-auto mb-3.5 h-[130px] w-[130px]">
        <div className="h-full w-full overflow-hidden rounded-full border-2 border-line-strong">
          <Cover src={image} alt={name} />
        </div>
        {rank && (
          <span className="absolute -top-0.5 right-1.5 flex h-6 min-w-[24px] items-center justify-center rounded-pill bg-gold px-1.5 font-mono text-[11px] font-bold text-bg shadow-sm">
            #{rank}
          </span>
        )}
      </div>
      <div className="font-display text-[14.5px] font-semibold text-text">{name}</div>
      {subtitle && (
        <div className="mt-[3px] font-body text-xs text-faint">{subtitle}</div>
      )}
      {character.favorites != null && (
        <div className="mt-1.5 font-body text-[12.5px] font-semibold text-gold">
          ♥ {compact(character.favorites)}
        </div>
      )}
    </div>
  );
}

export default CharacterCard;
