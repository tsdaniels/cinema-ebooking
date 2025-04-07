'use client';
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditCard() {
    const params = useParams();
    const token = params.token;
    const [email, setEmail] = useState("");
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

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const router = useRouter();

    // Get the user's email by checking auth
    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch('/api/checkAuth');
                const data = await response.json();
                
                if (data.isLoggedIn) {
                    setEmail(data.email);
                } else {
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

    // Fetch card data
    useEffect(() => {
        async function fetchCard() {
            if (!token) return;
            
            try {
                setIsLoading(true);
                const response = await fetch("/api/cards/getCard", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: token }),
                });
                
                if (!response.ok) throw new Error("Failed to fetch card");
                
                const data = await response.json();
                if (data && data.card) {
                    setCard(data.card);
                }
                
                setError("");
            } catch (error) {
                setError("Failed to load Card data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchCard();
    }, [token]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Special handling for expiration date
        if (name === 'expirationDate') {
          // Remove any non-digit characters
          let input = value.replace(/\D/g, '');
          
          // Format as MM/YY
          if (input.length > 2) {
            input = input.substring(0, 2) + '/' + input.substring(2, 4);
          }
          
          setCard(prev => ({
            ...prev,
            expirationDate: input
          }));
        } else {
          // Handle all other fields normally
          setCard(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
          }));
        }
      };

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            
            // Validation Checks
            if (card.cardNumber.length < 13 || card.cardNumber.length > 19) {
                throw new Error("Card length must be between 13 and 19 digits.");
            }

            if (card.cvv.length < 3 || card.cvv.length > 4) {
                throw new Error("CVV length must be between 3 and 4 digits.");
            }

            if (!(/^[0-9]*$/.test(card.cardNumber)) || !((/^[0-9]*$/.test(card.cvv)))) {
                throw new Error("Card number and CVV must only contain numbers.");
            }

            if (card.expirationDate) {
                const [month, year] = card.expirationDate.split('/');
                const fullYear = year.length === 2 ? '20' + year : year;
                
                // Create expiry date (last day of month)
                const expiryDate = new Date(parseInt(fullYear), parseInt(month), 0, 23, 59, 59, 999);
                
                const now = new Date();
                const futureDate = new Date();
                futureDate.setFullYear(now.getFullYear() + 11);
        
                
                if (expiryDate <= now) {
                throw new Error("Card is expired.");
                }
        
                if (expiryDate >= futureDate) {
                throw new Error("Expiration Date must be within 10 years.");
                }
            }
            
            const response = await fetch("/api/cards/updateCard", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...card, token }),
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update card");
            }
            
            setError("");
            setSuccess("Card updated successfully! Redirecting... ");
            setTimeout(() => {
                router.push("/editPayment");
            }, 2000);
        } catch (error) {
            setError(error.message);
            setSuccess("");
        }
    }

    const handleHome = () => {
        router.push("/home");
    };

    const handleCards = () => {
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
                    <h2 className="text-4xl font-bold mb-4 text-gray-700 text-center">Edit Payment Information</h2>
                    
                    {success && (
                        <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
                            {success}
                        </div>
                    )}
                    
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
                                        value={card.firstName || ""}
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
                                        value={card.lastName || ""}
                                        onChange={handleChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-4/4">
                                    <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">Card Number</label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        name="cardNumber"
                                        value={card.cardNumber || ""}
                                        onChange={handleChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="w-1/5">
                                    <label htmlFor="cvv" className="text-sm font-medium text-gray-700">CVV</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        name="cvv"
                                        value={card.cvv || ""}
                                        onChange={handleChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="w-1/4">
                                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">Expiration Date (MM/YY)</label>
                                <input
                                type="text"
                                id="expirationDate"
                                name="expirationDate"
                                value={card.expirationDate}
                                onChange={handleChange}
                                maxLength="5"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                    
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-700">Billing Address</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="streetNumber" className="block text-sm font-medium text-gray-700">Street Number</label>
                                        <input
                                            type="text"
                                            id="streetNumber"
                                            name="streetNumber"
                                            value={card.streetNumber || ""}
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
                                            value={card.streetName || ""}
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
                                            value={card.city || ""}
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
                                            value={card.state || ""}
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
                                            value={card.zipCode || ""}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                        {/* Buttons */}
                        <div className="flex justify-center space-x-4 mt-6">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Update Card
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
            </main>
        </div>
    );
}