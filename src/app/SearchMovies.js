"use client"
import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";    

export default function SearchMovies() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const baseUrl = `//api.themoviedb.org/3/search/movie?query=${query}`;
    const API_KEY = "75989dc6f2f4cf7c3894ce992a4c7b61";

    async function fetchMovies(query) {
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTk4OWRjNmYyZjRjZjdjMzg5NGNlOTkyYTRjN2I2MSIsIm5iZiI6MTczOTg4NTQ3MS45NTgwMDAyLCJzdWIiOiI2N2I0OGI5ZjkxZDdlNjZjNjU2ZGQzYjEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.TRM6V8S26KrfwCnr4vz5gBwSPkekZms0qkJ8ZZUlZ2c'
            }
          };

          try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`, options);
            const data = await response.json();
            const movieTitles = data.results.map(movie => movie.title);
            console.log(movieTitles);
            return data.results || [];
          } catch (error) {
            console.log("Error fetching movies", error);
            return [];
          }

        }
          function categorizeMovies(movies) {
            const today = new Date;

            const nowPlayingMovies = [];
            const comingSoonMovies = [];
            
            movies.forEach((movie) => {
                const releaseDate = new Date(movie.release_date);
                if(releaseDate <= today) {
                    nowPlayingMovies.push(movie)
                } else {
                    comingSoonMovies.push(movie);
                }
            });

            setNowPlaying(nowPlayingMovies);
            setComingSoon(comingSoonMovies);

          }

          async function handleSearch(e) {
            e.preventDefault();
            const movies = await fetchMovies(query);
            categorizeMovies(movies);
          }
         

    
    

    
    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-red-950 to-red-900 overflow-hidden">
            {/* Twinkling stars background */}
            <div className="absolute inset-0 pointer-events-none">
            </div>

            <div className="relative z-10 w-full h-full mx-auto px-4 py-8 text-white">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    CineBook
                </h1>

                <form onSubmit={handleSearch} className="flex gap-2 justify-center mb-8">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 w-4/5 h-10 rounded-lg shadow border border-gray-200 text-black px-4"
                        placeholder="Search Movies..."
                    />
                    <button 
                        type="submit"
                        className="px-4 bg-black h-10 text-white rounded-md hover:bg-red-800 transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {error && ( 
                    <div className="text-red-400 text-center mb-4">
                        {error}
                    </div>
                )}

                {movies.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Search Results</h2>
                        <div className="flex flex-wrap gap-6 justify-center">
                            {movies.map(movie => (
                                <MovieCard
                                    key={movie.id}
                                    title={movie.title}
                                    posterPath={movie.poster_path}
                                    releaseDate={movie.release_date}
                                    rating={movie.vote_average}
                                />
                            ))}
                        </div>
                    </div>
                )}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Showing Now</h2>
                    <div className="grid grid-cols-1 md:grid-cols2 lg:grid-cols-3 gap4">
                    {nowPlaying.map(movie => (
                                <MovieCard
                                    key={movie.id}
                                    title={movie.title}
                                    posterPath={movie.poster_path}
                                    releaseDate={movie.release_date}
                                    rating={movie.vote_average}
                                />
                            ))}
                    </div>
                </div>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
                    <div className="grid grid-cols-1 md:grid-cols2 lg:grid-cols-3 gap4">
                    {comingSoon.map(movie => (
                                <MovieCard
                                    key={movie.id}
                                    title={movie.title}
                                    posterPath={movie.poster_path}
                                    releaseDate={movie.release_date}
                                    rating={movie.vote_average}
                                />
                            ))}
                    </div>
                </div>
                
            </div>
        </div>
    );
}