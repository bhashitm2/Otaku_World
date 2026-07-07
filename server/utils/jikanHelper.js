// server/utils/jikanHelper.js
import axios from "axios";
import { cache } from "./apiCaching.js";
import {
  alSearchAnime,
  alSearchManga,
  alTopAnime,
  alTopManga,
  alAnimeDetails,
  alMangaDetails,
  alSeasonNow,
  alSeasonUpcoming,
  alSchedules,
} from "./anilistHelper.js";

// Request queue for rate limiting
class RequestQueue {
  constructor(interval = 1500) {
    this.queue = [];
    this.processing = false;
    this.interval = interval;
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const { requestFn, resolve, reject } = this.queue.shift();

      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }

      // Wait before next request to respect rate limits
      if (this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.interval));
      }
    }

    this.processing = false;
  }
}

const requestQueue = new RequestQueue(1500); // 1.5s between requests

// Jikan intermittently returns 5xx (esp. 504) when its own upstream to
// MyAnimeList is flaky. These are transient, so retry a few times before
// giving up. Rate limits (429) and not-found (404) are NOT retried.
const MAX_JIKAN_RETRIES = 3;

const isRetriableJikanError = (error) => {
  const status = error.response?.status;
  if (status) {
    return status === 500 || status === 502 || status === 503 || status === 504;
  }
  // no response = network error / timeout
  return (
    error.code === "ECONNABORTED" ||
    error.code === "ECONNRESET" ||
    error.code === "ETIMEDOUT" ||
    error.code === "ENOTFOUND"
  );
};

const requestJikan = (url, options) =>
  requestQueue.add(async () => {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Otaku_World/1.0.0 (https://otaku-world.app)",
        Accept: "application/json",
      },
      ...options.axiosConfig,
    });
    return response.data;
  });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Enhanced Jikan API helper with caching, rate limiting and retry
export const fetchJikanData = async (endpoint, options = {}) => {
  const baseUrl = process.env.JIKAN_BASE_URL || "https://api.jikan.moe/v4";
  const url = `${baseUrl}${endpoint}`;
  const cacheKey = `jikan:${endpoint}`;

  // Check cache first
  if (cache.has(cacheKey) && !options.skipCache) {
    console.log(`📦 Cache HIT for: ${endpoint}`);
    return cache.get(cacheKey);
  }

  console.log(`🌐 Fetching from Jikan API: ${endpoint}`);

  let lastError;
  for (let attempt = 0; attempt <= MAX_JIKAN_RETRIES; attempt++) {
    try {
      const data = await requestJikan(url, options);

      // Cache the successful response
      const cacheDuration = options.cacheDuration || 1800; // 30 minutes default
      cache.set(cacheKey, data, cacheDuration);

      console.log(`✅ Successfully fetched and cached: ${endpoint}`);
      return data;
    } catch (error) {
      lastError = error;

      if (attempt < MAX_JIKAN_RETRIES && isRetriableJikanError(error)) {
        const delay = 800 * Math.pow(2, attempt); // 800ms, 1.6s, 3.2s
        console.warn(
          `⚠️ Jikan ${
            error.response?.status || error.code
          } for ${endpoint}; retry ${attempt + 1}/${MAX_JIKAN_RETRIES} in ${delay}ms`
        );
        await sleep(delay);
        continue;
      }
      break;
    }
  }

  // All attempts failed — degrade gracefully
  const error = lastError;
  console.error(`❌ Jikan API Error for ${endpoint}:`, error.message);

  // Return cached data if available during error
  if (cache.has(cacheKey)) {
    console.log(`🔄 Returning stale cache data for: ${endpoint}`);
    return cache.get(cacheKey);
  }

  // Fall back to an alternate source (AniList) when provided
  if (typeof options.fallback === "function") {
    try {
      console.warn(`🛟 Falling back to AniList for: ${endpoint}`);
      const fallbackData = await options.fallback();
      const cacheDuration = options.cacheDuration || 1800;
      cache.set(cacheKey, fallbackData, cacheDuration);
      console.log(`✅ AniList fallback succeeded for: ${endpoint}`);
      return fallbackData;
    } catch (fallbackError) {
      console.error(
        `❌ AniList fallback also failed for ${endpoint}:`,
        fallbackError.message
      );
      // fall through to the original Jikan error below
    }
  }

  // Enhanced error handling
  {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      switch (status) {
        case 429:
          throw new Error(
            `Rate limit exceeded. Please try again later. ${message}`
          );
        case 404:
          throw new Error(`Resource not found: ${endpoint}`);
        case 500:
          throw new Error(`Jikan API server error. Please try again later.`);
        default:
          throw new Error(`Jikan API error (${status}): ${message}`);
      }
    } else if (error.code === "ECONNABORTED") {
      throw new Error(
        "Request timeout. Jikan API is taking too long to respond."
      );
    } else {
      throw new Error(`Network error: ${error.message}`);
    }
  }
};

