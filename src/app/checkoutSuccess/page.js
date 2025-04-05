'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/checkAuth');
        const data = await response.json();

        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          const storedOrder = localStorage.getItem('orderDetails');
          if (storedOrder) {
            setOrderDetails(JSON.parse(storedOrder));
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setError("Authentication failed. Please log in again.");
      }
    }
    checkAuth();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-red-950 to-red-900 text-white">
      <div className="text-center bg-black/90 border border-green-500 p-6 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-green-400">Payment Successful! 🎉</h1>
        <p className="mt-4 text-lg">Thank you for your purchase.</p>
        
        {orderDetails ? (
          <div className="bg-black/90 border border-green-500 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-4">
            <h2 className="text-xl font-bold text-green-400">🎟️ Order Receipt</h2>
            <p className="mt-2"><strong>Movie:</strong> {orderDetails.movieTitle}</p>
            <p><strong>Showtime:</strong> {orderDetails.showtime}</p>
            <p><strong>Seats:</strong> {orderDetails.selectedSeats.join(', ') || 'No seats selected'}</p>

            <h3 className="mt-4 font-semibold">Tickets</h3>
            {Object.entries(orderDetails.tickets).map(([type, count]) =>
              count > 0 && (
                <p key={type}>{count} x {type} (${(count * orderDetails.ticketPrices[type]).toFixed(2)})</p>
              )
            )}

            <h3 className="mt-4 font-bold text-lg">Total Paid: ${orderDetails.totalPrice.toFixed(2)}</h3>
          </div>
        ) : (
          <p>Loading receipt...</p>
        )}

        <button onClick={() => router.push(isLoggedIn ? '/home' : '/')} 
          className="mt-6 px-6 py-3 bg-green-700 text-white font-bold rounded-md hover:bg-green-600 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
