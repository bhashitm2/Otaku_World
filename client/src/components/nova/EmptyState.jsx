// Nova empty state — a centered glyph, headline, supporting line, and
// optional CTA. Calm and premium — for no-results, empty collections,
// and errors. Accepts either an `action` node or `ctaLabel`/`ctaTo`.
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export function EmptyState({
  glyph = "◍",
  title = "Nothing here yet",
  sub,
  action,
  ctaLabel,
  ctaTo,
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col items-center px-6 py-[72px] text-center ${className}`}>
      <div className="mb-[22px] flex h-[72px] w-[72px] items-center justify-center rounded-full border border-line bg-surface-2 text-[30px] text-gold">
        {glyph}
      </div>
      <div className="font-display text-xl font-bold text-text">{title}</div>
      {sub && (
        <p className="mt-2 max-w-[340px] font-body text-sm leading-relaxed text-muted">
          {sub}
        </p>
      )}
      {(action || ctaLabel) && (
        <div className="mt-6">
          {action || <Button onClick={() => navigate(ctaTo)}>{ctaLabel}</Button>}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
