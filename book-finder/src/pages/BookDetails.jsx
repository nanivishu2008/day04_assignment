import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useCallback, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import useFavourites from "../hooks/useFavourites";
import Loader from "../components/Loader";

export function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Clean the id in case it contains works prefix
  const cleanId = (id || "").replace(/^\/works\//, "");

  // Open Library Works endpoint: https://openlibrary.org/works/{id}.json
  const workUrl = cleanId
    ? `https://openlibrary.org/works/${cleanId}.json`
    : null;

  const { data, loading, error } = useFetch(workUrl);
  const { isFavourite, addFavourite, removeFavourite } = useFavourites();

  const isFav = isFavourite(cleanId);

  // Parse description: Open Library often returns string or { type: '/type/text', value: '...' }
  const descriptionText = useMemo(() => {
    if (!data?.description) return "No description available for this work.";
    if (typeof data.description === "string") return data.description;
    if (typeof data.description === "object" && data.description.value) {
      return data.description.value;
    }
    return "No description available.";
  }, [data]);

  const coverId = Array.isArray(data?.covers) && data.covers.length > 0 ? data.covers[0] : null;
  const coverUrl =
    coverId && !imgError
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : null;

  const handleToggleFavourite = useCallback(() => {
    if (!data && !cleanId) return;

    if (isFav) {
      removeFavourite(cleanId);
    } else {
      // Shape book object so it works uniformly with search results in BookCard / Favourites
      const bookPayload = {
        key: `/works/${cleanId}`,
        id: cleanId,
        title: data?.title || "Untitled Work",
        cover_i: coverId,
        first_publish_year: data?.first_publish_date || "Unknown",
        subjects: data?.subjects || [],
      };
      addFavourite(bookPayload);
    }
  }, [isFav, cleanId, data, coverId, addFavourite, removeFavourite]);

  return (
    <div className="book-details-page container">
      <div className="back-nav">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-btn"
          aria-label="Go back to previous page"
        >
          ← Back
        </button>
        <Link to="/" className="home-link">
          Search Books
        </Link>
      </div>

      {loading && <Loader message="Fetching book details from Open Library..." />}

      {error && (
        <div className="error-banner" role="alert">
          <span className="error-icon">⚠️</span>
          <div>
            <strong>Error loading book details:</strong> {error}
            <p className="error-hint">Work ID requested: <code>{cleanId}</code></p>
          </div>
          <Link to="/" className="retry-btn">
            Return to Search
          </Link>
        </div>
      )}

      {!loading && !error && data && (
        <article className="details-card">
          <div className="details-layout">
            <div className="details-cover-col">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={`Cover of ${data.title}`}
                  className="details-cover-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="details-cover-placeholder">
                  <span className="placeholder-icon">📖</span>
                  <span>No Large Cover Available</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleToggleFavourite}
                className={`details-fav-btn ${isFav ? "is-fav" : ""}`}
              >
                {isFav ? "❤️ In Favourites" : "🤍 Add to Favourites"}
              </button>
            </div>

            <div className="details-content-col">
              <span className="work-id-badge">ID: {cleanId}</span>
              <h1 className="details-title">{data.title || "Untitled Book"}</h1>

              {data.first_publish_date && (
                <p className="details-meta">
                  <strong>First Published:</strong> {data.first_publish_date}
                </p>
              )}

              {data.created?.value && (
                <p className="details-meta">
                  <strong>Record Created:</strong>{" "}
                  {new Date(data.created.value).toLocaleDateString()}
                </p>
              )}

              <div className="details-description-section">
                <h2>About this book</h2>
                <div className="description-text">
                  {descriptionText.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {Array.isArray(data.subjects) && data.subjects.length > 0 && (
                <div className="details-subjects-section">
                  <h3>Subjects & Genres</h3>
                  <div className="subject-pills">
                    {data.subjects.slice(0, 15).map((subject, idx) => (
                      <span key={idx} className="subject-pill">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="external-link-row">
                <a
                  href={`https://openlibrary.org/works/${cleanId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="openlibrary-link"
                >
                  View on Open Library ↗
                </a>
              </div>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}

export default BookDetails;
