# 📚 Book Finder - React Application (Day 04 Assignment)

A comprehensive, production-grade Book Finder web application built with **React**, **Vite**, and the **Open Library API**. This project synthesizes foundational and advanced React concepts—including custom hooks, request cancellation via `AbortController`, debounced user input, React Router DOM, Context API, and surgical performance optimizations with `useMemo`, `useCallback`, `React.memo`, and `useRef`.

---

## 🚀 Features

1. **Debounced Search (500ms)**:
   - Powered by a custom `useDebounce` hook.
   - Prevents API spamming by waiting until 500ms of user typing inactivity before dispatching requests.
2. **API Request Cancellation (`AbortController`)**:
   - Implemented inside `useFetch`.
   - Rapid subsequent queries abort in-flight requests, preventing race conditions and stale UI overwrites.
3. **Work Details View (`/books/:id`)**:
   - Extracts clean Open Library work identifiers (e.g. `OL45804W`).
   - Fetches rich metadata, description, covers, and subjects from `https://openlibrary.org/works/{id}.json`.
4. **Global Favourites System (Context API + `localStorage`)**:
   - Accessible from any page or component via custom hook `useFavourites()`.
   - Live counter badge displayed in the sticky navigation header.
   - Persisted across page refreshes using browser `localStorage`.
5. **Client-Side Routing (React Router DOM v7)**:
   - `/`: Home and interactive search interface.
   - `/books/:id`: Detailed book view with dynamic route params.
   - `/favourites`: Dedicated favourites collection page.
   - `*`: Custom 404 Not Found page with return-to-home navigation.
6. **Performance Optimizations & Render Profiling**:
   - `React.memo` wrapping `BookCard` to prevent unnecessary child renders.
   - `useCallback` ensuring stable event handler references for toggling favourites.
   - `useMemo` for filtering by minimum publication year and sorting (year ascending/descending, title A-Z).
   - `useRef` for search input autofocus on mount, plus visual render counter badges on components.
7. **Robust Edge Case Handling**:
   - Handles missing book covers with a clean fallback placeholder.
   - Gracefully handles missing author names and publication years.
   - Comprehensive error banners with retry capabilities.

---

## 📁 Project Structure

```text
book-finder/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Global sticky nav with favourites count badge
│   │   ├── SearchBar.jsx        # Search input with autofocus via useRef & clear button
│   │   ├── BookCard.jsx         # Memoized card (React.memo) with useRef render counter
│   │   ├── BookList.jsx         # Filter & sort controls powered by useMemo
│   │   └── Loader.jsx           # Animated loading spinner & status indicators
│   │
│   ├── pages/
│   │   ├── Home.jsx             # Main search page with debounced query & suggestions
│   │   ├── BookDetails.jsx      # Detailed work view using useParams & useFetch
│   │   ├── Favourites.jsx       # Dedicated saved collection view
│   │   └── NotFound.jsx         # 404 fallback page
│   │
│   ├── context/
│   │   └── FavouritesContext.jsx # Global favourites state & localStorage sync
│   │
│   ├── hooks/
│   │   ├── useFetch.js          # Fetch hook with AbortController cancellation
│   │   ├── useDebounce.js       # 500ms input debounce hook
│   │   └── useFavourites.js     # Ergonomic context consumer hook
│   │
│   ├── App.jsx                  # Route definitions & Context Provider wrapper
│   ├── main.jsx                 # React root & BrowserRouter mount
│   └── index.css                # Polished modern responsive styling
│
├── INTERVIEW.md                 # Concisely answered core React interview questions
├── README.md                    # Architecture, comparison & documentation
└── package.json                 # Project dependencies & scripts
```

---

## 🏗️ Architecture & Hook Usage

