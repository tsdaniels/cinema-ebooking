'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ShowtimeSelection() {
  const router = useRouter();
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [tickets, setTickets] = useState({ adult: 0, child: 0, senior: 0 });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const ticketPrices = { adult: 12.99, child: 9.99, senior: 10.99 };
  
  const totalTickets = Object.values(tickets).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(tickets).reduce(
    (total, [type, count]) => total + count * ticketPrices[type],
    0
  );

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSeatSelection = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < totalTickets) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      alert(`You can only select ${totalTickets} seats.`);
    }
  };

  return (
    <div className="flex bg-gradient-to-b from-red-600 to-rose-800 text-white h-screen p-6 gap-6 pt-6">
      {/* Left Section */}
      <div className="flex flex-col w-2/3 gap-6">
      <h1 className="text-4xl font-bold text-white">Checkout 🛒</h1>
        {/* Showtime Selection */}
        <div className="bg-black/90 border border-red-700 p-4 rounded-lg">
          <h2 className="text-xl font-bold">Select Showtime</h2>
          <button onClick={() => setSelectedShowtime('3:15 PM')} className="mt-3 p-2 bg-red-700 rounded mr-3">3:15 PM</button>
          <button onClick={() => setSelectedShowtime('5:00 PM')} className="mt-3 p-2 bg-red-700 rounded mr-3">5:00 PM</button>
          <button onClick={() => setSelectedShowtime('7:30 PM')} className="mt-3 p-2 bg-red-700 rounded mr-3">7:30 PM</button>
          <button onClick={() => setSelectedShowtime('8:45 PM')} className="mt-3 p-2 bg-red-700 rounded mr-3">8:45 PM</button>
        </div>

        {/* Ticket Selection */}
        <div className="bg-black/90 border border-red-700 p-4 rounded-lg">
        <h2 className="text-xl font-bold">Select Tickets</h2>
        {Object.keys(tickets).map((type) => (
            <div key={type} className="flex justify-between items-center my-2 text-lg">
            <span>{type.charAt(0).toUpperCase() + type.slice(1)} Ticket</span>

            {/* Buttons to adjust ticket quantity */}
            <div className="flex gap-3 items-center">
                <button
                onClick={() => setTickets((prevTickets) => ({
                    ...prevTickets,
                    [type]: Math.max(prevTickets[type] - 1, 0), // Decrease ticket count, ensuring it doesn't go below 0
                }))}
                className="px-3 py-1 bg-red-700 text-white rounded-md"
                >
                -
                </button>
                <span>{tickets[type]}</span> {/* Display the ticket count */}
                <button
                onClick={() => setTickets((prevTickets) => ({
                    ...prevTickets,
                    [type]: prevTickets[type] + 1, // Increase ticket count
                }))}
                className="px-3 py-1 bg-red-700 text-white rounded-md"
                >
                +
                </button>
            </div>
            </div>
        ))}
        </div>

        {/* Seat Selection */}
        <div className="bg-black/90 border border-red-700 p-4 rounded-lg">
          <h2 className="text-xl font-bold">Select Seats</h2>
          <div className="grid grid-cols-5 gap-2 mt-3">
            {Array.from({ length: 20 }, (_, i) => (
              <button 
                key={i} 
                onClick={() => handleSeatSelection(i + 1)}
                className={`p-2 rounded transition-colors duration-300 ease-in-out ${selectedSeats.includes(i + 1) ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-black/90 border border-red-700 p-4 rounded-lg">
          <h2 className="text-xl font-bold">Payment</h2>
          <input
            type="text"
            placeholder="Card Number"
            className="border p-3 w-full rounded-md bg-red-500 bg-opacity-10 text-white border-red-700 focus:border-red-500 my-3"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            />
            <div className="flex gap-2">
            <input
                type="text"
                placeholder="Expiry (MM/YY)"
                className="border p-3 w-1/2 rounded-md bg-red-500 bg-opacity-10 text-white border-red-700 focus:border-red-500"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
            />
            <input
                type="text"
                placeholder="CVV"
                className="border p-3 w-1/2 rounded-md bg-red-500 bg-opacity-10 text-white border-red-700 focus:border-red-500"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
            />
            </div>
        </div>
      </div>
      
      {/* Right Section */}
      {/* Order Summary */}
      <div className="w-1/3 bg-black/90 border border-red-700 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-red-500">Order Summary</h2>
        <p>Showtime: {selectedShowtime || 'Not Selected'}</p>
        <h3 className="mt-3 font-semibold">Tickets</h3>
        {Object.entries(tickets).map(([type, count]) => (
          count > 0 && <p key={type}>{count} x {type} (${(count * ticketPrices[type]).toFixed(2)})</p>
        ))}
        <h3 className="mt-3 font-semibold">Your Seats</h3>
        <p>{selectedSeats.length ? selectedSeats.join(', ') : 'No seats selected'}</p>
        <div className='flex gap-6 items-center border-b border-gray-700 pb-8'></div>
        <div className="flex gap-6 items-center border-b border-gray-700 pb-6">
            <img src="https://m.media-amazon.com/images/M/MV5BOWMwYjYzYmMtMWQ2Ni00NWUwLTg2MzAtYzkzMDBiZDIwOTMwXkEyXkFqcGc@._V1_.jpg" alt="Movie Poster" width={120} height={180} className="rounded-lg pt-6" />
            <div>
                <h2 className="text-3xl font-bold text-red-500">Wicked</h2>
                <p className="text-lg mt-2">🎬 Musical/Fantasy | ⏰ 2 hr 40 min</p>
            </div>
        </div>
        
        <h3 className="mt-3 font-bold">Total: ${totalPrice.toFixed(2)}</h3>
        <button 
            onClick={() => router.push('/checkoutSuccess')}
            className="mt-6 px-6 py-3 text-lg text-green-600 font-semibold shadow-lg border border-green-600 hover:before:bg-green-600 relative overflow-hidden transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-green-600 before:transition-all before:duration-500 hover:text-white hover:shadow-green-600 hover:before:left-0 hover:before:w-full group w-full rounded">
            <span className="relative z-10">Pay Now</span>
        </button>
        <button 
          onClick={() => router.push('/')} 
          className="mt-3 p-2 bg-gray-700 rounded mr-3 w-full hover:bg-gray-600 transition-colors duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
