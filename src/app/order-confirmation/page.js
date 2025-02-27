'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function OrderConfirmation() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-sm shadow-lg text-center max-w-md border-2 border-red-800">
        <h1 className="text-2xl font-bold text-red-600">Order Confirmed!</h1>
        <p className="mt-2 text-gray-700">Thank you for your purchase.</p>
        <p className="mt-1 text-gray-500">
          A confirmation email has been sent to your inbox.
        </p>
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => router.push('/')}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
