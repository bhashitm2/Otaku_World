// src/components/ink/Ticker.jsx - marquee "BREAKING" strip (inverted light bg)
const ITEMS = [
  "SEASON CHARTS ARE LIVE",
  "200,000 CHARACTER PROFILES",
  "NEW: WEEKLY AIRING SCHEDULE",
  "MANGA ARCHIVE IS BACK",
  "PERSONAL RECOMMENDATIONS FOR YOU",
];

const TickerRun = () => (
  <div className="flex gap-7 pr-7 font-display text-[13px] tracking-[2px] text-ink-paper whitespace-nowrap">
    <span className="text-ink-red">● BREAKING</span>
    {ITEMS.map((item, i) => (
      <span key={i} className="flex gap-7">
        <span>{item}</span>
        <span className="text-ink-red">●</span>
      </span>
    ))}
  </div>
);

const Ticker = () => (
  <div className="overflow-hidden bg-ink py-2 flex-none">
    <div className="flex w-max animate-marq">
      <TickerRun />
      <TickerRun />
    </div>
  </div>
);

export default Ticker;
