'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    streetNumber: "",
    streetName: "",
    city: "",
    state: "",
    zipCode: "",
    promotions: false
  });

  const [originalProfile, setOriginalProfile] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    streetNumber: "",
    streetName: "",
    city: "",
    state: "",
    zipCode: "",
    promotions: false
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
    async function fetchUserData() {
      if (!email) return; // Don't fetch if no email yet

      try {
        setIsLoading(true);
        const response = await fetch("/api/fetchProfile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const data = await response.json();
        console.log("Profile data:", data.profile);
        
        // Update state with profile data
        if (data.profile) {
          setProfile({
            firstName: data.profile.firstName || "",
            lastName: data.profile.lastName || "",
            birthday: data.profile.birthday || "",
            streetNumber: data.profile.streetNumber || "",
            streetName: data.profile.streetName || "",
            city: data.profile.city || "",
            state: data.profile.state || "",
            zipCode: data.profile.zipCode || "",
            promotions: data.profile.promotions || false
          });

          setOriginalProfile({
            firstName: data.profile.firstName || "",
            lastName: data.profile.lastName || "",
            birthday: data.profile.birthday || "",
            streetNumber: data.profile.streetNumber || "",
            streetName: data.profile.streetName || "",
            city: data.profile.city || "",
            state: data.profile.state || "",
            zipCode: data.profile.zipCode || "",
            promotions: data.profile.promotions || false
          });
        }
        
        
        setError("");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserData();
  }, [email]);

  // Handle input changes when editing
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/editProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ...profile
        }),
      });
      
      if (!response.ok) throw new Error("Failed to update profile");
      
      const data = await response.json();

      const send = await fetch("/api/email/profileChanged", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newProfileData: data.profile,
          email: email
        }),
      });
      
      const result = await send.json();

      if (!result) {
        throw new Error("There was an error sending the email.");
      }
      
      if (result.success != true) {
        throw new Error(result.message);
      }

      setSuccess("Profile Successfully Updated!");
      setError("");
      setTimeout(() => {
        setIsEditing(false);
      }, 1000);
    } catch (error) {
      setSuccess("");
      setError("Error updating profile: ", error);
    }
  }

  // Toggle editing mode
  function toggleEdit() {
    setSuccess("");
    setError("");
    if (isEditing) {
      // If canceling, restore original values
      setProfile({...originalProfile});
    }
    setIsEditing(!isEditing);
  }

  const handleHome = () => {
    router.push("/home");
  };

  const handlePayment = () => {
    router.push("/editPayment");
  };

  const handlePassChange = () => {
    router.push("/changePassword");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-red-950 to-red-900 text-white">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg w-full text-center text-black">
          <p>Loading profile information...</p>
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
          <h2 className="text-4xl font-bold mb-4 text-gray-700 text-center">Profile Information</h2>
          
          {error && (
            <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Your existing form content */}
            {/* Display Mode */}
            {!isEditing && (
              <div className="space-y-4">
                {/* Your existing display mode fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">
                      {profile.firstName || "Not set"}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">
                      {profile.lastName || "Not set"}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block bg-grey-200 text-sm font-medium text-gray-700">Email (can't be changed) </label>
                  <p className="mt-1 block w-full p-2 border bg-gray-200 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">{email}</p>
                </div>

                <div>
                  <label htmlFor="password" className="block bg-grey-200 text-sm font-medium text-gray-700">Password (must verify)</label>
                  <div className="flex justify-between">
                    <p className="mt-1 block w-full p-2 border bg-gray-200 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">• • • • • • • • • •</p>
                    <button 
                    className="mt-1 ml-5 pl-5 pr-5 border bg-green-400 border-gray-300 rounded-md text-white"
                    type="button"
                    id="changePassword"
                    onClick={handlePassChange}
                    >
                    
                    Change</button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Birthday</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">
                    {profile.birthday.split("T")[0] || "Not set"}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">
                    {profile.streetNumber && profile.streetName 
                      ? `${profile.streetNumber} ${profile.streetName}, ${profile.city}, ${profile.state} ${profile.zipCode}` 
                      : "No address provided"}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Promotions</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">
                    {profile.promotions ? "Subscribed" : "Not subscribed"}
                  </div>
                </div>
              </div>
            )}
            
            {/* Edit Mode */}
            {isEditing && (
              <div className="space-y-4">

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
                {/* Your existing edit mode fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Birthday</label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={profile.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : ""}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="streetNumber" className="block text-sm font-medium text-gray-700">Street Number</label>
                    <input
                      type="text"
                      id="streetNumber"
                      name="streetNumber"
                      value={profile.streetNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="streetName" className="block text-sm font-medium text-gray-700">Street Name</label>
                    <input
                      type="text"
                      id="streetName"
                      name="streetName"
                      value={profile.streetName}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={profile.state}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={profile.zipCode}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="promotions"
                    name="promotions"
                    checked={profile.promotions}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="promotions" className="ml-2 block text-sm text-gray-700">
                    Receive email promotions
                  </label>
                </div>
              </div>
            )}
            
            {/* Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={toggleEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit Profile
                </button>              
              )}
            </div>
            
            {!isEditing && (
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handlePayment}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Edit Payment Information
                </button> 
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}