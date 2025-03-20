"use client";
import { useState } from "react";
import Link from 'next/link';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        try {          
            setMessage("");
            setIsLoading(true);
            e.preventDefault();
            const res = await fetch("/api/sendResetLink", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            
            // Split email at the @ sign
            const [localPart, domain] = email.split('@');
            
            // Keep first letter, mask the rest with asterisks
            const firstLetter = localPart[0];
            const maskedPart = '*'.repeat(localPart.length - 1);
            
            const final = `We've sent an link to ${firstLetter}${maskedPart}@${domain} If you don't see it in your inbox, please check your spam folder or verify your email address.`;
            setMessage(final);
            setEmail("");
        } catch (error) {
            setMessage("Error: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black-500 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
                {message && <p className="mt-2 text-sm text-green-700">{message}</p>}

                <form onSubmit={handleSubmit} className="mt-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                        required
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className="mt-3 group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                        >
                        {isLoading ? 'Sending... ' : 'Send Reset Link'}  
                    </button>
                    <Link href="/login" className='mt-3 flex justify-center text-gray-500 text-xs hover:text-red-600'>
                        Back
                    </Link>

                </form>
            </div>
        </div>
    );
}