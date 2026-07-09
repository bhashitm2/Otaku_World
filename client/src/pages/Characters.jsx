// Characters — Nova: circular avatar grid with search
import React, { useState, useEffect, useCallback } from "react";
import { searchCharacters, getTopCharacters } from "../services/anime";
import {
  CharacterCard,
  EmptyState,
  GridSkeleton,
  Button,
} from "../components/nova";

const AVATAR_GRID =
  "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-[26px] gap-y-[34px]";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const loadTop = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTopCharacters();
      if (response?.data) {
        setCharacters(response.data);
        setHasNextPage(response.pagination?.has_next_page || false);
        setCurrentPage(1);
        setIsSearchMode(false);
      }
    } catch (err) {
      console.error("Error loading top characters:", err);
      setError("Failed to load characters.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTop();
  }, [loadTop]);

  const runSearch = async (query) => {
    if (!query.trim()) {
      setSearchTerm("");
      loadTop();
      return;
    }
    setLoading(true);
    setError(null);
    setSearchTerm(query);
    setIsSearchMode(true);
    try {
      const response = await searchCharacters(query, 1, 25, {
        order_by: "favorites",
        sort: "desc",
      });
      setCharacters(response?.data || []);
      setHasNextPage(response?.pagination?.has_next_page || false);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error searching characters:", err);
      setError("Failed to search characters.");
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasNextPage || loading) return;
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response =
        isSearchMode && searchTerm
          ? await searchCharacters(searchTerm, nextPage, 25, {
              order_by: "favorites",
              sort: "desc",
            })
          : await getTopCharacters(nextPage);
      if (response?.data) {
        setCharacters((prev) => {
          const ids = new Set(prev.map((c) => c.mal_id));
          return [...prev, ...response.data.filter((c) => !ids.has(c.mal_id))];
        });
        setCurrentPage(nextPage);
        setHasNextPage(response.pagination?.has_next_page || false);
      }
    } catch (err) {
      console.error("Error loading more characters:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitSearch = (e) => {
    e.preventDefault();
    runSearch(searchInput.trim());
  };

  const showEmpty = !loading && !error && characters.length === 0;

  return (
    <div className="px-gutter pb-20 pt-10 lg:px-gutter-lg">
      <h1 className="m-0 mb-2 font-display text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
        Characters
      </h1>
      <p className="mb-6 text-[14.5px] text-muted">
        The community's most beloved cast, ranked by fans
      </p>

      {/* Search */}
      <form onSubmit={submitSearch} className="mb-10 flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-faint">
            ⌕
          </span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search characters…"
            className="w-full rounded-sm border border-line bg-surface-2 py-3 pl-10 pr-4 font-body text-sm text-text outline-none transition-colors duration-fast placeholder:text-faint focus:border-line-strong"
          />
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      {error && (
        <EmptyState
          glyph="⚠"
          title="Couldn't load characters"
          sub={error}
          ctaLabel="Retry"
          ctaTo="/characters"
        />
      )}

      {loading && characters.length === 0 ? (
        <GridSkeleton count={10} />
      ) : showEmpty ? (
        <EmptyState
          title="No one's here"
          sub={
            isSearchMode
              ? `No characters match "${searchTerm}".`
              : "Unable to load characters right now."
          }
        />
      ) : (
        <div className={AVATAR_GRID}>
          {characters.map((character, index) => (
            <CharacterCard
              key={`${character.mal_id}-${character.name}`}
              character={character}
              rank={isSearchMode ? undefined : index + 1}
            />
          ))}
        </div>
      )}

      {characters.length > 0 && hasNextPage && (
        <div className="mt-12 text-center">
          <Button
            variant="subtle"
            size="lg"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Characters;
