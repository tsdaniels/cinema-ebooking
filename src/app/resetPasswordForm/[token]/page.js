"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"

export default function ResetPassword() {
  const params = useParams();
  const token = params.token;
  const router = useRouter();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const checkVerified = async () => {
      try {
        setIsLoading(true);
        console.log(token);
        const response = await fetch('/api/checkLoginVerify', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ token }),
        });
        
        const data = await response.json();
      
        if (!data.exists || !data.notExpired) {
          router.push('/resetPasswordForm/error');
        } else {
          setIsChecking(false);
          setIsValid(true);
        }
      } catch (error) {
        console.log("Error", error);
        setError("Invalid or expired token");
      } finally {
        setIsLoading(false);
      }
    };

    checkVerified();
  }, [token, router]); // Add dependencies

  const handleSubmit = async (e) => {
      e.preventDefault();
      // Password validation checks
      if (!newPassword || !confirmPassword) {
          setError("Please fill in both password fields");
          return;
      }
      if (newPassword.length < 8) {
          setError("Password must be at least 8 characters long");
          return;
      }
      if (newPassword !== confirmPassword) {
          setError("Passwords do not match");
          return;
      }     
      
      try {
        setIsLoading(true);
        const res = await fetch(`/api/resetPassword`, { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        });
        
        const data = await res.json();
        if (data.success) {
          setError("");
          setSuccess(data.message);
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
  };


    return (
        <div className="min-h-screen flex items-center justify-center bg-black-500 py-12 px-4 sm:px-6 lg:px-8">
          {/*Show a message indicating that the token is being checked*/ }
          {isChecking && (
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white-900">Checking Link...</h2>
          )}
          {/*Hide elements until token is verified*/ }
          {isValid && (
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
            
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
            
            <form onSubmit={handleSubmit} className="mt-4">
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    required
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="mt-2 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    required
                />
                <button 
                  type="submit" 
                  className="mt-3 group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    Submit
                </button>
            </form>
        </div>
          )}
        </div>
    );
}