'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Resend() {
    const [email, setemail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const checkVerified = async () => {
        try {
            const response = await fetch('/api/checkVerified', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log("Error checking email:", error);
            return false;
        }
    };

    const handleResend = async () => {

        try {
            // Reset error and success messages
            setError("");
            setSuccess("");

            setIsLoading(true);
                        
            // Validation checks
            if (!email) {
                setError("Please enter valid email");
                return;
            }

            const isUserVerified = await checkVerified(email);
        
            if (!isUserVerified.exists) {
                setError("Email not found. Please try again.");
                return;
            } else if (isUserVerified.verified) {
                setError("Account already verified.");
                return;
            }

            const response = await fetch('/api/email/resend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });
            
            if (!response.ok) {
                setError(response.error);
                return;
            }

            if(response.ok) {
                setSuccess('Email sent! Redirecting...');
                setTimeout(() => {
                    router.push("/verification/resend/resendSuccess");
                }, 1500);
            }

        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleResend();
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-black-500 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Resend verification email
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Please enter the email associated with your account.
                        </p>
                    </div>


                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200">
                            {success}
                        </div>
                    )}

                    <div className="mt-8 space-y-4">
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                    placeholder="Email"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleResend}
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Sending' : 'Send'}
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    );
}