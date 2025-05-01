'use client';

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// Function to fetch movie showtimes from the backend
const fetchShowtimes = async (movieId) => {
  try {
    const response = await fetch(`/api/movies/${movieId}/showtimes`);
    if (!response.ok) {
      throw new Error(`Failed to fetch showtimes: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    return [];
  }
};

// Function to fetch a specific showtime by ID
const fetchShowtimeById = async (movieId, showtimeId) => {
  try {
    // First try to get the specific showtime
    const response = await fetch(`/api/showtimes/${showtimeId}`);
    if (response.ok) {
      return await response.json();
    }
    
    // Fall back to fetching all showtimes and finding the right one
    const showtimes = await fetchShowtimes(movieId);
    return showtimes.find(s => s._id === showtimeId || s.id === showtimeId) || showtimes[0] || null;
  } catch (error) {
    console.error("Error fetching specific showtime:", error);
    return null;
  }
};

// Function to check authentication
const checkAuth = async () => {
  try {
    const response = await fetch("/api/checkAuth");
    if (!response.ok) {
      return { isLoggedIn: false, user: null };
    }
    const data = await response.json();
    return { isLoggedIn: data.isLoggedIn, email: data.email };
  } catch (error) {
    console.error("Auth check error:", error);
    return { isLoggedIn: false, user: null };
  }
};

// Function to get user info - made optional
const getUserInfo = async (email) => {
  if (!email) return null;
  
  try {
    const response = await fetch(`/api/user?email=${email}`);
    if (!response.ok) {
      console.warn("User info not found, but continuing as guest");
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn("Error fetching user info, continuing as guest:", error);
    return null;
  }
};

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get('movieId');
  const showtimeId = searchParams.get('showtimeId');
  
  const [isClient, setIsClient] = useState(false);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [numTickets, setNumTickets] = useState({
    adult: 1, // Default to 1 adult ticket
    child: 0,
    senior: 0,
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardExpiry: "",
    cvv: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [movieDetails, setMovieDetails] = useState(null);

  // First effect - client-side rendering check and auth check
  useEffect(() => {
    setIsClient(true);
    
    // Check authentication status
    const checkUserAuth = async () => {
      setCheckingAuth(true);
      const authData = await checkAuth();
      
      if (authData.isLoggedIn) {
        setIsAuthenticated(true);
        // Try to get user info, but don't block if it fails
        const userInfo = await getUserInfo(authData.email);
        if (userInfo) {
          setUser(userInfo);
          setName(userInfo.name || "");
          setEmail(userInfo.email || "");
        } else {
          setEmail(authData.email || "");
        }
      }
      
      setCheckingAuth(false);
    };
    
    checkUserAuth();
  }, []);

  // Second effect - fetch movie details
  useEffect(() => {
    if (movieId && isClient) {
      const fetchMovieDetails = async () => {
        try {
          const response = await fetch(`/api/movies/${movieId}`);
          if (response.ok) {
            const data = await response.json();
            setMovieDetails(data);
          }
        } catch (error) {
          console.error("Error fetching movie details:", error);
        }
      };
      
      fetchMovieDetails();
    }
  }, [movieId, isClient]);

  // Third effect - load showtimes and selected showtime
  useEffect(() => {
    if (!movieId || !isClient) return;
    
    const loadShowtimeData = async () => {
      setLoading(true);
      
      try {
        // If we have a specific showtime ID, fetch that first
        if (showtimeId) {
          console.log(`Fetching specific showtime: ${showtimeId}`);
          const showtime = await fetchShowtimeById(movieId, showtimeId);
          if (showtime) {
            console.log("Fetched specific showtime:", showtime);
            setSelectedShowtime(showtime);
            // Also load all showtimes for selection
            const allShowtimes = await fetchShowtimes(movieId);
            console.log("Fetched all showtimes:", allShowtimes);
            setShowtimes(allShowtimes);
          } else {
            // Fallback to loading all showtimes
            console.log("Specific showtime not found, loading all showtimes");
            const allShowtimes = await fetchShowtimes(movieId);
            console.log("Fetched all showtimes:", allShowtimes);
            setShowtimes(allShowtimes);
            setSelectedShowtime(allShowtimes[0] || null);
          }
        } else {
          // Load all showtimes if no specific one requested
          console.log("No specific showtime requested, loading all showtimes");
          const allShowtimes = await fetchShowtimes(movieId);
          console.log("Fetched all showtimes:", allShowtimes);
          setShowtimes(allShowtimes);
          setSelectedShowtime(allShowtimes[0] || null);
        }
      } catch (error) {
        console.error("Error loading showtime data:", error);
        setError("Failed to load showtime information. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadShowtimeData();
  }, [movieId, showtimeId, isClient]);

  const calculateTotalPrice = () => {
    const price = selectedShowtime?.price || 10;
    return (
      numTickets.adult * price +
      numTickets.child * (price * 0.5) +
      numTickets.senior * (price * 0.75)
    ).toFixed(2);
  };

  const totalTicketsCount = () => {
    return numTickets.adult + numTickets.child + numTickets.senior;
  };

  // Generate sample seat data - in a real app, this would come from your API
  const generateSeatOptions = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 8;
    const seatOptions = [];
    
    for (const row of rows) {
      for (let i = 1; i <= seatsPerRow; i++) {
        seatOptions.push(`${row}${i}`);
      }
    }
    
    return seatOptions;
  };

  const handleSeatSelect = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));


    } else {
      if (selectedSeats.length < totalTicketsCount()) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        setError(`You can only select ${totalTicketsCount()} seats.`);
      }
    }
  };

  const handleLoginRedirect = () => {
    // Store the current checkout page URL to return after login
    const currentPath = `/checkout?movieId=${movieId}${showtimeId ? `&showtimeId=${showtimeId}` : ''}`;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error
    setError(null);

    // Check if logged in for final checkout
    if (!isAuthenticated) {
      setError("Please log in to complete your booking.");
      return;
    }

    // Basic validation
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

    if (!name || !email) {
      setError("Please provide your name and email.");
      return;
    }

    if (!paymentInfo.cardNumber || !paymentInfo.cardExpiry || !paymentInfo.cvv) {
      setError("Please provide valid payment information.");
      return;
    }

    // Card validation - just basic checks
    if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16 || !/^\d+$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      setError("Please enter a valid 16-digit card number.");
      return;
    }

    const bookingData = {
      movieId,
      showtimeId: selectedShowtime._id || selectedShowtime.id,
      seats: selectedSeats,
      tickets: numTickets,
      totalPrice: parseFloat(calculateTotalPrice()),
      paymentInfo: {
        cardNumber: paymentInfo.cardNumber.slice(-4),
        cardExpiry: paymentInfo.cardExpiry,
      },
      customerName: name,
      customerEmail: email,
      userId: user?.id, // Add the user ID for associating with their account
    };

    try {
      // Send the data to the backend
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      
      if (response.ok) {
        // After booking, redirect to checkoutSuccess page instead of confirmation page
        router.push(`/checkoutSuccess?bookingId=${result.bookingId}`);
      } else {
        setError(result.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setError("An error occurred while processing your booking. Please try again.");
    }
  };

  // While checking authentication or loading data
  if ((!isClient || loading || checkingAuth) && !error) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
        </div>
        <p className="mt-4">Loading checkout information...</p>
      </div>
    );
  }

  // Error fetching showtimes
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
          {movieDetails.posterUrl && (
            <img 
              src={movieDetails.posterUrl} 
              alt={movieDetails.title} 
              className="w-16 h-24 object-cover rounded mr-4" 
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{movieDetails.title}</h2>
            <p className="text-gray-700">{movieDetails.duration || "1h 58m"} • {movieDetails.rating || "PG-13"}</p>
          </div>
        </div>
      )}

      {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {!isAuthenticated && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-400 rounded-lg">
          <p className="text-yellow-800 mb-2">
            For a better experience and to save your booking history, please log in.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Log In
          </button>
          <p className="text-sm text-gray-600 mt-2">
            You can continue as a guest, but you'll need to log in to complete the booking.
          </p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Showtime Selection:</h2>
        <div className="mt-2">
          <select
            className="p-2 border border-gray-400 rounded-lg w-full"
            value={selectedShowtime?._id || selectedShowtime?.id || ''}
            onChange={(e) => {
              const selected = showtimes.find(show => show._id === e.target.value || show.id === e.target.value);
              setSelectedShowtime(selected || null);
            }}
          >
            {showtimes.map((showtime, index) => (
              <option key={showtime._id || showtime.id || `showtime-${index}`} value={showtime._id || showtime.id}>
                {showtime.date && typeof showtime.date === 'string' 
                  ? new Date(showtime.date).toLocaleDateString() 
                  : 'Date unavailable'} - {showtime.time} - ${showtime.price || 10}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Ticket Selection:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="p-4 border rounded-lg">
            <label htmlFor="adultTickets" className="block font-medium">
              Adult Tickets (${selectedShowtime?.price || 10})
            </label>
            <input
              type="number"
              id="adultTickets"
              className="mt-2 p-2 border border-gray-400 rounded-lg w-full"
              value={numTickets.adult}
              onChange={(e) => {
                const value = Math.max(0, parseInt(e.target.value) || 0);
                setNumTickets({ ...numTickets, adult: value });
                // Reset selected seats if ticket count changes
                setSelectedSeats([]);
              }}
              min="0"
            />
          </div>

          <div className="p-4 border rounded-lg">
            <label htmlFor="childTickets" className="block font-medium">
              Child Tickets (${(selectedShowtime?.price * 0.5 || 5).toFixed(2)})
            </label>
            <input
              type="number"
              id="childTickets"
              className="mt-2 p-2 border border-gray-400 rounded-lg w-full"
              value={numTickets.child}
              onChange={(e) => {
                const value = Math.max(0, parseInt(e.target.value) || 0);
                setNumTickets({ ...numTickets, child: value });
                setSelectedSeats([]);
              }}
              min="0"
            />
          </div>

          <div className="p-4 border rounded-lg">
            <label htmlFor="seniorTickets" className="block font-medium">
              Senior Tickets (${(selectedShowtime?.price * 0.75 || 7.5).toFixed(2)})
            </label>
            <input
              type="number"
              id="seniorTickets"
              className="mt-2 p-2 border border-gray-400 rounded-lg w-full"
              value={numTickets.senior}
              onChange={(e) => {
                const value = Math.max(0, parseInt(e.target.value) || 0);
                setNumTickets({ ...numTickets, senior: value });
                setSelectedSeats([]);
              }}
              min="0"
            />
          </div>
        </div>
      </div>

      {totalTicketsCount() > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Seat Selection: {selectedSeats.length}/{totalTicketsCount()}</h2>
          <p className="mt-2 text-sm text-gray-600">Please select {totalTicketsCount()} seats for your tickets.</p>
          
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <div className="w-full h-8 bg-gray-800 mb-6 text-center text-white py-1 rounded">Screen</div>
            <div className="grid grid-cols-8 gap-2">
              {seatOptions.map((seat) => (
                <button
                  key={seat}
                  className={`p-2 rounded ${
                    selectedSeats.includes(seat)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-200'
                  }`}
                  onClick={() => handleSeatSelect(seat)}
                  disabled={selectedSeats.length >= totalTicketsCount() && !selectedSeats.includes(seat)}
                >
                  {seat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        <h2 className="text-xl font-semibold">Customer Information:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label htmlFor="name" className="block font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border border-gray-400 rounded-lg w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border border-gray-400 rounded-lg w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6">Payment Information:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label htmlFor="cardNumber" className="block font-medium">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              className="mt-1 p-2 border border-gray-400 rounded-lg w-full"
              value={paymentInfo.cardNumber}
              onChange={(e) => {
                // Only allow digits and space
                const value = e.target.value.replace(/[^\d\s]/g, '');
                setPaymentInfo({ ...paymentInfo, cardNumber: value });
              }}
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength="19"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="cardExpiry" className="block font-medium">
                Expiry Date
              </label>
              <input
                type="text"
                id="cardExpiry"
                className="mt-1 p-2 border border-gray-400 rounded-lg w-full"
                value={paymentInfo.cardExpiry}
                onChange={(e) => {
                  // Format MM/YY
                  let value = e.target.value.replace(/[^\d]/g, '');
                  if (value.length > 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setPaymentInfo({ ...paymentInfo, cardExpiry: value });
                }}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>

            <div>
              <label htmlFor="cardCvv" className="block font-medium">
                CVV
              </label>
              <input
                type="text"
                id="cardCvv"
                className="mt-1 p-2 border border-gray-400 rounded-lg w-full"
                value={paymentInfo.cvv}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setPaymentInfo({ ...paymentInfo, cvv: value });
                }}
                placeholder="123"
                maxLength="3"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Order Summary:</h2>
          {numTickets.adult > 0 && (
            <div className="flex justify-between mt-2">
              <span>Adult tickets (x{numTickets.adult})</span>
              <span>${(numTickets.adult * (selectedShowtime?.price || 10)).toFixed(2)}</span>
            </div>
          )}
          {numTickets.child > 0 && (
            <div className="flex justify-between mt-1">
              <span>Child tickets (x{numTickets.child})</span>
              <span>${(numTickets.child * (selectedShowtime?.price || 10) * 0.5).toFixed(2)}</span>
            </div>
          )}
          {numTickets.senior > 0 && (
            <div className="flex justify-between mt-1">
              <span>Senior tickets (x{numTickets.senior})</span>
              <span>${(numTickets.senior * (selectedShowtime?.price || 10) * 0.75).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between mt-2 pt-2 border-t border-gray-300 font-bold">
            <span>Total</span>
            <span>${calculateTotalPrice()}</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className={`${
              isAuthenticated 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gray-400'
            } text-white p-3 rounded-lg w-full transition-colors`}
            disabled={
              totalTicketsCount() === 0 ||
              selectedSeats.length !== totalTicketsCount() ||
              !selectedShowtime
            }
          >
            {isAuthenticated ? 'Complete Booking' : 'Log In to Complete Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}