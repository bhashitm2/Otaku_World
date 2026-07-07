// server/utils/anilistHelper.js
// AniList (GraphQL) fallback for when Jikan/MyAnimeList is unreachable.
// Every function returns data in the SAME shape Jikan returns, so controllers
// and the client need no changes. AniList `Media.idMal` preserves MAL IDs, so
// favorites/watchlist/routes keep working. Characters are NOT covered (AniList
// character IDs have no MAL equivalent).
import axios from "axios";

const ANILIST_URL =
  process.env.ANILIST_GRAPHQL_URL || "https://graphql.anilist.co";

const gql = async (query, variables) => {
  const response = await axios.post(
    ANILIST_URL,
    { query, variables },
    {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  if (response.data?.errors?.length) {
    throw new Error(
      `AniList error: ${response.data.errors[0]?.message || "unknown"}`
    );
  }
  return response.data?.data;
};

// ---------- shape mappers (AniList Media -> Jikan object) ----------

const stripHtml = (html) =>
  html
    ? html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&mdash;/g, "—")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .trim()
    : null;

const FORMAT_TO_TYPE = {
  TV: "TV",
  TV_SHORT: "TV",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
  MANGA: "Manga",
  NOVEL: "Novel",
  ONE_SHOT: "One-shot",
};

const statusToJikan = (status, isManga) => {
  switch (status) {
    case "RELEASING":
      return isManga ? "Publishing" : "Currently Airing";
    case "FINISHED":
      return isManga ? "Finished" : "Finished Airing";
    case "NOT_YET_RELEASED":
      return isManga ? "Not yet published" : "Not yet aired";
    case "CANCELLED":
      return "Cancelled";
    case "HIATUS":
      return "On Hiatus";
    default:
      return null;
  }
};

const SEASON_TO_JIKAN = {
  WINTER: "winter",
  SPRING: "spring",
  SUMMER: "summer",
  FALL: "fall",
};

// Convert one AniList Media node into the Jikan anime/manga object shape.
export const mapMedia = (media) => {
  if (!media) return null;
  const isManga = media.type === "MANGA";
  const cover =
    media.coverImage?.extraLarge || media.coverImage?.large || null;
  const image = media.coverImage?.large || media.coverImage?.extraLarge || null;

  return {
    mal_id: media.idMal,
    title: media.title?.romaji || media.title?.english || "Unknown Title",
    title_english: media.title?.english || null,
    title_japanese: media.title?.native || null,
    images: {
      jpg: {
        image_url: image,
        large_image_url: cover,
        small_image_url: image,
      },
      webp: {
        image_url: image,
        large_image_url: cover,
        small_image_url: image,
      },
    },
    score:
      typeof media.averageScore === "number"
        ? Math.round((media.averageScore / 10) * 10) / 10
        : null,
    rank: null, // AniList has no direct MAL-equivalent rank
    popularity: media.popularity ?? null,
    members: media.popularity ?? null,
    favorites: media.favourites ?? null,
    episodes: media.episodes ?? null,
    chapters: media.chapters ?? null,
    volumes: media.volumes ?? null,
    status: statusToJikan(media.status, isManga),
    type: FORMAT_TO_TYPE[media.format] || (isManga ? "Manga" : null),
    rating: null,
    duration: media.duration ? `${media.duration} min` : null,
    genres: (media.genres || []).map((name) => ({ mal_id: name, name })),
    synopsis: stripHtml(media.description),
    background: null,
    season: SEASON_TO_JIKAN[media.season] || null,
    year: media.seasonYear || media.startDate?.year || null,
    aired: {
      from: null,
      to: null,
      prop: {
        from: {
          day: media.startDate?.day || null,
          month: media.startDate?.month || null,
          year: media.startDate?.year || null,
        },
      },
      string: media.startDate?.year ? `${media.startDate.year}` : null,
    },
    published: isManga
      ? {
          prop: {
            from: { year: media.startDate?.year || null },
          },
          string: media.startDate?.year ? `${media.startDate.year}` : null,
        }
      : undefined,
    studios: (media.studios?.nodes || []).map((s) => ({
      mal_id: s.id,
      name: s.name,
    })),
    authors: [],
    serializations: [],
    url: media.idMal
      ? `https://myanimelist.net/${isManga ? "manga" : "anime"}/${media.idMal}`
      : null,
    _source: "anilist",
  };
};

// Only keep entries that have a MAL id, so /anime/:id and /manga/:id links
// (and favorites/watchlist keyed on mal_id) resolve correctly.
const mapMediaList = (nodes = []) =>
  nodes.map(mapMedia).filter((m) => m && m.mal_id);

const buildPagination = (pageInfo, count) => ({
  last_visible_page: pageInfo?.lastPage ?? 1,
  has_next_page: pageInfo?.hasNextPage ?? false,
  current_page: pageInfo?.currentPage ?? 1,
  items: {
    count,
    total: pageInfo?.total ?? count,
    per_page: pageInfo?.perPage ?? count,
  },
});

// ---------- request-param mappers (Jikan options -> AniList vars) ----------

// Best-effort MAL genre-id -> AniList genre-name map (overlapping genres only;
// unmapped ids are dropped so the query still runs during a fallback).
const MAL_GENRE_TO_ANILIST = {
  1: "Action",
  2: "Adventure",
  4: "Comedy",
  8: "Drama",
  9: "Ecchi",
  10: "Fantasy",
  14: "Horror",
  7: "Mystery",
  22: "Romance",
  24: "Sci-Fi",
  36: "Slice of Life",
  30: "Sports",
  37: "Supernatural",
  41: "Thriller",
  18: "Mecha",
  19: "Music",
  40: "Psychological",
};

const mapGenres = (genresCsv) => {
  if (!genresCsv) return undefined;
  const names = String(genresCsv)
    .split(",")
    .map((id) => MAL_GENRE_TO_ANILIST[Number(id.trim())])
    .filter(Boolean);
  return names.length ? names : undefined;
};

const FORMAT_MAP = {
  tv: "TV",
  movie: "MOVIE",
  ova: "OVA",
  special: "SPECIAL",
  ona: "ONA",
  music: "MUSIC",
  manga: "MANGA",
  novel: "NOVEL",
  lightnovel: "NOVEL",
  oneshot: "ONE_SHOT",
};

const STATUS_MAP = {
  airing: "RELEASING",
  publishing: "RELEASING",
  complete: "FINISHED",
  upcoming: "NOT_YET_RELEASED",
};

// YYYY-MM-DD -> FuzzyDateInt (YYYYMMDD)
const fuzzyDate = (dateStr) =>
  dateStr ? Number(dateStr.replace(/-/g, "")) : undefined;

const mapSearchVars = (options = {}) => {
  const vars = {};
  const genreIn = mapGenres(options.genres);
  if (genreIn) vars.genre_in = genreIn;
  if (options.type && FORMAT_MAP[options.type])
    vars.format_in = [FORMAT_MAP[options.type]];
  if (options.status && STATUS_MAP[options.status])
    vars.status = STATUS_MAP[options.status];
  if (options.min_score)
    vars.averageScore_greater = Math.round(Number(options.min_score) * 10);
  if (options.start_date) vars.startDate_greater = fuzzyDate(options.start_date);
  if (options.end_date) vars.startDate_lesser = fuzzyDate(options.end_date);
  return vars;
};

const sortFor = (query, options) => {
  if (options.order_by === "score") return ["SCORE_DESC"];
  if (options.order_by === "members" || options.order_by === "popularity")
    return ["POPULARITY_DESC"];
  return query ? ["SEARCH_MATCH"] : ["POPULARITY_DESC"];
};

// ---------- GraphQL documents ----------

const MEDIA_FIELDS = `
  id idMal
  title { romaji english native }
  type format status
  description(asHtml: false)
  startDate { year month day }
  season seasonYear
  episodes duration chapters volumes
  coverImage { extraLarge large }
  genres
  averageScore popularity favourites
  studios(isMain: true) { nodes { id name } }
`;

const MEDIA_LIST_QUERY = `
query ($page:Int,$perPage:Int,$search:String,$type:MediaType,$sort:[MediaSort],
       $genre_in:[String],$format_in:[MediaFormat],$status:MediaStatus,
       $averageScore_greater:Int,$season:MediaSeason,$seasonYear:Int,
       $startDate_greater:FuzzyDateInt,$startDate_lesser:FuzzyDateInt) {
  Page(page:$page, perPage:$perPage) {
    pageInfo { total currentPage lastPage hasNextPage perPage }
    media(search:$search, type:$type, sort:$sort, genre_in:$genre_in,
          format_in:$format_in, status:$status,
          averageScore_greater:$averageScore_greater, season:$season,
          seasonYear:$seasonYear, startDate_greater:$startDate_greater,
          startDate_lesser:$startDate_lesser, isAdult:false) {
      ${MEDIA_FIELDS}
    }
  }
}`;

const MEDIA_DETAILS_QUERY = `
query ($idMal:Int,$type:MediaType) {
  Media(idMal:$idMal, type:$type) { ${MEDIA_FIELDS} }
}`;

const SCHEDULE_QUERY = `
query ($page:Int,$perPage:Int,$airingAt_greater:Int,$airingAt_lesser:Int) {
  Page(page:$page, perPage:$perPage) {
    pageInfo { total currentPage lastPage hasNextPage perPage }
    airingSchedules(airingAt_greater:$airingAt_greater,
                    airingAt_lesser:$airingAt_lesser, sort:TIME) {
      airingAt episode
      media { ${MEDIA_FIELDS} }
    }
  }
}`;

// ---------- exported fetchers (Jikan-shaped return values) ----------

const runMediaList = async (vars) => {
  const data = await gql(MEDIA_LIST_QUERY, vars);
  const page = data?.Page;
  const items = mapMediaList(page?.media);
  return { data: items, pagination: buildPagination(page?.pageInfo, items.length) };
};

export const alSearchAnime = (query = "", page = 1, options = {}) =>
  runMediaList({
    page: Number(page) || 1,
    perPage: 25,
    search: query || undefined,
    type: "ANIME",
    sort: sortFor(query, options),
    ...mapSearchVars(options),
  });

export const alSearchManga = (query = "", page = 1, options = {}) =>
  runMediaList({
    page: Number(page) || 1,
    perPage: 25,
    search: query || undefined,
    type: "MANGA",
    sort: sortFor(query, options),
    ...mapSearchVars(options),
  });

export const alTopAnime = (type = "anime", filter = "bypopularity", page = 1) => {
  const vars = {
    page: Number(page) || 1,
    perPage: 25,
    type: "ANIME",
    sort: filter === "favorite" ? ["SCORE_DESC"] : ["POPULARITY_DESC"],
  };
  if (filter === "airing") vars.status = "RELEASING";
  if (filter === "upcoming") vars.status = "NOT_YET_RELEASED";
  return runMediaList(vars);
};

export const alTopManga = (filter = "bypopularity", page = 1) =>
  runMediaList({
    page: Number(page) || 1,
    perPage: 25,
    type: "MANGA",
    sort: filter === "favorite" ? ["SCORE_DESC"] : ["POPULARITY_DESC"],
  });

export const alAnimeDetails = async (malId, type = "ANIME") => {
  const data = await gql(MEDIA_DETAILS_QUERY, {
    idMal: Number(malId),
    type,
  });
  return { data: mapMedia(data?.Media) };
};

export const alMangaDetails = (malId) => alAnimeDetails(malId, "MANGA");

const currentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "SPRING";
  if (month >= 6 && month <= 8) return "SUMMER";
  if (month >= 9 && month <= 11) return "FALL";
  return "WINTER";
};

