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
        genres: ["Action", "Adventure"], // Added genres array
        cast: [{ name: "" }]
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    
    // Available genres
    const availableGenres = [
        "Action", "Adventure", "Animation", "Comedy", "Crime", 
        "Documentary", "Drama", "Family", "Fantasy", "Horror", 
        "Musical", "Mystery", "Romance", "Sci-Fi", "Thriller", 
        "War", "Western"
    ];
    
    // Showtimes state
    const [selectedMovieId, setSelectedMovieId] = useState("");
    const [showShowtimesForm, setShowShowtimesForm] = useState(false);
    const [newShowtime, setNewShowtime] = useState({
        date: "",
        time: "",
        auditorium: "1",
        price: "12.50"
    });
    const [showtimes, setShowtimes] = useState({});
    const [showtimeErrors, setShowtimeErrors] = useState({});

    // Handle genre selection
    const handleGenreChange = (e) => {
        const genre = e.target.value;
        if (genre && !newMovie.genres.includes(genre) && genre !== "") {
            setNewMovie(prev => ({
                ...prev,
                genres: [...prev.genres, genre]
            }));
        }
    };

    // Remove genre
    const removeGenre = (genre) => {
        setNewMovie(prev => ({
            ...prev,
            genres: prev.genres.filter(g => g !== genre)
        }));
    };

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

    // Handle showtime input changes
    const handleShowtimeChange = (e) => {
        const { id, value } = e.target;
        setNewShowtime(prev => ({
            ...prev,
            [id]: value
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const newErrors = {};
        
        // Validate required fields
        if (!newMovie.title) newErrors.title = "Title is required";
        if (!newMovie.posterUrl) newErrors.posterUrl = "Poster URL is required";
        if (!newMovie.synopsis) newErrors.synopsis = "Synopsis is required";
        if (!newMovie.duration) newErrors.duration = "Duration is required";
        if (!newMovie.director) newErrors.director = "Director is required";
        if (!newMovie.year) newErrors.year = "Year is required";
        if (newMovie.genres.length === 0) newErrors.genres = "At least one genre is required";
        
        // Validate cast members
        newMovie.cast.forEach((member, index) => {
            if (!member.name) {
                newErrors[`cast-${index}-name`] = "Actor name is required";
            }
        });
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        
        try {
            const response = await fetch('/api/movies', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMovie)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add movie");
            }
            
            // Reset form and refresh movies
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
                genres: ["Action", "Adventure"],
                cast: [{ name: "" }]
            });
            
            await fetchMovies();
        } catch (error) {
            console.error("Error adding movie:", error);
            setErrors({ submit: error.message });
        }
    }

    // Fetch movies on mount
    useEffect(() => {
        fetchMovies();
        fetchShowtimes();
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

    async function fetchShowtimes() {
        try {
            const response = await fetch('/api/showtimes');
            const data = await response.json();
            if (!response.ok) throw new Error("Failed to fetch showtimes");
            
            // Organize showtimes by movie ID
            const showtimesByMovie = {};
            data.forEach(showtime => {
                if (!showtimesByMovie[showtime.movieId]) {
                    showtimesByMovie[showtime.movieId] = [];
                }
                showtimesByMovie[showtime.movieId].push(showtime);
            });
            
            setShowtimes(showtimesByMovie);
        } catch (error) {
            console.error("Error fetching showtimes:", error);
            setErrors(prev => ({ ...prev, fetchShowtimes: error.message }));
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

    async function handleDeleteShowtime(showtimeId) {
        try {
            const response = await fetch(`/api/showtimes/${showtimeId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete showtime");
            }
            
            // Refresh showtimes
            await fetchShowtimes();
        } catch (error) {
            console.error("Error deleting showtime:", error);
            setShowtimeErrors({ delete: error.message });
        }
    }

    async function handleShowtimeSubmit(e) {
        e.preventDefault();
        const newErrors = {};
      
        // Validate required fields
        if (!selectedMovieId) newErrors.movieId = "Please select a movie";
        if (!newShowtime.date) newErrors.date = "Date is required";
        if (!newShowtime.time) newErrors.time = "Time is required";
        if (!newShowtime.auditorium) newErrors.auditorium = "Auditorium is required";
        if (!newShowtime.price) newErrors.price = "Price is required";
      
        setShowtimeErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
      
        try {
          const payload = {
            ...newShowtime,
            movieId: selectedMovieId
          };
      
          const response = await fetch('/api/showtimes', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
      
          const result = await response.json();
      
          if (!response.ok) {
            // Handle conflict error specially to show a more detailed message
            if (response.status === 409) {
              setShowtimeErrors({ 
                submit: result.message || "Scheduling conflict detected. Please choose a different time or auditorium."
              });
            } else {
              setShowtimeErrors({ submit: result.message || "Failed to add showtime" });
            }
            return;
          }
      
          // Reset form and refresh showtimes
          await fetchShowtimes();
          setNewShowtime({
            date: "",
            time: "",
            auditorium: "1",
            price: "12.50"
          });
          
          // Keep the selected movie but hide the form
          setShowShowtimesForm(false);
        } catch (error) {
          console.error("Error adding showtime:", error);
          setShowtimeErrors({ submit: error.message });
        }
      }

    async function handleShowtimeSubmit(e) {
        e.preventDefault();
        const newErrors = {};

        // Validate required fields
        if (!selectedMovieId) newErrors.movieId = "Please select a movie";
        if (!newShowtime.date) newErrors.date = "Date is required";
        if (!newShowtime.time) newErrors.time = "Time is required";
        if (!newShowtime.auditorium) newErrors.auditorium = "Auditorium is required";
        if (!newShowtime.price) newErrors.price = "Price is required";

        setShowtimeErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const payload = {
                ...newShowtime,
                movieId: selectedMovieId
            };

            const response = await fetch('/api/showtimes', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add showtime");
            }

            // Reset form and refresh showtimes
            await fetchShowtimes();
            setNewShowtime({
                date: "",
                time: "",
                auditorium: "1",
                price: "12.50"
            });
            
            // Keep the selected movie but hide the form
            setShowShowtimesForm(false);
        } catch (error) {
            console.error("Error adding showtime:", error);
            setShowtimeErrors({ submit: error.message });
        }
    }

    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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
                                    
                                    {/* Display genres */}
                                    {movie.genres && movie.genres.length > 0 && (
                                        <div className="mb-2">
                                            <div className="flex flex-wrap gap-1">
                                                {movie.genres.map(genre => (
                                                    <span key={genre} className="bg-red-800/30 px-2 py-0.5 rounded text-xs">
                                                        {genre}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <p className="text-sm mb-4 line-clamp-2">{movie.synopsis}</p>
                                    
                                    {/* Showtimes section */}
                                    {showtimes[movie.id || movie._id] && showtimes[movie.id || movie._id].length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-bold mb-2">Showtimes:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {showtimes[movie.id || movie._id].map(showtime => (
                                                    <div key={showtime.id || showtime._id} className="bg-red-800/30 p-1 rounded text-xs flex items-center">
                                                        <span>
                                                            {formatDate(showtime.date)} {showtime.time}
                                                            {" | "}Aud: {showtime.auditorium}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleDeleteShowtime(showtime.id || showtime._id)}
                                                            className="ml-2 text-red-400 hover:text-red-200"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => {
                                                setSelectedMovieId(movie.id || movie._id);
                                                setShowShowtimesForm(true);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Add Showtime
                                        </button>
                                        
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
                
                {/* Showtimes Form */}
                {showShowtimesForm && (
                    <div className="flex justify-center items-center mb-12">
                        <form 
                            onSubmit={handleShowtimeSubmit} 
                            className="text-white w-3/5 bg-red-700/15 backdrop-blur-sm border rounded-lg p-8"
                        >
                            <h2 className="text-center text-xl font-bold mb-6">
                                Add Showtime for {movies.find(m => (m.id || m._id) === selectedMovieId)?.title}
                            </h2>
                            
                            {showtimeErrors.submit && (
                                <div className="bg-red-500 bg-opacity-50 text-white p-4 rounded-lg mb-6">
                                    {showtimeErrors.submit}
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Date */}
                                <div>
                                    <label className="block mb-2">Date:</label>
                                    <input
                                        id="date"
                                        type="date"
                                        value={newShowtime.date}
                                        onChange={handleShowtimeChange}
                                        className="w-full text-black border border-gray-400 rounded-lg p-2"
                                    />
                                    {showtimeErrors.date && <p className="text-red-500 text-sm mt-1">{showtimeErrors.date}</p>}
                                </div>
                                
                                {/* Time */}
                                <div>
                                    <label className="block mb-2">Time:</label>
                                    <input
                                        id="time"
                                        type="time"
                                        value={newShowtime.time}
                                        onChange={handleShowtimeChange}
                                        className="w-full text-black border border-gray-400 rounded-lg p-2"
                                    />
                                    {showtimeErrors.time && <p className="text-red-500 text-sm mt-1">{showtimeErrors.time}</p>}
                                </div>
                                
                                {/* Auditorium */}
                                <div>
                                    <label className="block mb-2">Auditorium:</label>
                                    <select
                                        id="auditorium"
                                        value={newShowtime.auditorium}
                                        onChange={handleShowtimeChange}
                                        className="w-full text-black border border-gray-400 rounded-lg p-2"
                                    >
                                        <option value="1">Auditorium 1</option>
                                        <option value="2">Auditorium 2</option>
                                        <option value="3">Auditorium 3</option>
                                        <option value="4">Auditorium 4 (IMAX)</option>
                                        <option value="5">Auditorium 5 (3D)</option>
                                    </select>
                                    {showtimeErrors.auditorium && <p className="text-red-500 text-sm mt-1">{showtimeErrors.auditorium}</p>}
                                </div>
                                
                                {/* Price */}
                                <div>
                                    <label className="block mb-2">Ticket Price ($):</label>
                                    <input
                                        id="price"
                                        type="text"
                                        value={newShowtime.price}
                                        onChange={handleShowtimeChange}
                                        className="w-full text-black border border-gray-400 rounded-lg p-2"
                                    />
                                    {showtimeErrors.price && <p className="text-red-500 text-sm mt-1">{showtimeErrors.price}</p>}
                                </div>
                            </div>
                            
                            <div className="flex justify-center space-x-4 mt-6">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                                >
                                    Add Showtime
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowShowtimesForm(false)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {/* Add Movie Form section */}
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

                        {/* Genres Selection */}
                        <div className="p-4">
                            <label className="block mb-2">Genres:</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {newMovie.genres.map(genre => (
                                    <div key={genre} className="bg-red-900 text-white px-3 py-1 rounded-full flex items-center">
                                        <span>{genre}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeGenre(genre)}
                                            className="ml-2 text-white hover:text-red-200"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <select
                                onChange={handleGenreChange}
                                value=""
                                className="w-full text-black border border-gray-400 rounded-lg p-2"
                            >
                                <option value="">Select a genre to add</option>
                                {availableGenres
                                    .filter(genre => !newMovie.genres.includes(genre))
                                    .map(genre => (
                                        <option key={genre} value={genre}>
                                            {genre}
                                        </option>
                                    ))}
                            </select>
                            {errors.genres && <p className="text-red-500 text-sm mt-1">{errors.genres}</p>}
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