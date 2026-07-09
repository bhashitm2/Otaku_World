// Nova cover image — cover art over a soft gradient placeholder;
// a subtle "no art" fallback on missing/broken sources.
// Fills its container: give the wrapper an aspect-ratio.
import { useState } from "react";

export function Cover({ src, alt = "", className = "", imgClassName = "" }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`ow-cover-ph relative h-full w-full overflow-hidden ${className}`}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`absolute inset-0 block h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-body text-[11px] text-faint">
          no art
        </span>
      )}
    </div>
  );
}

export default Cover;