// Specialized fetch functions for different data types
export const fetchAnimeData = async (query = "", page = 1, options = {}) => {
  const limit = options.limit || 25;
  let endpoint = `/anime?page=${page}&limit=${limit}`;

  if (query) {
    endpoint += `&q=${encodeURIComponent(query)}`;
  }

  // Filter params forwarded verbatim to Jikan search
  const filterParams = [
    "genres",
    "status",
    "type",
    "rating",
    "min_score",
    "max_score",
    "start_date",
    "end_date",
    "sfw",
    "order_by",
    "sort",
  ];

  for (const param of filterParams) {
    if (options[param] !== undefined && options[param] !== "") {
      endpoint += `&${param}=${encodeURIComponent(options[param])}`;
    }
  }

  return fetchJikanData(endpoint, {
    cacheDuration: 3600, // 1 hour cache for search results
    fallback: () => alSearchAnime(query, page, options),
  });
};

export const fetchAnimeDetails = async (id) => {
  return fetchJikanData(`/anime/${id}/full`, {
    cacheDuration: 7200, // 2 hours cache for details
    fallback: () => alAnimeDetails(id, "ANIME"),
  });
};

export const fetchMangaData = async (query = "", page = 1, options = {}) => {
  const limit = options.limit || 25;
  let endpoint = `/manga?page=${page}&limit=${limit}`;

  if (query) {
    endpoint += `&q=${encodeURIComponent(query)}`;
  }

  const filterParams = [
    "genres",
    "status",
    "type",
    "min_score",
    "max_score",
    "start_date",
    "end_date",
    "sfw",
    "order_by",
    "sort",
  ];

  for (const param of filterParams) {
    if (options[param] !== undefined && options[param] !== "") {
      endpoint += `&${param}=${encodeURIComponent(options[param])}`;
    }
  }

  return fetchJikanData(endpoint, {
    cacheDuration: 3600,
    fallback: () => alSearchManga(query, page, options),
  });
};

export const fetchMangaDetails = async (id) => {
  return fetchJikanData(`/manga/${id}/full`, {
    cacheDuration: 7200,
    fallback: () => alMangaDetails(id),
  });
};

export const fetchMangaCharacters = async (id) => {
  return fetchJikanData(`/manga/${id}/characters`, { cacheDuration: 7200 });
};

export const fetchMangaReviews = async (id, page = 1) => {
  return fetchJikanData(`/manga/${id}/reviews?page=${page}`, {
    cacheDuration: 3600,
  });
};

export const fetchMangaRecommendations = async (id) => {
  return fetchJikanData(`/manga/${id}/recommendations`, {
    cacheDuration: 7200,
  });
};

