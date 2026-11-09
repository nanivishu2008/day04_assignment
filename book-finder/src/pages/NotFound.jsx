import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="not-found-page container">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-desc">
          Oops! The page or book work ID you are looking for does not exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            ← Return to Book Search
          </Link>
          <Link to="/favourites" className="btn-secondary">
            View Favourites
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
