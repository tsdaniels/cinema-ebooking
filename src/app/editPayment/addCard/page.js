'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCard() {
  const [card, setCard] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    streetNumber: "",
    streetName: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [address, setAddress] = useState({
    streetNumber: "",
    streetName: "",
    city: "",
    state: "",
    zipCode: "",
  })
  
  const [isLoading, setIsLoading] = useState(true);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [error, setError] = useState(null);
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
        if (!email) return; // Don't fetch if no email yet
        async function fetchUserAddress() {
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

              console.log(data.profile);
              
              // Update state with profile data
              if (data.profile) {
                setAddress({
                  streetNumber: data.profile.streetNumber || "",
                  streetName: data.profile.streetName || "",
                  city: data.profile.city || "",
                  state: data.profile.state || "",
                  zipCode: data.profile.zipCode || "",
                });
              }
              
              setError(null);
            } catch (error) {
              console.error("Error fetching user data:", error);
              setError("Failed to load address data. Please try again later.");
            } finally {
              setIsLoading(false);
            }
          }
          
          fetchUserAddress();
  }, [email]);

  // Handle input changes when editing
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCard(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      // Create payload with all required data
      let payload = { ...card };
      
      // If using saved address, add address fields to payload
      if (useSavedAddress && address && address.streetName && 
          address.streetNumber && address.city &&
          address.state && address.zipCode) {
        
        payload = {
          ...payload,
          streetName: address.streetName,
          streetNumber: address.streetNumber,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode
        };
      }
      
      const response = await fetch("/api/addCard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...payload }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to add Card.");
      }
      
      console.log("Update successful:", data);
      alert("Card added successfully!");
      router.push('/editPayment');
    } catch (error) {
      alert(error.message);
    }
  }

  const handleHome = () => {
    router.push("/home");
  };

  const handleCards= () => {
    router.push("/editPayment");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-red-950 to-red-900 text-white">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg w-full text-center text-black">
          <p>Loading payment information...</p>
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
        <h2 className="text-4xl font-bold mb-4 text-gray-700 text-center">Payment Information</h2>
        
        {error && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">          
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={card.firstName}
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
                    value={card.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-3/4">
                    <label htmlFor="Card Number" className="text-sm font-medium text-gray-700">Card Number</label>
                    <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={card.cardNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="w-1/4">
                    <label htmlFor="Cvv" className="text-sm font-medium text-gray-700">cvv</label>
                    <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={card.cvv}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                </div>

              <div>
                  <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">Expiration Date</label>
                  <input
                    type="date"
                    id="expirationDate"
                    name="expirationDate"
                    value={card.expirationDate}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
        {/* Display Mode */}
        {useSavedAddress && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">
                  {address.streetNumber && address.streetName 
                    ? `${address.streetNumber} ${address.streetName}, ${address.city}, ${address.state} ${address.zipCode}` 
                    : "No address provided"}
                </div>
              </div>
              
            </div>
          )}
          
          {/* Edit Mode */}
          {!useSavedAddress && (
            <div className="space-y-4">
              
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="streetNumber" className="block text-sm font-medium text-gray-700">Street Number</label>
                  <input
                    type="text"
                    id="streetNumber"
                    name="streetNumber"
                    value={card.streetNumber}
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
                    value={card.streetName}
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
                    value={card.city}
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
                    value={card.state}
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
                    value={card.zipCode}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
 
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sameAsAddress"
                  name="sameAsAddress"
                  checked={useSavedAddress}
                  onChange={() => setUseSavedAddress(!useSavedAddress)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="promotions" className="ml-2 block text-sm text-gray-700">
                  Use Saved Address
                </label>
              </div>
            </div>
          
          {/* Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Submit Card
                </button> 
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <button
                  type="button"
                  onClick={handleCards}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Back to Cards
                </button> 
          </div>
        </form>
      </div>
    </div>
  );
}