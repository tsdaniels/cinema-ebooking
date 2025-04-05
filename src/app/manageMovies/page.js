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
        cast: [{ name: "" }]
    });

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
            
            <div className="p-8 flex justify-center items-center">
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
    );
};

export default ManageMovies;