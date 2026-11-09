import { useState, useCallback, useRef } from "react";
import SearchBar from "../components/SearchBar";
import BookList from "../components/BookList";
import Loader from "../components/Loader";
import useDebounce from "../hooks/useDebounce";
import useFetch from "../hooks/useFetch";
import useFavourites from "../hooks/useFavourites";

const POPULAR_SEARCHES = [
  "Harry Potter",
  "Lord of the Rings",
  "Dune",
  "JavaScript",
  "Pride and Prejudice",
];

export function Home() {
  const [query, setQuery] = useState("Harry Potter"); // Initial default search for instant gratification
  const debouncedQuery = useDebounce(query, 500);

  // Requirement: useRef render counter to track Home renders
  const homeRenderCount = useRef(0);
  homeRenderCount.current += 1;

  const { isFavourite, addFavourite, removeFavourite } = useFavourites();

  // Construct search API URL only when debounced query is not empty
  const trimmedQuery = debouncedQuery.trim();
  const searchUrl = trimmedQuery
    ? `https://openlibrary.org/search.json?q=${encodeURIComponent(
        trimmedQuery
      )}&limit=20`
    : null;

  // Requirement: useFetch with AbortController cancellation
  const { data, loading, error } = useFetch(searchUrl);

  const books = data?.docs || [];

  // Requirement: useCallback for stable favourite toggle handler
  const handleToggleFavourite = useCallback(
    (book) => {
      const bookKey = book.key || book.id;
      if (isFavourite(bookKey)) {
        removeFavourite(bookKey);
      } else {
        addFavourite(book);
      }
    },
    [isFavourite, addFavourite, removeFavourite]
  );

  const handleClear = useCallback(() => {
    setQuery("");
  }, []);

  return (
    <div className="home-page container">
      <section className="hero-section">
        <h1 className="hero-title">Find Your Next Great Read</h1>
        <p className="hero-subtitle">
          Search millions of titles via the Open Library API with debounced instant lookups.
        </p>
        <span className="page-render-tag" title="Home render count via useRef">
          🔄 Page Renders: {homeRenderCount.current}
        </span>
      </section>

      <section className="search-section">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={handleClear}
          placeholder="Search by title, author, or subject (e.g. Harry Potter)..."
        />

        <div className="quick-tags">
          <span className="quick-label">Try searching:</span>
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              className={`quick-tag-btn ${query === term ? "active" : ""}`}
              onClick={() => setQuery(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      <main className="results-section">
        {loading && <Loader message={`Searching for "${trimmedQuery}"...`} />}

        {error && (
          <div className="error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <div className="error-text">
              <strong>Search Error:</strong> {error}
            </div>
            <button
              type="button"
              className="retry-btn"
              onClick={() => setQuery((prev) => prev)}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && trimmedQuery === "" && (
          <div className="initial-state">
            <span className="initial-icon">🔍</span>
            <h2>Start typing above to search</h2>
            <p>Your search begins automatically 500ms after you stop typing.</p>
          </div>
        )}

        {!loading && !error && trimmedQuery !== "" && (
          <BookList
            books={books}
            onToggleFavourite={handleToggleFavourite}
            isFavourite={isFavourite}
          />
        )}
      </main>
    </div>
  );
}

export default Home;
