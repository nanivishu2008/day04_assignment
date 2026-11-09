import { useCallback } from "react";
import { Link } from "react-router-dom";
import useFavourites from "../hooks/useFavourites";
import BookList from "../components/BookList";

export function Favourites() {
  const { favourites, removeFavourite, isFavourite } = useFavourites();

  const handleToggleFavourite = useCallback(
    (book) => {
      const bookKey = book.key || book.id;
      removeFavourite(bookKey);
    },
    [removeFavourite]
  );

  return (
    <div className="favourites-page container">
      <header className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">⭐ Your Favourite Books</h1>
          <p className="page-subtitle">
            Books you have saved to your personal collection. Saved locally in your browser.
          </p>
        </div>
        <div className="fav-total-chip">
          Total Saved: <strong>{favourites.length}</strong>
        </div>
      </header>

      {favourites.length === 0 ? (
        <div className="empty-favourites-card">
          <span className="empty-icon">📚</span>
          <h2>No favourite books yet!</h2>
          <p>
            You haven't added any books to your favourites. Browse our search catalog to find titles you love.
          </p>
          <Link to="/" className="btn-primary">
            Search Books Now
          </Link>
        </div>
      ) : (
        <BookList
          books={favourites}
          onToggleFavourite={handleToggleFavourite}
          isFavourite={isFavourite}
        />
      )}
    </div>
  );
}

export default Favourites;
