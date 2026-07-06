// Client-side relevance re-ranking for search results.
// Jikan's default search matches loosely (any query word) and its ordering
// often buries the obvious title match under higher-scored partial matches
// (e.g. searching "one punch man" surfaces "Mob Psycho 100" / "One Piece").
// We score each result by how well its titles match the query and re-sort,
// using the MAL score only as a tie-breaker within the same match tier.

const normalize = (str = "") =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // drop punctuation (hyphens, colons, …)
    .replace(/\s+/g, " ")
    .trim();

// Collect every title-ish string Jikan gives us for an item
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

const scoreTitle = (nTitle, nQuery, queryWords) => {
  if (!nTitle) return 0;
  if (nTitle === nQuery) return 1000; // exact match
  if (nTitle.startsWith(nQuery)) return 800; // prefix match
  if (nTitle.includes(nQuery)) return 600; // substring match
  // otherwise: fraction of query words present as whole words
  const titleWords = new Set(nTitle.split(" "));
  const hits = queryWords.filter((w) => titleWords.has(w)).length;
  return queryWords.length ? (hits / queryWords.length) * 400 : 0;
};

export const rankByRelevance = (items = [], query = "") => {
  const nQuery = normalize(query);
  if (!nQuery || items.length === 0) return items;
  const queryWords = nQuery.split(" ").filter(Boolean);

  return items
    .map((item, index) => {
      const relevance = Math.max(
        0,
        ...candidateTitles(item).map((t) => scoreTitle(t, nQuery, queryWords))
      );
      // score (0–10) breaks ties inside the same relevance tier; index keeps
      // the sort stable when everything is equal
      return { item, relevance, score: item.score || 0, index };
    })
    .sort(
      (a, b) =>
        b.relevance - a.relevance || b.score - a.score || a.index - b.index
    )
    .map((entry) => entry.item);
};
