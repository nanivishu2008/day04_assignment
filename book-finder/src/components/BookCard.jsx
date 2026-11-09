import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * BookCard component wrapped in React.memo to prevent unnecessary re-renders
 * when parent re-renders but props (book, isFav, onToggleFavourite) are unchanged.
 * Includes a render counter utilizing useRef to visually demonstrate render optimization.
 */
export const BookCard = React.memo(function BookCard({
  book,
  isFav = false,
  onToggleFavourite,
}) {
  // Requirement: useRef render counter
  const renderCount = useRef(0);
  renderCount.current += 1;

  const [imgError, setImgError] = useState(false);

  // Extract clean work ID (strip "/works/")
  const rawKey = book.key || book.id || "";
  const workId = rawKey.replace(/^\/works\//, "");

  const title = book.title || "Untitled Book";
  const authors = Array.isArray(book.author_name)
    ? book.author_name.join(", ")
    : book.author_name || "Unknown Author";
  const publishYear = book.first_publish_year || book.first_publish_date || "Year unknown";

  const coverUrl =
    book.cover_i && !imgError
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : null;

  const handleFavClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavourite) {
      onToggleFavourite(book);
    }
  };

  return (
    <article className="book-card" data-book-id={workId}>
      {/* Visual Render Counter Badge demonstrating useRef & React.memo */}
      <span className="render-badge" title="Renders counted by useRef">
        Renders: {renderCount.current}
      </span>

      <div className="book-cover-wrapper">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Cover of ${title}`}
            className="book-cover-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="book-cover-placeholder">
            <span className="placeholder-icon">📖</span>
            <span className="placeholder-text">No Cover Available</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleFavClick}
          className={`favourite-btn ${isFav ? "is-fav" : ""}`}
          title={isFav ? "Remove from favourites" : "Add to favourites"}
          aria-label={isFav ? `Remove ${title} from favourites` : `Add ${title} to favourites`}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="book-card-body">
        <h3 className="book-title" title={title}>
          <Link to={`/books/${workId}`} className="book-title-link">
            {title}
          </Link>
        </h3>

        <p className="book-author" title={authors}>
          ✍️ {authors}
        </p>

        <p className="book-year">
          📅 First published: <strong>{publishYear}</strong>
        </p>

        <div className="book-card-actions">
          <Link to={`/books/${workId}`} className="view-details-btn">
            View Details →
          </Link>
          <button
            type="button"
            onClick={handleFavClick}
            className={`fav-action-btn ${isFav ? "active" : ""}`}
          >
            {isFav ? "Favorited ✓" : "+ Favorite"}
          </button>
        </div>
      </div>
    </article>
  );
});

export default BookCard;
