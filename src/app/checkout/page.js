'use client';

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const fetchShowtimes = async (movieId) => {
  try {
    const response = await fetch(`/api/movies/${movieId}/showtimes`);
    if (!response.ok) throw new Error("Failed to fetch showtimes");
    return await response.json();
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    return [];
  }
};

const fetchShowtimeById = async (movieId, showtimeId) => {
  try {
    const response = await fetch(`/api/showtimes/${showtimeId}`);
    if (response.ok) return await response.json();
    
    const showtimes = await fetchShowtimes(movieId);
    return showtimes.find(s => s._id === showtimeId || s.id === showtimeId) || null;
  } catch (error) {
    console.error("Error fetching showtime:", error);
    return null;
  }
};

const checkAuth = async () => {
  try {
    const response = await fetch("/api/auth/check");
    if (!response.ok) {
      return { isAuthenticated: false, user: null };
    }
    return await response.json();
  } catch (error) {
    console.error("Auth check error:", error);
    return { isAuthenticated: false, user: null };
  }
};

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get('movieId');
  const showtimeId = searchParams.get('showtimeId');
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [numTickets, setNumTickets] = useState({ adult: 1, child: 0, senior: 0 });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Authentication check and data loading
  useEffect(() => {
    const verifyAuthAndLoadData = async () => {
      setIsLoading(true);
      
      try {
        // Check authentication
        const authData = await checkAuth();
        
        if (!authData.isAuthenticated) {
          const returnUrl = encodeURIComponent(`/checkout?movieId=${movieId}${showtimeId ? `&showtimeId=${showtimeId}` : ''}`);
          router.push(`/login?redirect=${returnUrl}`);
          return;
        }
        
        setIsAuthenticated(true);
        setUser(authData.user);
        
        // Load movie details
        if (movieId) {
          const movieResponse = await fetch(`/api/movies/${movieId}`);
          if (movieResponse.ok) {
            setMovieDetails(await movieResponse.json());
          }
        }
        
        // Load showtimes
        if (movieId) {
          const showtimesData = showtimeId 
            ? await fetchShowtimeById(movieId, showtimeId).then(st => {
                if (st) return [st];
                return fetchShowtimes(movieId);
              })
            : await fetchShowtimes(movieId);
            
          setShowtimes(showtimesData);
          setSelectedShowtime(showtimesData[0] || null);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load checkout data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAuthAndLoadData();
  }, [router, movieId, showtimeId]);

  const calculateTotalPrice = () => {
    const price = selectedShowtime?.price || 10;
    return (
      numTickets.adult * price +
      numTickets.child * (price * 0.5) +
      numTickets.senior * (price * 0.75)
    ).toFixed(2);
  };

  const totalTicketsCount = () => numTickets.adult + numTickets.child + numTickets.senior;

  const generateSeatOptions = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 8;
    return rows.flatMap(row => 
      Array.from({ length: seatsPerRow }, (_, i) => `${row}${i + 1}`)
    );
  };

  const handleSeatSelect = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else if (selectedSeats.length < totalTicketsCount()) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      setError(`You can only select ${totalTicketsCount()} seats.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!selectedShowtime) {
      setError("Please select a showtime.");
      return;
    }

    if (totalTicketsCount() === 0) {
      setError("Please select at least one ticket.");
      return;
    }

    if (selectedSeats.length !== totalTicketsCount()) {
      setError(`Please select exactly ${totalTicketsCount()} seats.`);
      return;
    }

    try {
      const bookingData = {
        movieId,
        showtimeId: selectedShowtime._id || selectedShowtime.id,
        seats: selectedSeats,
        tickets: numTickets,
        totalPrice: parseFloat(calculateTotalPrice()),
        userId: user?.id,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      router.push(`/checkoutSuccess?bookingId=${result.bookingId}`);
    } catch (error) {
      console.error("Booking error:", error);
      setError(error.message || "Booking failed. Please try again.");
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
        <p>Loading checkout information...</p>
      </div>
    );
  }

  if (error && showtimes.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="mt-4 text-red-500">{error}</div>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 bg-blue-500 text-white p-3 rounded-lg"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  const seatOptions = generateSeatOptions();

  return (
    <div className="w-full p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Checkout</h1>
      
      {movieDetails && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg flex items-center">
          <img 
            src={movieDetails.posterUrl} 
            alt={movieDetails.title} 
            className="w-16 h-24 object-cover rounded mr-4" 
          />
          <div>
            <h2 className="text-xl font-semibold">{movieDetails.title}</h2>
            <p className="text-gray-700">{movieDetails.duration} • {movieDetails.rating}</p>
          </div>
        </div>
      )}

      {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {/* Showtime selection and other form elements... */}
      
      <form onSubmit={handleSubmit}>
        {/* Form fields for tickets, seats, and payment... */}
        
        <button
          type="submit"
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg w-full"
          disabled={!selectedShowtime || selectedSeats.length !== totalTicketsCount()}
        >
          Complete Booking
        </button>
      </form>
    </div>
  );
}