// Characters — "Ink & Impact": dossier card grid with search
import React, { useState, useEffect, useCallback } from "react";
import { searchCharacters, getTopCharacters } from "../services/anime";
import InkCharacterCard from "../components/ink/InkCharacterCard";
import InkEmptyState from "../components/ink/InkEmptyState";
import { InkGridSkeleton } from "../components/ink/InkSkeleton";

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
    <div className="animate-popIn px-6 pb-16 pt-10 md:px-[72px]">
      <h1 className="ink-display m-0 mb-2 text-4xl md:text-[44px]">
        Character <span className="text-ink-red">Files</span>
      </h1>
      <p className="mb-6 text-[13.5px] font-medium text-ink-mut3">
        Dossiers on every hero, rival and menace — portraits load from the
        Jikan API
      </p>

      {/* Search */}
      <form onSubmit={submitSearch} className="mb-8 flex items-center gap-3.5">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="SEARCH THE FILES..."
          className="ink-shadow-sm min-w-0 flex-1 border-[3px] border-ink bg-ink-paper px-4 py-3.5 font-body text-sm font-bold tracking-[1px] text-ink outline-none placeholder:text-ink-mut4"
        />
        <button
          type="submit"
          className="ink-display ink-shadow-sm rotate-2 cursor-pointer border-[3px] border-ink bg-ink-red px-4 py-3 text-sm text-ink-paper"
        >
          検索!
        </button>
      </form>

      {error && (
        <InkEmptyState
          shout="SIGNAL LOST!!"
          sub={error}
          ctaLabel="Retry"
          ctaTo="/characters"
        />
      )}

      {loading && characters.length === 0 ? (
        <InkGridSkeleton count={8} />
      ) : showEmpty ? (
        <InkEmptyState
          shout="NANI?! NO ONE HERE..."
          sub={
            isSearchMode
              ? `No characters match "${searchTerm}".`
              : "Unable to load characters right now."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {characters.map((character, index) => (
            <InkCharacterCard
              key={`${character.mal_id}-${character.name}`}
              character={character}
              rank={isSearchMode ? undefined : index + 1}
            />
          ))}
        </div>
      )}

      {characters.length > 0 && hasNextPage && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="ink-btn ink-press ink-sh-red bg-ink px-10 py-4 text-sm text-ink-paper disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "LOADING..." : "LOAD MORE →"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Characters;
