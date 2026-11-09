import { createContext, useState, useEffect, useCallback, useMemo } from "react";

export const FavouritesContext = createContext(null);

const STORAGE_KEY = "bookfinder_favourites";

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load favourites from storage:", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch (e) {
      console.error("Failed to save favourites to storage:", e);
    }
  }, [favourites]);

  // Helper to extract clean work ID (e.g. "OL45804W") from "/works/OL45804W" or "OL45804W"
  const getCleanId = (keyOrId) => {
    if (!keyOrId) return "";
    return String(keyOrId).replace(/^\/works\//, "");
  };

  const addFavourite = useCallback((book) => {
    if (!book) return;
    const targetId = getCleanId(book.key || book.id);
    if (!targetId) return;

    setFavourites((prev) => {
      const exists = prev.some((b) => getCleanId(b.key || b.id) === targetId);
      if (exists) return prev;
      return [...prev, book];
    });
  }, []);

  const removeFavourite = useCallback((bookKeyOrId) => {
    if (!bookKeyOrId) return;
    const targetId = getCleanId(bookKeyOrId);

    setFavourites((prev) =>
      prev.filter((b) => getCleanId(b.key || b.id) !== targetId)
    );
  }, []);

  const isFavourite = useCallback(
    (bookKeyOrId) => {
      if (!bookKeyOrId) return false;
      const targetId = getCleanId(bookKeyOrId);
      return favourites.some((b) => getCleanId(b.key || b.id) === targetId);
    },
    [favourites]
  );

  const value = useMemo(
    () => ({
      favourites,
      addFavourite,
      removeFavourite,
      isFavourite,
    }),
    [favourites, addFavourite, removeFavourite, isFavourite]
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export default FavouritesContext;
