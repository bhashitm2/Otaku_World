// Client-side relevance filtering + re-ranking for search results.
// Jikan/AniList search matches loosely (any query word), so "one punch man"
// also returns "One Piece" and "Mob Psycho 100". We (1) drop results that
// don't genuinely match the query and (2) re-rank the rest so the closest
// title match leads, using the MAL score only as a tie-breaker.

const normalize = (str = "") =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // drop punctuation (hyphens, colons, …)
    .replace(/\s+/g, " ")
    .trim();

// Collect every title-ish string the API gives us for an item
const candidateTitles = (item) => {
  const list = [
    item.title,
    item.title_english,
    item.title_japanese,
    ...(item.titles?.map((t) => t.title) || []),
    ...(item.title_synonyms || []),
  ];
  return list.filter(Boolean).map(normalize);
};

// Relevance tiers. Anything >= ALL_WORDS_SCORE means the whole query is
// present (as a phrase, or every query word appears) — a genuine match.
const ALL_WORDS_SCORE = 400;

const scoreTitle = (nTitle, nQuery, queryWords) => {
  if (!nTitle) return 0;
  if (nTitle === nQuery) return 1000; // exact match
  if (nTitle.startsWith(nQuery)) return 800; // prefix match
  if (nTitle.includes(nQuery)) return 600; // substring/phrase match
  // otherwise: fraction of query words present as whole words
  const titleWords = new Set(nTitle.split(" "));
  const hits = queryWords.filter((w) => titleWords.has(w)).length;
  return queryWords.length ? (hits / queryWords.length) * ALL_WORDS_SCORE : 0;
};

// Best relevance score for an item across all its titles
const itemRelevance = (item, nQuery, queryWords) =>
  Math.max(0, ...candidateTitles(item).map((t) => scoreTitle(t, nQuery, queryWords)));

// Drop results that don't genuinely match the query, preserving the incoming
// order (use when the caller already chose a sort, e.g. Score / Popularity).
export const filterByRelevance = (items = [], query = "") => {
  const nQuery = normalize(query);
  if (!nQuery || items.length === 0) return items;
  const queryWords = nQuery.split(" ").filter(Boolean);
  return items.filter(
    (item) => itemRelevance(item, nQuery, queryWords) >= ALL_WORDS_SCORE
  );
};

// Filter to genuine matches, then sort by relevance (score breaks ties).
// Pass { strict: false } to keep loose matches (re-rank only, no filtering).
export const rankByRelevance = (items = [], query = "", { strict = true } = {}) => {
  const nQuery = normalize(query);
  if (!nQuery || items.length === 0) return items;
  const queryWords = nQuery.split(" ").filter(Boolean);

  return items
    .map((item, index) => ({
      item,
      index,
      relevance: itemRelevance(item, nQuery, queryWords),
      score: item.score || 0,
    }))
    .filter((entry) => (strict ? entry.relevance >= ALL_WORDS_SCORE : true))
    .sort(
      (a, b) =>
        b.relevance - a.relevance || b.score - a.score || a.index - b.index
    )
    .map((entry) => entry.item);
};
