import { NavLink } from "react-router-dom";
import { useFavourites } from "../hooks/useFavourites";

export function Navbar() {
  const { favourites } = useFavourites();
  const favouritesCount = favourites.length;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">📚</span>
          <span className="brand-text">BookFinder</span>
        </NavLink>

        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Search
          </NavLink>

          <NavLink
            to="/favourites"
            className={({ isActive }) =>
              `nav-link fav-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span>Favourites</span>
            <span
              className={`fav-counter-badge ${
                favouritesCount > 0 ? "has-favs" : ""
              }`}
              title={`${favouritesCount} favourite books saved`}
            >
              {favouritesCount}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
