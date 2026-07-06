// Prefer the English title for display, falling back to the default (romaji)
// title, then the character `name`. Jikan's browse/search/top/seasonal/
// trending/schedule endpoints include `title_english`; recommendation and
// appearance "entry" objects only carry `title`, so those gracefully fall back.
export const getDisplayTitle = (item) => {
  if (!item) return "Unknown";
  return item.title_english || item.title || item.name || "Unknown";
};
