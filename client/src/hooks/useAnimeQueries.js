// src/hooks/useAnimeQueries.js
// Centralized React Query hooks for anime/manga data.
// Query keys are namespaced arrays so related caches can be invalidated
// together, e.g. queryClient.invalidateQueries({ queryKey: ["anime"] }).
import { useQuery } from "@tanstack/react-query";
import {
  getTrendingAnime,
  getTopAnime,
  getCurrentSeason,
  getUpcomingSeason,
  getSchedules,
  searchAnime,
  getAnimeDetails,
  getAnimeCharacters,
  getAnimeRecommendations,
  getAnimeGenres,
  getTopManga,
  searchManga,
  getMangaDetails,
  getMangaCharacters,
  getMangaRecommendations,
} from "../services/anime";

const TEN_MINUTES = 10 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

// ================== Anime ==================

export const useTrendingAnime = (page = 1) =>
  useQuery({
    queryKey: ["anime", "trending", page],
    queryFn: () => getTrendingAnime(page),
    staleTime: TEN_MINUTES,
  });

export const useTopAnime = (page = 1) =>
  useQuery({
    queryKey: ["anime", "top", page],
    queryFn: () => getTopAnime(page),
    staleTime: TEN_MINUTES,
  });

// filter: undefined for the current season, "upcoming" for next season
export const useSeasonalAnime = (filter, page = 1) =>
  useQuery({
    queryKey: ["anime", "seasonal", filter || "now", page],
    queryFn: () =>
      filter === "upcoming" ? getUpcomingSeason(page) : getCurrentSeason(page),
    staleTime: THIRTY_MINUTES,
  });

// day: monday..sunday
export const useSchedules = (day, page = 1) =>
  useQuery({
    queryKey: ["anime", "schedules", day, page],
    queryFn: () => getSchedules(day, page),
    staleTime: THIRTY_MINUTES,
    enabled: !!day,
  });

// params: { q, genres, status, type, rating, min_score, order_by, sort, ... }
export const useAnimeSearch = (params, page = 1, options = {}) =>
  useQuery({
    queryKey: ["anime", "search", params, page],
    queryFn: () => {
      const { q, ...filters } = params;
      return searchAnime(q || "", page, 25, filters);
    },
    staleTime: TEN_MINUTES,
    placeholderData: (prev) => prev, // keep previous page while fetching
    ...options,
  });

export const useAnimeDetails = (id) =>
  useQuery({
    queryKey: ["anime", "details", id],
    queryFn: () => getAnimeDetails(id),
    staleTime: THIRTY_MINUTES,
    enabled: !!id,
  });

export const useAnimeCharacters = (id, enabled = true) =>
  useQuery({
    queryKey: ["anime", "characters", id],
    queryFn: () => getAnimeCharacters(id),
    staleTime: THIRTY_MINUTES,
    enabled: !!id && enabled,
  });

export const useAnimeRecommendations = (id, enabled = true) =>
  useQuery({
    queryKey: ["anime", "recommendations", id],
    queryFn: () => getAnimeRecommendations(id),
    staleTime: THIRTY_MINUTES,
    enabled: !!id && enabled,
  });

export const useAnimeGenres = () =>
  useQuery({
    queryKey: ["anime", "genres"],
    queryFn: getAnimeGenres,
    staleTime: 24 * 60 * 60 * 1000, // genres barely change
  });

// ================== Manga ==================

export const useTopManga = (page = 1) =>
  useQuery({
    queryKey: ["manga", "top", page],
    queryFn: () => getTopManga(page),
    staleTime: TEN_MINUTES,
  });

export const useMangaSearch = (params, page = 1, options = {}) =>
  useQuery({
    queryKey: ["manga", "search", params, page],
    queryFn: () => {
      const { q, ...filters } = params;
      return searchManga(q || "", page, 25, filters);
    },
    staleTime: TEN_MINUTES,
    placeholderData: (prev) => prev,
    ...options,
  });

export const useMangaDetails = (id) =>
  useQuery({
    queryKey: ["manga", "details", id],
    queryFn: () => getMangaDetails(id),
    staleTime: THIRTY_MINUTES,
    enabled: !!id,
  });

export const useMangaCharacters = (id, enabled = true) =>
  useQuery({
    queryKey: ["manga", "characters", id],
    queryFn: () => getMangaCharacters(id),
    staleTime: THIRTY_MINUTES,
    enabled: !!id && enabled,
  });

export const useMangaRecommendations = (id, enabled = true) =>
  useQuery({
    queryKey: ["manga", "recommendations", id],
    queryFn: () => getMangaRecommendations(id),
    staleTime: THIRTY_MINUTES,
    enabled: !!id && enabled,
  });
