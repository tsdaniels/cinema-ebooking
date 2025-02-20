'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const checkEmail = async () => {
        try {
            const response = await fetch('/api/checkEmail', {
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
            return !data.exists;
        } catch (error) {
            console.log("Error checking email:", error);
            return false;
        }
    };

    const handleSignup = async () => {
        try {
            // Reset error and success messages
            setError("");
            setSuccess("");
    
            // Email validation using the validator
            const emailValidation = validateEmail(email);
            if (!emailValidation.isValid) {
                setError(emailValidation.errorMessage);
                return;
            }
    
            // Check if email exists
            const isEmailAvailable = await checkEmail(email);
            if (!isEmailAvailable) {
                setError("Email already exists. Please choose another.");
                return;
            }
    
            // Password validation checks
            if (!password || !confirmPassword) {
                setError("Please fill in both password fields");
                return;
            }
            if (password.length < 8) {
                setError("Password must be at least 8 characters long");
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }
    
            // If all validations pass, attempt signup
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            const data = await response.json();
            
            if (response.ok && data.success) {
                setSuccess('Signup successful! Redirecting...');
                setTimeout(() => {
                    router.push("/signupAccepted");
                }, 1500);
            } else {
                setError(data.error || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.log("Error:", error);
            setError("An error occurred during signup. Please try again.");
        }
    };
    
    // Email validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        const validation = {
            isNotEmpty: email?.length > 0,
            hasAtSymbol: email?.includes('@'),
            hasDomain: email?.includes('.'),
            isValidFormat: emailRegex.test(email || ''),
            isStrictlyValid: simpleEmailRegex.test(email || ''),
            hasValidLength: email?.length >= 3 && email?.length <= 254,
            hasValidLocalPart: email?.split('@')[0]?.length <= 64
        };
    
        return {
            isValid: Object.values(validation).every(Boolean),
            details: validation,
            errorMessage: getErrorMessage(validation)
        };
    }
    
    function getErrorMessage(validation) {
        if (!validation.isNotEmpty) return "Please enter an email";
        if (!validation.hasAtSymbol) return "Email must contain '@' symbol";
        if (!validation.hasDomain) return "Email must contain a domain";
        if (!validation.hasValidLength) return "Email length must be between 3 and 254 characters";
        if (!validation.hasValidLocalPart) return "Local part of email cannot exceed 64 characters";
        if (!validation.isValidFormat) return "Invalid email format";
        return "";
    }



    return (
        <>
        <div className="min-h-screen flex items-center justify-center bg-black-500 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join us today and get started
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
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleSignup}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                            Sign up
                        </button>
                    </div>
                    
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-red-600 hover:text-red-500">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
        </>
    );
}