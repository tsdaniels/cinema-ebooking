"use client"
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";


const MovieCard = ({ title, posterUrl, handleClick, id }) => (
    
  <div 
  className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-black border border-red-900">
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
      <button onClick={() => handleClick(id)} className="mt-3 w-full bg-red-900 hover:bg-red-800 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center">
        <span>Book Tickets</span>
      </button>
    </div>
  </div>
);

export default function SearchMovies() {

    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true); // Now we're on the client side
    }, []);

    const handleClick = (id) => {
        if (isClient) {
            router.push(`/movieInfo/${id}`);
        }
    };



    const [movies, setMovies] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("all"); // For tab navigation

    const generateKey = (movie) => {
        const str = `${movie.title}`;
        return CryptoJS.MD5(str).toString();
    };

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("/api/movies");
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                setMovies(data);
                
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
            categorizeMovies(movies);
            return;
        }
        
        const filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase())
        );
        
        categorizeMovies(filteredMovies);
    }
    
    // Tab navigation component
    const TabNav = () => (
        <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg bg-black border border-red-800 p-1">
                <button 
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-2 rounded-md font-medium ${activeTab === "all" ? "bg-red-900 text-white" : "text-gray-400 hover:text-white"}`}
                >
                    All Movies
                </button>
                <button 
                    onClick={() => setActiveTab("now")}
                    className={`px-6 py-2 rounded-md font-medium ${activeTab === "now" ? "bg-red-900 text-white" : "text-gray-400 hover:text-white"}`}
                >
                    Now Showing
                </button>
                <button 
                    onClick={() => setActiveTab("soon")}
                    className={`px-6 py-2 rounded-md font-medium ${activeTab === "soon" ? "bg-red-900 text-white" : "text-gray-400 hover:text-white"}`}
                >
                    Coming Soon
                </button>
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-black to-red-950">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 text-white">
                <div className="flex items-center justify-center mb-4">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-900">
                        CineBook
                    </h1>
                </div>
                
                <p className="text-center text-red-300 mb-8 max-w-xl mx-auto">
                    Book your tickets for the latest movies showing in theaters
                </p>

                <form onSubmit={handleSearch} className="flex gap-2 justify-center mb-12 max-w-xl mx-auto">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 h-12 rounded-lg shadow-inner bg-black bg-opacity-80 border border-red-900 text-white px-4 focus:outline-none focus:ring-2 focus:ring-red-700"
                        placeholder="Search Movies..."
                    />
                    <button 
                        type="submit"
                        className="px-6 h-12 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors shadow-lg"
                    >
                        Search
                    </button>
                </form>

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
                        
                        {activeTab === "all" && (
                            <div className="mb-12">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {movies.length > 0 ? (
                                        movies.map(movie => (
                                            <MovieCard
                                                key={generateKey(movie)}
                                                id={movie._id}
                                                title={movie.title}
                                                posterUrl={movie.posterUrl}
                                                handleClick={handleClick}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-4 text-center py-12 text-red-300">
                                            No movies found matching your search
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "now" && (
                            <div className="mb-12">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {nowPlaying.length > 0 ? (
                                        nowPlaying.map(movie => (
                                            <MovieCard
                                                key={generateKey(movie)}
                                                id={movie._id}
                                                title={movie.title}
                                                posterUrl={movie.posterUrl}
                                                handleClick={handleClick}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-4 text-center py-12 text-red-300">
                                            No movies currently showing
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "soon" && (
                            <div className="mb-12">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {comingSoon.length > 0 ? (
                                        comingSoon.map(movie => (
                                            <MovieCard
                                                key={generateKey(movie)}
                                                id={movie._id}
                                                title={movie.title}
                                                posterUrl={movie.posterUrl}
                                                handleClick={handleClick}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-4 text-center py-12 text-red-300">
                                            No upcoming movies
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}