const nextSeason = () => {
  const order = ["WINTER", "SPRING", "SUMMER", "FALL"];
  const idx = order.indexOf(currentSeason());
  const next = order[(idx + 1) % 4];
  const year =
    next === "WINTER" && currentSeason() === "FALL"
      ? new Date().getFullYear() + 1
      : new Date().getFullYear();
  return { season: next, year };
};

export const alSeasonNow = (page = 1) =>
  runMediaList({
    page: Number(page) || 1,
    perPage: 25,
    type: "ANIME",
    season: currentSeason(),
    seasonYear: new Date().getFullYear(),
    sort: ["POPULARITY_DESC"],
  });

export const alSeasonUpcoming = (page = 1) => {
  const { season, year } = nextSeason();
  return runMediaList({
    page: Number(page) || 1,
    perPage: 25,
    type: "ANIME",
    season,
    seasonYear: year,
    sort: ["POPULARITY_DESC"],
  });
};

const JST_OFFSET = 9 * 3600; // seconds
const DAY_INDEX = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// Weekday airing schedule for `day`, matching Jikan's /schedules?filter=<day>.
export const alSchedules = async (day, page = 1) => {
  const nowSec = Math.floor(Date.now() / 1000);
  const jstNow = new Date((nowSec + JST_OFFSET) * 1000); // JST wall clock as UTC
  const jstWeekday = jstNow.getUTCDay();
  const target = DAY_INDEX[day] ?? jstWeekday;
  const diff = (target - jstWeekday + 7) % 7;

  // midnight JST of the target weekday, expressed as a real UTC unix timestamp
  const start =
    Date.UTC(
      jstNow.getUTCFullYear(),
      jstNow.getUTCMonth(),
      jstNow.getUTCDate() + diff,
      0,
      0,
      0
    ) /
      1000 -
    JST_OFFSET;
  const end = start + 24 * 3600 - 1;

  const data = await gql(SCHEDULE_QUERY, {
    page: Number(page) || 1,
    perPage: 50,
    airingAt_greater: start,
    airingAt_lesser: end,
  });

  const schedules = data?.Page?.airingSchedules || [];
  const items = schedules
    .map((s) => {
      const media = mapMedia(s.media);
      if (!media || !media.mal_id) return null;
      const jst = new Date((s.airingAt + JST_OFFSET) * 1000);
      const hh = String(jst.getUTCHours()).padStart(2, "0");
      const mm = String(jst.getUTCMinutes()).padStart(2, "0");
      return {
        ...media,
        broadcast: {
          day: day ? `${day.charAt(0).toUpperCase()}${day.slice(1)}s` : null,
          time: `${hh}:${mm}`,
          timezone: "Asia/Tokyo",
          string: `${day || ""} at ${hh}:${mm} (JST)`.trim(),
        },
      };
    })
    .filter(Boolean);

  return {
    data: items,
    pagination: buildPagination(data?.Page?.pageInfo, items.length),
  };
};

export default {
  alSearchAnime,
  alSearchManga,
  alTopAnime,
  alTopManga,
  alAnimeDetails,
  alMangaDetails,
  alSeasonNow,
  alSeasonUpcoming,
  alSchedules,
  mapMedia,
};
