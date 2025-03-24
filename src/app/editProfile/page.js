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
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const router = useRouter();


  //const email = "natesasapan@gmail.com";

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
        }
        
        setError(null);
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
      console.log("Update successful:", data);
      
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  }

  // Toggle editing mode
  function toggleEdit() {
    setIsEditing(!isEditing);
  }

  const handleHome = () => {
    router.push("/home");
  };

  const handlePayment = () => {
    router.push("/editPayment");
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-red-950 to-red-900 text-black py-8">
      <div className= "flex justify-between items-center z-50 fixed top-0 bg-red-900 w-full h-[95px]">
      <div className="text-white text-4xl ml-4 font-semibold">Cinebook🍿</div>
        <button
          type="button"
          onClick={handleHome}
          className="mr-5 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Back to Home
        </button>   
      </div>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg w-full">
        <h2 className="text-4xl font-bold mb-4 text-gray-700 text-center">Profile Information</h2>
        
        {error && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Mode */}
          {!isEditing && (
            <div className="space-y-4">
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
                  value={profile.birthday}
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
          )};

        </form>
      </div>
    </div>
  );
}