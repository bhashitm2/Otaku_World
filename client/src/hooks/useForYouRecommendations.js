// src/hooks/useForYouRecommendations.js
// Personalized recommendations derived from the user's favorites.
// Fans out to the (server-cached) Jikan recommendations of the user's
// most recent favorite anime, then merges, dedupes, and ranks.
import { useQuery } from "@tanstack/react-query";
import { useFavorites } from "./useFavorites";
import { useWatchlist } from "./useWatchlist";
import { getAnimeRecommendations } from "../services/anime";

// Capped so a cold server cache stays under ~6s (serial 1.5s Jikan queue)
const MAX_SEEDS = 4;
const MAX_RESULTS = 24;

const buildForYou = async (seeds, excludeIds) => {
  const results = await Promise.allSettled(
    seeds.map((seed) => getAnimeRecommendations(seed.itemId))
  );

  // score each recommended anime: how many seed lists it appears in,
  // weighted by MAL community votes
  const scored = new Map();
  const seedFor = new Map();

  results.forEach((result, i) => {
    if (result.status !== "fulfilled") return;

    for (const rec of result.value?.data || []) {
      const entry = rec.entry;
      if (!entry?.mal_id || excludeIds.has(entry.mal_id)) continue;

      const existing = scored.get(entry.mal_id);
      const votes = rec.votes || 0;
      if (existing) {
        existing.score += 1000 + votes;
      } else {
        scored.set(entry.mal_id, { entry, score: 1000 + votes });
        seedFor.set(entry.mal_id, seeds[i]);
      }
    }
  });

  return [...scored.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(({ entry }) => ({
      ...entry,
      becauseOf: seedFor.get(entry.mal_id)?.title || null,
    }));
};

export const useForYouRecommendations = () => {
  const { favoriteAnime, loading: favoritesLoading } = useFavorites();
  const { watchlist } = useWatchlist();

  // favorites are already sorted newest-first by the context
  const seeds = favoriteAnime.slice(0, MAX_SEEDS);

  const excludeIds = new Set([
    ...favoriteAnime.map((fav) => fav.itemId),
    ...watchlist.map((item) => item.itemId),
  ]);

  const seedKey = seeds.map((seed) => seed.itemId).join(",");

  const query = useQuery({
    queryKey: ["for-you", seedKey],
    queryFn: () => buildForYou(seeds, excludeIds),
    staleTime: 30 * 60 * 1000,
    enabled: !favoritesLoading && seeds.length > 0,
  });

  return {
    ...query,
    seeds,
    hasSeeds: seeds.length > 0,
  };
};
