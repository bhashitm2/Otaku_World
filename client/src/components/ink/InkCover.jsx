// src/components/ink/InkCover.jsx - Jikan cover image over the striped
// placeholder from the design (stripes show while loading / on error)
import { useState } from "react";

const InkCover = ({ src, alt, className = "" }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`ink-stripes relative overflow-hidden ${className}`}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#8a8578]">
          <span className="border border-dashed border-[#b6b0a0] bg-ink-paper/60 px-2 py-1">
            no cover
          </span>
        </span>
      )}
    </div>
  );
};

export default InkCover;
