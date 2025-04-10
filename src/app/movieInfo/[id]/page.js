"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MovieInfo() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMovie() {
            try {
                setLoading(true);
                console.log(`Fetching movie with ID: ${id}`);
                const res = await fetch(`/api/movies/${id}`, { cache: 'no-store' });
                console.log(`Movie response status: ${res.status}`);

                if (!res.ok) {
                    setError("Movie not found");
                    return;
                }

                const data = await res.json();
                console.log("Movie data received:", data);
                setMovie(data);
            } catch (err) {
                console.error("Error fetching movie:", err);
                setError("Failed to load movie");
            } finally {
                setLoading(false);
            }
        }

        async function fetchShowtimes() {
            try {
                console.log(`Fetching showtimes for movie ID: ${id}`);
                const res = await fetch(`/api/movies/${id}/showtimes`, { cache: 'no-store' });
                console.log(`Showtimes response status: ${res.status}`);
        
                if (res.ok) {
                    const data = await res.json();
                    console.log("Showtimes data received:", data);
                    setShowtimes(data);
                } else {
                    try {
                        const errorData = await res.json();
                        console.log("Showtimes error:", errorData);
                        
                        // Don't set page error for missing showtimes - just show empty state
                        if (errorData.error === "No showtimes found for this movie") {
                            console.log("No showtimes available for this movie");
                            setShowtimes([]);
                        } else {
                            console.error("Unexpected error:", errorData.error);
                        }
                    } catch (e) {
                        console.error("Failed to parse error response:", e);
                    }
                }
            } catch (err) {
                console.error("Error fetching showtimes:", err);
                // Still allow the page to load even if showtimes fail
                setShowtimes([]);
            }
        }

        if (id) {
            fetchMovie();
            fetchShowtimes();
        }
    }, [id]);

    const handleBookTickets = (showtimeId) => {
        // Make sure we're using the correct ID field
        console.log(`Booking tickets for showtime: ${showtimeId}`);
        router.push(`/checkout?movieId=${id}&showtimeId=${showtimeId}`);
    };

    const handleGenericBooking = () => {
        console.log(`Generic booking for movie: ${id}`);
        router.push(`/checkout?movieId=${id}`);
    };

    if (loading) return <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-700">Loading movie information...</p>
    </div>;
    
    if (error) return <div className="text-center p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
        </div>
        <button 
            onClick={() => router.push("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Back to Home
        </button>
    </div>;
    
    if (!movie) return <div className="text-center p-8">Movie not found.</div>;

    let imgUrl = movie.posterUrl || "https://m.media-amazon.com/images/M/MV5BZDI5YzJhODQtMzQyNy00YWNmLWIxMjUtNDBjNjA5YWRjMzExXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg";
    
    return (
        <div className="w-full h-full">
            <div>
                <h1 className="p-8 text-xl mb-4 text-white bg-red-700 font-bold">Overview</h1>
            </div>

            <div className="p-8">
                <h2 className="mb-2 text-xl font-bold">{movie.title}</h2>
                <p>{movie.year} • {movie.duration || "1h 58m"}</p>
                <button className="mt-2 bg-blue-300 text-blue-700 p-3 rounded-lg font-bold ">
                    {movie.rating || "PG-13"}
                </button>
            </div>

            <div className="pl-8 pr-8 justify-center flex flex-row">
                <img src={imgUrl} alt={movie.title} className="w-1/5 h-[400px] mr-4 rounded-lg bg-red-700" />
                {movie.trailerUrl ? (
                    <iframe 
                        width="560" height="315" 
                        src={movie.trailerUrl} 
                        title="YouTube video player" frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        className="h-[400px] w-3/5 rounded-lg border border-gray-400"
                        allowFullScreen>
                    </iframe>
                ) : (
                    <div className="h-[400px] w-3/5 rounded-lg border border-gray-400 flex items-center justify-center bg-gray-100">
                        <p className="text-gray-500">No trailer available</p>
                    </div>
                )}
            </div>

            <div className="p-8">
                <h1 className="text-xl mb-2 font-bold">Synopsis</h1>
                <p>{movie.synopsis || "No synopsis provided."}</p>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-full">
                        <h1 className="mb-2 text-xl font-bold">Cast</h1>
                    </div>

                    <div>
                        {movie.cast && movie.cast.length > 0 ? (
                            movie.cast.map((actor, index) => (
                                <div key={index} className="font-bold mt-4 cast-card border border-gray-400 rounded-lg p-4 w-[200px] flex justify-center items-center">
                                    <p>{actor.name}</p>
                                </div>
                            ))
                        ) : (
                            <p>No cast information available.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8">
                <h1 className="font-bold">Director</h1>
                <p className="font-medium">{movie.director || "N/A"}</p>
            </div>

            <div className="p-8">
                <h1 className="font-bold">Producer</h1>
                <p className="font-medium">{movie.producer || "N/A"}</p>
            </div>

            {/* Showtimes Section */}
            <div className="p-8">
                <h1 className="text-xl font-bold mb-4">Showtimes</h1>
                {showtimes && showtimes.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                        {showtimes.map((showtime, index) => (
                            <div
                                key={index}
                                className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800 font-medium shadow-sm cursor-pointer hover:bg-gray-300 transition-colors"
                                onClick={() => handleBookTickets(showtime._id || showtime.id)}
                            >
                                <div className="font-bold">
                                    {showtime.date ? 
                                        (typeof showtime.date === 'string' ? 
                                            new Date(showtime.date).toLocaleDateString() : 
                                            'Invalid Date') : 
                                        'No date'}
                                </div>
                                <div>{showtime.time || 'No time'}</div>
                                <div>${showtime.price || "10"}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Showtimes not available. Please check back later.</p>
                )}
            </div>

            <div className="p-8">
                <button 
                    onClick={handleGenericBooking} 
                    className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg font-semibold transition-colors"
                >
                    Book Tickets Now
                </button>
            </div>
        </div>
    );
}