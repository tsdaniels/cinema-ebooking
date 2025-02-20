"use client"
import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";  
import CryptoJS from "crypto-js";  

export default function SearchMovies() {
    const [movies, setMovies] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const generateKey = (movie) => {
        const str = `${movie.title}`;
        return CryptoJS.MD5(str).toString();
    };

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                // Using relative URL for Next.js API route instead of hardcoded localhost
                const response = await fetch("/api/movies");
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Fetched movies:", data);
                setMovies(data);
                
                // Automatically categorize movies on initial load
                categorizeMovies(data);
                setError(null);
            } catch(error) {
                console.error("Error fetching movies: ", error);
                setError("Failed to load movies. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchMovies();
    }, []);

    function categorizeMovies(moviesToCategorize) {
        const nowPlayingMovies = [];
        const comingSoonMovies = [];
        
        moviesToCategorize.forEach((movie) => {
            if(movie.status === "showing_now") {
                nowPlayingMovies.push(movie);
            } else {
                comingSoonMovies.push(movie);
            }
        });

        setNowPlaying(nowPlayingMovies);
        setComingSoon(comingSoonMovies);
    }

    async function handleSearch(e) {
        e.preventDefault();
        
        if(query.trim() === "") {
            // Reset to show all movies when search is cleared
            categorizeMovies(movies);
            return;
        }
        
        const filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase())
        );
        
        categorizeMovies(filteredMovies);
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
                    >
                        Search
                    </button>
                </form>

                {isLoading ? (
                    <div className="text-center py-8">
                        <p>Loading movies...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-400">
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">All Movies</h2>
                            <div className="flex flex-wrap gap-6 justify-center">
                                {movies.length > 0 ? (
                                    movies.map(movie => (
                                        <MovieCard
                                            key={generateKey(movie)}
                                            title={movie.title}
                                            trailerUrl={movie.trailerUrl}
                                        />
                                    ))
                                ) : (
                                    <p>No movies found</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Showing Now</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {nowPlaying.length > 0 ? (
                                    nowPlaying.map(movie => (
                                        <MovieCard
                                            key={generateKey(movie)}
                                            title={movie.title}
                                            trailerUrl={movie.trailerUrl}
                                        />
                                    ))
                                ) : (
                                    <p>No movies currently showing</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {comingSoon.length > 0 ? (
                                    comingSoon.map(movie => (
                                        <MovieCard
                                            key={generateKey(movie)}
                                            title={movie.title}
                                            trailerUrl={movie.trailerUrl}
                                        />
                                    ))
                                ) : (
                                    <p>No upcoming movies</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}