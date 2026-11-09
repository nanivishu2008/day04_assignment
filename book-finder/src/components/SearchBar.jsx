import { useRef, useEffect } from "react";

/**
 * SearchBar component with auto-focus powered by useRef.
 * Accepts value and onChange to drive search state and debouncing.
 */
export function SearchBar({ value, onChange, onClear, placeholder = "Search books by title, author, or subject..." }) {
  const inputRef = useRef(null);

  // Requirement: useRef for Search autofocus on initial mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="search-bar-wrapper">
      <div className="search-input-container">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          type="search"
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search books"
        />
        {value && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={onClear}
            title="Clear search"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <p className="search-hint">
        ⚡ <em>Results automatically update 500ms after you stop typing (debounced)</em>
      </p>
    </div>
  );
}

export default SearchBar;
