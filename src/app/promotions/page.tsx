'use client';

import { useState } from 'react';

// Mock function to simulate database search (Replace with actual API call)
async function fetchMoviesFromDatabase(query: string) {
  if (!query) return [];

  const databaseMovies = [
    { id: 1, title: 'Inception', director: 'Christopher Nolan', year: 2010 },
    { id: 2, title: 'Interstellar', director: 'Christopher Nolan', year: 2014 },
    {
      id: 3,
      title: 'The Dark Knight',
      director: 'Christopher Nolan',
      year: 2008,
    },
    { id: 4, title: 'Dune', director: 'Denis Villeneuve', year: 2021 },
    {
      id: 5,
      title: 'Blade Runner 2049',
      director: 'Denis Villeneuve',
      year: 2017,
    },
  ];

  return databaseMovies.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
}

export default function ManagePromotions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [promotedMovies, setPromotedMovies] = useState([]);

  // Handle search and fetch movies from "database"
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    const results = await fetchMoviesFromDatabase(query);
    setSearchResults(results);

    // Clear search bar after submitting
    setSearchQuery('');
  };

  // Handle Enter key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  // Add movie to the promotion list
  const handleAddPromotion = (movie) => {
    if (!promotedMovies.some((m) => m.id === movie.id)) {
      setPromotedMovies([...promotedMovies, movie]);
    }
  };

  // Remove movie from promotions
  const handleRemovePromotion = (id) => {
    setPromotedMovies(promotedMovies.filter((movie) => movie.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-red-500 border-b-4 border-red-600 pb-2">
        🎟️ Manage Promotions
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-lg mb-6">
        <input
          type="text"
          placeholder="Search for a movie..."
          className="w-full p-3 text-lg border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress} // Search on Enter key press
        />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="w-full max-w-lg bg-gray-900 p-4 rounded-md shadow-lg border border-gray-800">
          <h2 className="text-xl font-bold mb-2 text-red-400">
            🔎 Search Results
          </h2>
          {searchResults.map((movie) => (
            <div
              key={movie.id}
              className="flex justify-between items-center bg-gray-800 p-3 rounded-md mb-2"
            >
              <div>
                <h3 className="text-lg font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-400">
                  {movie.director} • {movie.year}
                </p>
              </div>
              <button
                onClick={() => handleAddPromotion(movie)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
              >
                ✨ Promote
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Promoted Movies List */}
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          📢 Movies in Promotion
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotedMovies.length > 0 ? (
            promotedMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-800 hover:border-blue-500 transition"
              >
                <h3 className="text-xl font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-400">🎭 {movie.director}</p>
                <p className="text-sm text-gray-400">📅 {movie.year}</p>
                <button
                  onClick={() => handleRemovePromotion(movie.id)}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                >
                  ❌ Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No movies selected for promotion.</p>
          )}
        </div>
      </div>
    </div>
  );
}
