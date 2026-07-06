// src/components/ink/InkEmptyState.jsx - rotated shout panel + optional CTA
import { useNavigate } from "react-router-dom";

const InkEmptyState = ({
  shout,
  sub,
  ctaLabel,
  ctaTo,
  redShadow = true,
  rotate = -2,
}) => {
  const navigate = useNavigate();

  return (
    <div className="py-20 text-center">
      <div
        className={`ink-display inline-block border-[3px] border-ink bg-ink-paper px-9 py-6 text-[26px] ${
          redShadow ? "ink-shadow-red" : "ink-shadow-lg"
        }`}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {shout}
      </div>
      {sub && (
        <p className="mt-7 text-sm font-bold text-ink-mut3">{sub}</p>
      )}
      {ctaLabel && (
        <button
          onClick={() => navigate(ctaTo)}
          className="ink-btn ink-press ink-sh-red mt-6 bg-ink px-8 py-4 text-sm text-ink-paper"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
};

export default InkEmptyState;
