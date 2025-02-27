'use client';

import { useState } from 'react';

// Mock function to simulate database search (Replace with actual API call)
async function fetchMoviesFromDatabase(query) {
  if (!query) return [];

  // Simulated API response (Replace with actual fetch request)
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

export default function ManageMovies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: '',
    director: '',
    year: '',
  });

  // handle search and fetch movies from "database"
  const handleSearch = async (query) => {
    setSearchQuery(query);
    const results = await fetchMoviesFromDatabase(query);
    setSearchResults(results);
    setSearchQuery(''); // clears search
  };

  // handle enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  // add movie to manage list
  const handleAddMovie = (movie) => {
    if (!selectedMovies.some((m) => m.title === movie.title)) {
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  //remove movie from the pagee
  const handleDeleteMovie = (id) => {
    setSelectedMovies(selectedMovies.filter((movie) => movie.id !== id));
  };

  // handle new movie input change
  const handleNewMovieChange = (e) => {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
  };

  // handles adding a completely different movie
  const handleAddNewMovie = () => {
    if (!newMovie.title || !newMovie.director || !newMovie.year) return;

    const newMovieEntry = {
      id: Date.now(), // temporary unique id
      title: newMovie.title,
      director: newMovie.director,
      year: newMovie.year,
    };

    handleAddMovie(newMovieEntry);
    setNewMovie({ title: '', director: '', year: '' }); // Reset form
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-red-500 border-b-4 border-red-600 pb-2">
        🎬 Manage Movies
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-lg mb-6">
        <input
          type="text"
          placeholder="Search for a movie..."
          className="w-full p-3 text-lg border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
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
                onClick={() => handleAddMovie(movie)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
              >
                ➕ Add
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Movie Section */}
      <div className="w-full max-w-lg mt-8 p-6 bg-gray-900 rounded-md shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold text-red-400 mb-4">
          ➕ Add New Movie
        </h2>
        <input
          type="text"
          name="title"
          placeholder="Movie Title"
          className="w-full p-2 mb-2 text-lg border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          value={newMovie.title}
          onChange={handleNewMovieChange}
        />
        <input
          type="text"
          name="director"
          placeholder="Director"
          className="w-full p-2 mb-2 text-lg border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          value={newMovie.director}
          onChange={handleNewMovieChange}
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          className="w-full p-2 mb-4 text-lg border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          value={newMovie.year}
          onChange={handleNewMovieChange}
        />
        <button
          onClick={handleAddNewMovie}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add Movie
        </button>
      </div>

      {/* Selected Movies List */}
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          🎥 Movies in Use
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedMovies.length > 0 ? (
            selectedMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-800 hover:border-red-500 transition"
              >
                <h3 className="text-xl font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-400">🎭 {movie.director}</p>
                <p className="text-sm text-gray-400">📅 {movie.year}</p>
                <button
                  onClick={() => handleDeleteMovie(movie.id)}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                >
                  ❌ Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No movies selected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