export const fetchCharacterData = async (
  query = "",
  page = 1,
  options = {}
) => {
  let endpoint = `/characters?page=${page}&limit=25`;

  if (query) {
    endpoint += `&q=${encodeURIComponent(query)}`;
  }

  // Sort by favorites (likes) by default for top characters
  if (!query) {
    endpoint += `&order_by=favorites&sort=desc`;
  }

  // Allow custom sorting options
  if (options.order_by) {
    endpoint += `&order_by=${options.order_by}`;
  }

  if (options.sort) {
    endpoint += `&sort=${options.sort}`;
  }

  return fetchJikanData(endpoint, { cacheDuration: 3600 });
};

export const fetchCharacterDetails = async (id) => {
  return fetchJikanData(`/characters/${id}/full`, { cacheDuration: 7200 });
};

export const fetchTopAnime = async (
  type = "anime",
  filter = "bypopularity",
  page = 1
) => {
  return fetchJikanData(`/top/${type}?filter=${filter}&page=${page}`, {
    cacheDuration: 7200,
    fallback: () =>
      type === "manga"
        ? alTopManga(filter, page)
        : alTopAnime(type, filter, page),
  });
};

export const fetchGenres = async (type = "anime") => {
  return fetchJikanData(`/genres/${type}`, { cacheDuration: 86400 }); // 24 hours cache for genres
};

export const fetchSeasons = async (year, season) => {
  return fetchJikanData(`/seasons/${year}/${season}`, {
    cacheDuration: 3600,
    // Jikan trending aggregates the current season through fetchSeasons; the
    // AniList "now" season is the closest resilient stand-in.
    fallback: () => alSeasonNow(1),
  });
};

export const fetchSeasonNow = async (page = 1) => {
  return fetchJikanData(`/seasons/now?page=${page}`, {
    cacheDuration: 3600,
    fallback: () => alSeasonNow(page),
  });
};

export const fetchSeasonUpcoming = async (page = 1) => {
  return fetchJikanData(`/seasons/upcoming?page=${page}`, {
    cacheDuration: 3600,
    fallback: () => alSeasonUpcoming(page),
  });
};

// Weekly airing schedule; day = monday..sunday, other, unknown
export const fetchSchedules = async (day, page = 1, limit = 25) => {
  let endpoint = `/schedules?page=${page}&limit=${limit}`;
  if (day) {
    endpoint += `&filter=${encodeURIComponent(day)}`;
  }
  return fetchJikanData(endpoint, {
    cacheDuration: 1800,
    fallback: () => alSchedules(day, page),
  });
};

export const fetchAnimeCharacters = async (id) => {
  return fetchJikanData(`/anime/${id}/characters`, { cacheDuration: 7200 });
};

export const fetchAnimeEpisodes = async (id, page = 1) => {
  return fetchJikanData(`/anime/${id}/episodes?page=${page}`, {
    cacheDuration: 3600,
  });
};

export const fetchAnimeReviews = async (id, page = 1) => {
  return fetchJikanData(`/anime/${id}/reviews?page=${page}`, {
    cacheDuration: 3600,
  });
};

export const fetchAnimeRecommendations = async (id) => {
  return fetchJikanData(`/anime/${id}/recommendations`, {
    cacheDuration: 7200,
  });
};

// Utility function to clear Jikan cache
export const clearJikanCache = (pattern = "jikan:") => {
  const keys = cache.keys();
  const jikanKeys = keys.filter((key) => key.startsWith(pattern));
  cache.del(jikanKeys);
  return jikanKeys.length;
};

export default {
  fetchJikanData,
  fetchAnimeData,
  fetchAnimeDetails,
  fetchMangaData,
  fetchMangaDetails,
  fetchMangaCharacters,
  fetchMangaReviews,
  fetchMangaRecommendations,
  fetchCharacterData,
  fetchCharacterDetails,
  fetchTopAnime,
  fetchGenres,
  fetchSeasons,
  fetchSeasonNow,
  fetchSeasonUpcoming,
  fetchSchedules,
  fetchAnimeCharacters,
  fetchAnimeEpisodes,
  fetchAnimeReviews,
  fetchAnimeRecommendations,
  clearJikanCache,
};
