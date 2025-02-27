"use client"
import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";  
import CryptoJS from "crypto-js";  

export default function SearchMovies() {
    const [movies, setMovies] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [query, setQuery] = useState("");

    const generateKey = (movie) => {
        const str = `${movie.title}`;
        return CryptoJS.MD5(str).toString();
    };

    useEffect(() => {
        console.log("did use effect trigger?");
        const fetchMovies = async () => {
            try {
                console.log("test");
                const response = await fetch("http://localhost:5000/api/movies/");
                if(!response) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched movies:", data);
                setMovies(data);
            } catch(error) {
                console.error("Error fetching movies: ", error);
            }

            
        };
        fetchMovies();
    }, []);

          function categorizeMovies(movies) {
            const today = new Date;

            const nowPlayingMovies = [];
            const comingSoonMovies = [];
            
            movies.forEach((movie) => {
                const releaseDate = new Date(movie.status);
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
            const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()));
            if(query.trim() === "") {
                setNowPlaying([]);
                setComingSoon([]);
                return;
            }
            if (filteredMovies.length == 0) {
                setNowPlaying([]);
                setComingSoon([]);
            } else {
                categorizeMovies(filteredMovies);
            }
            
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
                       
                    </button>
                </form>
                {movies.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">All movies</h2>
                        <div className="flex flex-wrap gap-6 justify-center">
                            {movies.map(movie => (
                                <MovieCard    
                                    title={movie.title}
                                    trailerUrl={movie.trailerUrl}
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
                                    
                                    title={movie.title}
                                    trailerUrl={movie.trailerUrl}
                                />
                            ))}
                    </div>
                </div>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
                    <div className="grid grid-cols-1 md:grid-cols2 lg:grid-cols-3 gap4">
                    {comingSoon.map(movie => (
                                <MovieCard
                                    
                                    title={movie.title}
                                    trailerUrl={movie.trailerUrl}
                                />
                            ))}
                    </div>
                </div>
                
            </div>
        </div>
    );
}