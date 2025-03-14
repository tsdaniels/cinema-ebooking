'use client';

import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-red-600 to-rose-800 text-white">
      <div className="text-center bg-black/90 border border-green-500 p-6 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-green-400">Payment Successful! 🎉</h1>
        <p className="mt-4 text-lg">Thank you for your purchase.</p>
        {/*Work in progress. Add receipt here.*/}
        <button 
          onClick={() => router.push('/')} 
          className="mt-6 px-6 py-3 bg-green-700 text-white font-bold rounded-md hover:bg-green-600 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
