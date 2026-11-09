import { useContext } from "react";
import { FavouritesContext } from "../context/FavouritesContext";

/**
 * Custom hook to consume the FavouritesContext.
 * Provides access to favourites array and addFavourite / removeFavourite / isFavourite handlers.
 */
export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
}

export default useFavourites;