| Hook / API | Location | Purpose |
| :--- | :--- | :--- |
| `useDebounce` | `src/hooks/useDebounce.js` | Delays API search dispatch by 500ms after user stops typing. |
| `useFetch` | `src/hooks/useFetch.js` | Manages `data`, `loading`, `error`, and cancels in-flight fetch via `AbortController`. |
| `useFavourites` | `src/hooks/useFavourites.js` | Custom hook exposing `{ favourites, addFavourite, removeFavourite, isFavourite }`. |
| `useRef` (Autofocus) | `src/components/SearchBar.jsx` | Focuses the search input upon initial component mount. |
| `useRef` (Render Counter) | `src/components/BookCard.jsx`, `Home.jsx` | Tracks and displays the exact render count without triggering re-renders. |
| `useMemo` | `src/components/BookList.jsx` | Memoizes book filtering (min publication year) and multi-field sorting. |
| `useCallback` | `src/pages/Home.jsx`, `FavouritesContext.jsx` | Provides stable function references for favourite handlers, preventing `React.memo` invalidation. |
| `React.memo` | `src/components/BookCard.jsx` | Prevents re-rendering book cards when unaffected by parent state updates. |

---

## ⚖️ State Management: Context API vs. Zustand / Redux

### When React Context API is Ideal:
- **Low-to-moderate update frequency**: Themes, authenticated user profiles, locale/language, or user collections like favourites.
- **Zero additional dependencies**: Built directly into React without growing bundle size.
- **Simplicity**: No boilerplate actions, reducers, or slice configurations needed for standard app workflows.

### Why Redux or Zustand are Preferred for Complex Applications:
1. **Selective Subscriptions**:
   - In React Context, whenever any value inside the context provider changes, **every component calling `useContext` re-renders**, even if it only consumes an untouched slice of that context.
   - Zustand and Redux support atomic selectors (e.g., `useStore(state => state.specificItem)`), guaranteeing that components only re-render when their selected slice changes.
2. **High-Frequency State Updates**:
   - Rapid streams of state modifications (e.g., canvas coordinates, drag-and-drop operations, real-time audio visualization) cause severe performance bottlenecks in Context due to broad re-rendering cascades.
3. **Advanced Middleware & DevTools**:
   - Redux and Zustand offer robust time-travel debugging, persistent action logging, and standardized asynchronous middleware (thunks, sagas, listeners).

---

## ⚠️ Two Cases Where `useMemo` is Pointless

While `useMemo` is powerful for heavy computations, wrapping every expression in `useMemo` is an anti-pattern. Two clear examples:

### Case 1: Simple Arithmetic Calculations
```javascript
// ❌ Pointless useMemo:
const total = useMemo(() => price * quantity, [price, quantity]);

// ✅ Correct approach:
const total = price * quantity;
```
*Why it's pointless*: Primitive multiplication runs in fractions of a nanosecond. Invoking `useMemo` introduces the overhead of allocating a closure, comparing dependency array references on every render, and storing extra values in memory. The memoization cost exceeds the cost of multiplying two numbers.

### Case 2: Trivial String Concatenations or Inexpensive Transformations
```javascript
// ❌ Pointless useMemo:
const fullName = useMemo(() => firstName + " " + lastName, [firstName, lastName]);

// ✅ Correct approach:
const fullName = firstName + " " + lastName;
```
*Why it's pointless*: Basic string concatenation is exceptionally fast in modern V8 engines. Memoizing it adds visual noise and cognitive complexity with zero measurable performance benefit. `useMemo` should be reserved for expensive algorithms (e.g. large array filtering, deep nested tree sorting, or transforming thousands of objects).

---

## 🛠️ Getting Started & Running Locally

### 1. Installation
```bash
cd book-finder
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🧪 Testing Checklist Verification

- [x] **Debounce Verification**: Type in the search bar—notice network requests fire only after 500ms of inactivity.
- [x] **Request Cancellation**: Rapidly change search terms—check the DevTools Network tab to observe previously pending requests being cleanly canceled (`status: (canceled)` via `AbortController`).
- [x] **Search Autofocus**: On page load, the search input is focused automatically via `useRef`.
- [x] **Render Counter**: Each `BookCard` displays its current render count via `useRef` and skips unnecessary renders via `React.memo`.
- [x] **Favourites Persistence**: Add books to favourites, navigate to `/favourites`, refresh the page—saved favourites remain intact.
- [x] **Dynamic Routing**: Click on any book card to visit `/books/:id` and load complete details from Open Library.
- [x] **404 Route**: Visit an invalid URL (e.g. `/unknown-path`) to see the custom 404 page.
