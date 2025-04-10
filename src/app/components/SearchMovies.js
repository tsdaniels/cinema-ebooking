"use client";

import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";

// --- Fixed Genre List ---
const ALL_GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary",
  "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Musical", "Mystery",
  "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
];

// --- Helper to format time to 12-hour format ---
const formatTime = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hr = hour % 12 || 12;
  return `${hr}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

// --- Movie Card Component ---
const MovieCard = ({ title, posterUrl, handleClick, id, rating, genres, showtimes }) => (
  <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl bg-black border border-red-900">
    <div className="h-48 bg-gradient-to-b from-red-900 to-black flex items-center justify-center overflow-hidden">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={title}
          className="object-cover w-full h-full opacity-70 hover:opacity-100 transition-opacity duration-300"
        />
      ) : (
        <div className="text-red-500 text-4xl font-bold">🎬</div>
      )}
    </div>
    <div className="p-4">
      <h3 className="text-white font-bold text-lg truncate">{title}</h3>
      <p className="text-red-300 text-sm">Rating: {rating}</p>
      {genres?.length > 0 && (
        <div className="mt-1 mb-2 flex flex-wrap gap-1">
          {genres.slice(0, 3).map((genre, idx) => (
            <span key={idx} className="text-xs bg-red-900/60 text-white rounded-full px-2 py-0.5">
              {genre}
            </span>
          ))}
          {genres.length > 3 && (
            <span className="text-xs text-gray-400">+{genres.length - 3} more</span>
          )}
        </div>
      )}
      {showtimes?.length > 0 && (
        <div className="mt-2 text-sm text-white">
          <p className="font-semibold text-red-400">Showtimes:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {showtimes.slice(0, 4).map((time, idx) => (
              <span key={idx} className="bg-red-700/80 text-xs px-2 py-0.5 rounded-full text-white">
                {formatTime(time)}
              </span>
            ))}
            {showtimes.length > 4 && (
              <span className="text-xs text-gray-400">+{showtimes.length - 4} more</span>
            )}
          </div>
        </div>
      )}
      <button
        onClick={() => handleClick(id)}
        className="mt-3 w-full bg-red-900 hover:bg-red-800 text-white py-2 px-4 rounded-md transition-colors duration-200"
      >
        Book Tickets
      </button>
    </div>
  </div>
);

// --- Main Component ---
export default function SearchMovies() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const [allMovies, setAllMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [query, setQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateKey = (movie) => CryptoJS.MD5(movie.title).toString();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/movies");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setAllMovies(data);
        setMovies(data);
        categorizeMovies(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const categorizeMovies = (data) => {
    const now = data.filter((m) => m.status === "showing_now");
    const soon = data.filter((m) => m.status !== "showing_now");
    setNowPlaying(now);
    setComingSoon(soon);
  };

  const handleClick = (id) => {
    if (isClient) router.push(`/movieInfo/${id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = allMovies.filter((movie) => {
      const titleMatch = movie.title.toLowerCase().includes(query.toLowerCase());
      const ratingMatch = ratingFilter ? movie.rating === ratingFilter : true;
      const genreMatch = genreFilter ? movie.genres?.includes(genreFilter) : true;
      return titleMatch && ratingMatch && genreMatch;
    });

    setMovies(filtered);
    categorizeMovies(filtered);
  };

  const clearFilters = () => {
    setQuery("");
    setRatingFilter("");
    setGenreFilter("");
    setMovies(allMovies);
    categorizeMovies(allMovies);
  };

  const TabNav = () => (
    <div className="flex justify-center mb-8">
      <div className="inline-flex rounded-lg bg-black border border-red-800 p-1">
        {["all", "now", "soon"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md font-medium ${
              activeTab === tab ? "bg-red-900 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {tab === "all" ? "All Movies" : tab === "now" ? "Now Showing" : "Coming Soon"}
          </button>
        ))}
      </div>
    </div>
  );

  const renderMovies = (movieList) =>
    movieList.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movieList.map((movie) => (
          <MovieCard
            key={generateKey(movie)}
            id={movie._id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            handleClick={handleClick}
            rating={movie.rating}
            genres={movie.genres}
            showtimes={movie.showtimes}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-12 text-red-300 col-span-4">
        No movies found matching your search.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-red-950 relative">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 text-white">
        <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-900 mb-4">
          CineBook
        </h1>
        <p className="text-center text-red-300 mb-8 max-w-xl mx-auto">
          Book your tickets for the latest movies showing in theaters
        </p>

        {/* --- Search Form --- */}
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-2 justify-center mb-12 max-w-xl mx-auto"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Movies..."
            className="flex-1 h-12 rounded-lg shadow-inner bg-black bg-opacity-80 border border-red-900 text-white px-4 focus:outline-none focus:ring-2 focus:ring-red-700"
          />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="h-12 rounded-lg shadow-inner bg-black bg-opacity-80 border border-red-900 text-white px-4"
          >
            <option value="">Select Rating</option>
            {["G", "PG", "PG-13", "R", "NC-17"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="h-12 rounded-lg shadow-inner bg-black bg-opacity-80 border border-red-900 text-white px-4"
          >
            <option value="">Select Genre</option>
            {ALL_GENRES.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 h-12 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors shadow-lg"
          >
            Search
          </button>
          {(query || ratingFilter || genreFilter) && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          )}
        </form>

        {/* --- Loading/Error States --- */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
            <p className="mt-4 text-red-300">Loading the latest movies...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400 bg-black bg-opacity-50 rounded-lg p-6 max-w-xl mx-auto">
            <p className="text-xl">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-900 rounded-md hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <TabNav />
            {activeTab === "all" && renderMovies(movies)}
            {activeTab === "now" && renderMovies(nowPlaying)}
            {activeTab === "soon" && renderMovies(comingSoon)}
          </>
        )}
      </div>
    </div>
  );
}
