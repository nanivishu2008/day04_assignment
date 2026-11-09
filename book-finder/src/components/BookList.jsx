import { useMemo, useState } from "react";
import BookCard from "./BookCard";

/**
 * BookList component that demonstrates useMemo for expensive filtering and sorting operations.
 */
export function BookList({
  books = [],
  onToggleFavourite,
  isFavourite,
}) {
  const [minYear, setMinYear] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Calculate minimum and maximum publication years from available books for helper UI
  const availableYears = useMemo(() => {
    const years = books
      .map((b) => Number(b.first_publish_year))
      .filter((y) => !isNaN(y) && y > 0);
    return {
      min: years.length ? Math.min(...years) : 1800,
      max: years.length ? Math.max(...years) : new Date().getFullYear(),
    };
  }, [books]);

  // Requirement: useMemo for filtering and sorting
  const filteredAndSortedBooks = useMemo(() => {
    if (!books || !Array.isArray(books)) return [];

    let result = [...books];

    // Filter by minimum publication year
    if (minYear !== "" && !isNaN(Number(minYear))) {
      const yearThreshold = Number(minYear);
      result = result.filter(
        (book) => Number(book.first_publish_year) >= yearThreshold
      );
    }

    // Sort according to user selection
    if (sortBy === "year-asc") {
      result.sort((a, b) => {
        const yearA = Number(a.first_publish_year) || 9999;
        const yearB = Number(b.first_publish_year) || 9999;
        return yearA - yearB;
      });
    } else if (sortBy === "year-desc") {
      result.sort((a, b) => {
        const yearA = Number(a.first_publish_year) || 0;
        const yearB = Number(b.first_publish_year) || 0;
        return yearB - yearA;
      });
    } else if (sortBy === "title-asc") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    } else if (sortBy === "title-desc") {
      result.sort((a, b) =>
        (b.title || "").localeCompare(a.title || "")
      );
    }

    return result;
  }, [books, minYear, sortBy]);

  if (!books || books.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-title">No books to display</p>
        <p className="empty-subtitle">Try searching for something above or browse popular titles.</p>
      </div>
    );
  }

  return (
    <section className="book-list-section">
      <div className="filter-sort-bar">
        <div className="filter-group">
          <label htmlFor="min-year-input" className="filter-label">
            Min Publication Year:
          </label>
          <input
            id="min-year-input"
            type="number"
            className="filter-input"
            placeholder={`e.g. ${availableYears.min}`}
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)}
            min="1000"
            max={new Date().getFullYear()}
          />
          {minYear && (
            <button
              type="button"
              className="reset-filter-btn"
              onClick={() => setMinYear("")}
              title="Reset year filter"
            >
              Reset
            </button>
          )}
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select" className="filter-label">
            Sort By:
          </label>
          <select
            id="sort-select"
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Relevance (Default)</option>
            <option value="year-asc">Publish Year: Oldest to Newest</option>
            <option value="year-desc">Publish Year: Newest to Oldest</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
          </select>
        </div>

        <div className="results-count">
          Showing <strong>{filteredAndSortedBooks.length}</strong> of{" "}
          <strong>{books.length}</strong> books
        </div>
      </div>

      {filteredAndSortedBooks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No books match your active filters</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setMinYear("");
              setSortBy("default");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="books-grid">
          {filteredAndSortedBooks.map((book) => {
            const rawKey = book.key || book.id || "";
            const workId = rawKey.replace(/^\/works\//, "");
            const fav = isFavourite ? isFavourite(rawKey) : false;

            return (
              <BookCard
                key={workId || book.cover_edition_key || book.title}
                book={book}
                isFav={fav}
                onToggleFavourite={onToggleFavourite}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default BookList;
