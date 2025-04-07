"use client";
import { useEffect, useState } from "react";

const ManageMovies = () => {
    const [movies, setMovies] = useState([]);
    const [errors, setErrors] = useState({});
    const [newMovie, setNewMovie] = useState({
        title: "",
        trailerUrl: "",
        posterUrl: "",
        synopsis: "",
        duration: "",
        status: "showing_now",
        director: "",
        producer: "",
        rating: "",
        year: "",
        cast: [{ name: "" }]
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    // Add new cast member
    const addCastMember = () => {
        setNewMovie(prev => ({
            ...prev,
            cast: [...prev.cast, { name: ""}]
        }));
    };

    // Remove cast member
    const removeCastMember = (index) => {
        if (newMovie.cast.length > 1) {
            setNewMovie(prev => ({
                ...prev,
                cast: prev.cast.filter((_, i) => i !== index)
            }));
        }
    };

    // Update cast member
    const handleCastChange = (index, field, value) => {
        setNewMovie(prev => {
            const updatedCast = [...prev.cast];
            updatedCast[index][field] = value;
            return { ...prev, cast: updatedCast };
        });
    };

    // Handle regular input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setNewMovie(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Fetch movies on mount
    useEffect(() => {
        fetchMovies();
    }, []);

    async function fetchMovies() {
        try {
            const response = await fetch('/api/movies');
            const data = await response.json();
            if (!response.ok) throw new Error("Failed to fetch movies");
            setMovies(data);
        } catch (error) {
            console.error("Error fetching movies:", error);
            setErrors({ fetch: error.message });
        }
    }

    async function handleDelete(movieId) {
        try {
            const response = await fetch(`/api/movies/${movieId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                // Check if there's content to parse as JSON
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    try {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to delete movie");
                    } catch (jsonError) {
                        throw new Error(`Failed to delete movie: ${response.status} ${response.statusText}`);
                    }
                } else {
                    throw new Error(`Failed to delete movie: ${response.status} ${response.statusText}`);
                }
            }
            
            // Refresh the movie list after deletion
            await fetchMovies();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting movie:", error);
            setErrors({ delete: error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Form submitted, validating...");
        const newErrors = {};

        // Validate required fields
        if (!newMovie.title.trim()) newErrors.title = "Title is required";
        if (!newMovie.trailerUrl.trim()) newErrors.trailerUrl = "Trailer URL is required";
        if (!newMovie.synopsis.trim()) newErrors.synopsis = "Synopsis is required";
        if (!newMovie.duration.trim()) newErrors.duration = "Duration is required";
        if (!newMovie.posterUrl.trim()) newErrors.posterUrl = "Poster url is required";
        if (!newMovie.director.trim()) newErrors.director = "Director is required";
        if (!newMovie.producer.trim()) newErrors.producer = "Producer is required";
        if (!newMovie.year.trim()) newErrors.year = "Year is required";
        // Validate cast members
        newMovie.cast.forEach((member, index) => {
            if (!member.name.trim()) {
                newErrors[`cast-${index}-name`] = "Actor name is required";
            }
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        console.log("Validation passed, preparing payload...");

        try {
            // Filter out empty cast members
            const payload = {
                ...newMovie,
                cast: newMovie.cast.filter(member => member.name.trim())
            };

            console.log("Sending payload:", payload);

            const response = await fetch('/api/movies', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const responseData = await response.json();
            console.log("Success response:", responseData);
            await fetchMovies();
            // Reset form but keep one empty cast member
            setNewMovie({
                title: "",
                trailerUrl: "",
                posterUrl: "",
                synopsis: "",
                duration: "",
                status: "showing_now",
                director: "",
                producer: "",
                rating: "",
                year: "",
                cast: [{ name: ""}]
            });
        } catch (error) {
            console.error("Error adding movie:", error);
            setErrors({ submit: error.message });
            
        }

        if (errors.submit) {
            alert(`Failed to add movie: ${errors.submit}`);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-black to-red-950">
            <div className="absolute justify-center flex items-center inset-0 bg-[url('/pattern.png')] opacity-20 pointer-events-none" />
            
            <div className="container mx-auto p-8">
                {/* Movie cards section */}
                <div className="mb-12">
                    <h1 className="text-white text-3xl font-bold mb-8 text-center">Current Movies</h1>
                    
                    {errors.fetch && (
                        <div className="bg-red-500 bg-opacity-50 text-white p-4 rounded-lg mb-6">
                            Error loading movies: {errors.fetch}
                        </div>
                    )}
                    
                    {errors.delete && (
                        <div className="bg-red-500 bg-opacity-50 text-white p-4 rounded-lg mb-6">
                            Error deleting movie: {errors.delete}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {movies.map(movie => (
                            <div 
                                key={movie.id || movie._id} 
                                className="bg-red-700/15 backdrop-blur-sm border rounded-lg overflow-hidden transition-transform hover:scale-105"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={movie.posterUrl} 
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-poster.jpg';
                                        }}
                                    />
                                    <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 m-2 rounded">
                                        {movie.status === 'showing_now' ? 'Showing Now' : 'Coming Soon'}
                                    </div>
                                </div>
                                
                                <div className="p-4 text-white">
                                    <h3 className="text-xl font-bold mb-2">{movie.title} ({movie.year})</h3>
                                    <p className="text-sm mb-2">{movie.duration} | {movie.rating}</p>
                                    <p className="text-sm mb-4 line-clamp-2">{movie.synopsis}</p>
                                    
                                    <div className="flex justify-end">
                                        {deleteConfirmation === movie.id || deleteConfirmation === movie._id ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleDelete(movie.id || movie._id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmation(null)}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirmation(movie.id || movie._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {movies.length === 0 && (
                            <div className="col-span-full text-center text-white p-8 bg-red-700/15 backdrop-blur-sm border rounded-lg">
                                No movies have been added yet.
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Form section */}
                <div className="flex justify-center items-center">
                    <form 
                        onSubmit={handleSubmit} 
                        className="text-white h-full w-3/5 bg-red-700/15 backdrop-blur-sm border rounded-lg p-8"
                    >
                        <h1 className="p-4 text-center text-opacity-100 text-2xl font-bold">
                            Manage Movies
                        </h1>

                        {/* Title */}
                        <div className="p-4">
                            <label>Title: </label>
                            <input
                                id="title"
                                type="text"
                                value={newMovie.title}
                                onChange={handleInputChange}
                                className="w-full text-black border border-gray-400 rounded-lg p-2"
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                        </div>

                        {/** Year */}
                        <div className="p-4">
                            <label>Year: </label>
                            <input
                                id="year"
                                value={newMovie.year}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full text-black border border-gray-400 rounded-lg p-2"
                            />
                            {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
                        </div>

                        {/* Trailer URL */}
                        <div className="p-4">
                            <label>Trailer URL: </label>
                            <input
                                id="trailerUrl"
                                type="text"
                                value={newMovie.trailerUrl}
                                onChange={handleInputChange}
                                className="w-full text-black border border-gray-400 rounded-lg p-2"
                            />
                            {errors.trailerUrl && <p className="text-red-500 text-sm">{errors.trailerUrl}</p>}
                        </div>

                        <div className="p-4">
                            <label>Poster URL: </label>
                            <input
                                id="posterUrl"
                                type="text"
                                value={newMovie.posterUrl}
                                onChange={handleInputChange}
                                className="w-full text-black border border-gray-400 rounded-lg p-2"
                            />
                            {errors.posterUrl && <p className="text-red-500 text-sm">{errors.posterUrl}</p>}
                        </div>

                        {/* Synopsis */}
                        <div className="p-4">
                            <label>Synopsis: </label>
                            <textarea
                                id="synopsis"
                                value={newMovie.synopsis}
                                onChange={handleInputChange}
                                className="h-[100px] w-full text-black border border-gray-400 rounded-lg p-2"
                            />
                            {errors.synopsis && <p className="text-red-500 text-sm">{errors.synopsis}</p>}
                        </div>

                        {/* Duration */}
                        <div className="p-4">
                            <label>Duration: </label>
                            <input
                                id="duration"
                                value={newMovie.duration}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full text-black border border-gray-400 rounded-lg p-2"
                            />
                            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
                        </div>


                        {/* Status - Changed to select for better UX */}
                        <div className="p-4">
                            <label>Status: </label>
                            <select
                                id="status"
                                value={newMovie.status}
                                onChange={handleInputChange}
                                className="w-full text-black border border-gray-400 rounded-lg p-2"
                            >
                                <option value="showing_now">Showing Now</option>
                                <option value="coming_soon">Coming Soon</option>
                            </select>
                        </div>

                        {/** Rating */}
                        <div className="p-4">
                            <label>Rating:</label>
                            <select
                                id="rating"
                                value={newMovie.rating}
                                onChange={handleInputChange}
                                className="w-full text-black border border-gray-400 rounded-lg p-2"
                            >
                                <option value="G">G</option>
                                <option value="PG">PG</option>
                                <option value="PG-13">PG-13</option>
                                <option value="R">R</option>
                                <option value="NC-17">NC-17</option>
                            </select>
                        </div>

                        {/**Director */}
                        <div className="p-4">
                            <label>Director: </label>
                            <input
                                id="director"
                                value={newMovie.director}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full text-black border border-gray-400 rounded-lg p-2"
                            />
                            {errors.director && <p className="text-red-500 text-sm">{errors.director}</p>}
                        </div>
                        {/**Producer */}
                        <div className="p-4">
                            <label>Producer: </label>
                            <input
                                id="producer"
                                value={newMovie.producer}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full text-black border border-gray-400 rounded-lg p-2"
                            />
                            {errors.producer && <p className="text-red-500 text-sm">{errors.producer}</p>}
                        </div>

                        {/* Cast Members */}
                        <div className="p-4">
                            <label className="block mb-2">Cast Members</label>
                            {newMovie.cast.map((member, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={member.name}
                                        onChange={(e) => handleCastChange(index, 'name', e.target.value)}
                                        placeholder="Actor name"
                                        className="flex-1 p-2 border rounded text-black"
                                    />
                                    {newMovie.cast.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeCastMember(index)}
                                            className="bg-red-500 text-white px-3 rounded"
                                        >
                                            ×
                                        </button>
                                    )}
                                    {errors[`cast-${index}-name`] && (
                                        <p className="text-red-500 text-sm">{errors[`cast-${index}-name`]}</p>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addCastMember}
                                className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
                            >
                                + Add Cast Member
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="p-4 text-center">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                            >
                                Add Movie
                            </button>
                            {errors.submit && (
                                <p className="text-red-500 mt-2">{errors.submit}</p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageMovies;