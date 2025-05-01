'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function changePassword() {
  
  const [isLoading, setIsLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

    // Get the user's email by checking auth in a useEffect
    useEffect(() => {
      async function checkAuth() {
        try {
          // Call an API that checks the cookie and returns email
          const response = await fetch('/api/checkAuth');
          const data = await response.json();
          
          if (data.isLoggedIn) {
            setEmail(data.email);
            setIsAdmin(data.isAdmin)
          } else {
            // Redirect to login if not authenticated
            router.push('/login');
          }
        } catch (error) {
          console.error('Authentication check failed:', error);
          setError("Authentication failed. Please log in again.");
          router.push('/login');
        }
      }
      
      checkAuth();
    }, [router]);

      // Fetch user data from the database when the component mounts
  useEffect(() => {
        if (!email) return; // Don't fetch if no email yet
        async function fetchUserAddress() {
            if (!email) return; // Don't fetch if no email yet
      
            try {
              setIsLoading(true);
              setError("");
            } catch (error) {
              setError("Failed to load email.");
            } finally {
              setIsLoading(false);
            }
          }
          
          fetchUserAddress();
  }, [email]);


  async function handleVerify (e) {
    e.preventDefault();
    try {
        const response = await fetch("/api/verifyUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: currentPassword }),
        });

        const data = await response.json();
      
        if (!response.ok) {
          throw new Error(data.error || "Incorrect Password.");
        }

        if(data.success !== true) {
            throw new Error(data.error || "Incorrect Password.");
        }

        setVerified(true);
        setError("");
        setSuccess("Verified!");
        setTimeout(() => {
            setSuccess("");
        }, 1000);
    } catch (error) {
        setSuccess("");
        setError(error.message);
    }
  }

  async function handleChangePassword (e) {
    e.preventDefault();
    try {

        if (!newPassword || !confirmPassword) {
            throw new Error("Please fill in both fields.");
        }

        // Password validation checks
        if (newPassword == currentPassword) {
            throw new Error("New password cannot be the same as old password.");
        }

        if (newPassword != confirmPassword) {
            throw new Error("Passwords are not the same.");
        }

        if (newPassword.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }
        
        const response = await fetch("/api/changePassword", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email, 
                password: newPassword ,
                isAdmin: isAdmin
            }),
        });

        const data = await response.json();
      
        if (!response.ok) {
          throw new Error(data.error || "Failed to update password.");
        }

        if(data.success !== true) {
            throw new Error(data.error || "Failed to update password.");
        }
        setError("");
        setSuccess("Password updated successfully!");
        setTimeout(() => {
            router.push("/editProfile");
        }, 1000);
    } catch (error) {
        setSuccess("");
        setError(error.message);
    }
  }

  const handleHome = () => {
    router.push("/home");
  };

  const handleProfile= () => {
    router.push("/editProfile");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-red-950 to-red-900 text-white">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg w-full text-center text-black">
          <p>Loading information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-red-950 to-red-900">
      {/* Fixed Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-900 h-[95px] flex justify-between items-center px-4">
        <div className="text-white text-4xl font-semibold">Cinebook🍿</div>
        <button
          type="button"
          onClick={handleHome}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Back to Home
        </button>
      </header>
      
      {/* Main Content - with top padding to clear the header */}
      <main className="flex justify-center items-center flex-grow pt-[120px] px-4 pb-8">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg w-full text-black">
          <h2 className="text-4xl font-bold mb-4 text-gray-700 text-center">Change Password</h2>

          {/* Success Message */}
          {success && (
            <div className="mt-4 mb-4 p-3 rounded-lg bg-green-100 text-green-900 border border-green-400">
                {success}
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="p-3 mb-4 bg-red-100 text-red-900 rounded-lg border border-red-400">
              {error}
            </div>
          )}
          
          <form onSubmit={handleChangePassword} className="space-y-4">          
              <div className="space-y-4">
                
                {/* Use Saved Address */}
                {!verified && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <div>
                      <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={handleVerify}
                        >
                            Verify
                        </button> 
                    </div>
                  </div>
                )}
                
                {/* Enter Custom Address */}
                {verified && (
                  <div className="space-y-4">
                    <div>
                      <div>
                        <label htmlFor="streetNumber" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="streetName" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-center space-x-4 mt-6">
                    <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Submit
                        </button> 
                    </div>
                  </div>
                )}
              </div>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                    type="button"
                    onClick={handleProfile}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Back to Profile
                  </button> 
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}