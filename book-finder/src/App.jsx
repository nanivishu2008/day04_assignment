import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";
import Favourites from "./pages/Favourites";
import NotFound from "./pages/NotFound";
import { FavouritesProvider } from "./context/FavouritesContext";

export function App() {
  return (
    <FavouritesProvider>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>
            Book Finder App • Powered by{" "}
            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Library API
            </a>{" "}
            • Built with React & Vite
          </p>
        </footer>
      </div>
    </FavouritesProvider>
  );
}

export default App;
