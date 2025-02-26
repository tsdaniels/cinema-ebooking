'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resend, setResend] = useState("");
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
            return data.verified;
        } catch (error) {
            console.log("Error checking email:", error);
            return false;
        }
    };

    const handleLogin = async () => {

        try {
            // Reset error and success messages
            setError("");
            setSuccess("");
            setResend("");

            setIsLoading(true);
            
            // Validation checks
            if (!email || !password) {
                setError("Please enter both email and password");
                return;
            }

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            //check if user is verified
            const isUserVerified = await checkVerified(email);
            
            if (!response.ok) {
                setError("Login failed. Please try again.");
                return;
            }

            if (!isUserVerified) {
                setError("Account has not yet been verified.");
                setResend("Account has not yet been verified.");
                return;
            } else if (data.success) {
                setSuccess('Login successful!');
                router.push("/home");
                router.refresh(); // Refresh to update UI with new auth state
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred during login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-black-500 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Sign in to your account
                        </p>
                    </div>


                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-center border border-red-200">
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
                            <div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                        
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/signup" className="font-medium text-red-600 hover:text-red-500">
                                Sign up here
                            </Link>
                            <br></br>
                                <Link href="/" className="font-medium text-red-600 hover:text-red-500">
                                    Back
                                </Link>
                        </p>

                        {/* resend prompt */}
                        {resend && (
                            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200 text-center">
                                <Link href="/verification/resend" className="font-medium text-red-600 hover:text-red-500">
                                    Resend verification email
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}