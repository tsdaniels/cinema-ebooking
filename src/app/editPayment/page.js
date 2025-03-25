'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPayment() {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const router = useRouter();

  // Get the user's email by checking auth in a useEffect
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

  // Fetch cards data from the database when the component mounts
  useEffect(() => {
    async function fetchCards() {
      if (!email) return;

      try {
        setIsLoading(true);
        const response = await fetch("/api/cards/getCards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        
        if (!response.ok) throw new Error("Failed to fetch cards");
        
        const data = await response.json();
        setCards(data.cards || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching cards:", error);
        setError("Failed to load payment cards. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCards();
  }, [email]);

  async function deleteCard(cardId) {
    if (!confirm("Are you sure you want to delete this card?")) return;
    
    try {
      const response = await fetch("/api/cards/deleteCard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cardId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete card");
      }
      
      // Remove deleted card from state
      setCards(cards.filter(card => card._id !== cardId));
      alert("Card deleted successfully");
    } catch (error) {
      console.error("Error deleting card:", error);
      alert(error.message);
    }
  }

  const handleHome = () => {
    router.push("/home");
  };

  const handleProfile = () => {
    router.push("/editProfile");
  };

  const handleAddNew = () => {
    router.push("/editPayment/addCard");
  };

  const editCard = (id) => {
    router.push(`/editPayment/${id}`);
  }

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
      <div className="flex justify-between items-center z-50 fixed top-0 bg-red-900 w-full h-[95px]">
        <div className="text-white text-4xl ml-4 font-semibold">Cinebook🍿</div>
        <button
          type="button"
          onClick={handleHome}
          className="mr-5 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Back to Home
        </button>   
      </div>
      <div className="max-w-2xl mt-20 p-6 bg-white shadow-md rounded-lg w-full">
        <h2 className="text-4xl font-bold mb-4 text-gray-700 text-center">Payment Cards</h2>
        
        {error && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          {cards.length === 0 ? (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              No payment cards found. Add a new card to get started.
            </div>
          ) : (
            cards.map((card, index) => (
              <div key={index}>
                <div className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow relative">
                  <div className="flex justify-between">
                    <div className="font-bold">{card.firstName} {card.lastName}</div>
                    <div className="text-gray-500">
                      **** **** **** {card.cardNumber.slice(-4)}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Expires: {new Date(card.expirationDate).toLocaleDateString()}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {card.streetNumber} {card.streetName}, {card.city}, {card.state} {card.zipCode}
                  </div>
                </div>
                <div className="flex justify-between">
                <button
                  onClick={() => editCard(card._id)}
                  className=" text-green-500 hover:text-green-700 bg-white rounded px-2 py-1 text-sm font-bold"
                  title="Edit Card"
                >
                  edit
                </button>
                <button
                  onClick={() => deleteCard(card._id)}
                  className=" text-red-500 hover:text-red-700 bg-white rounded px-2 py-1 text-sm font-bold"
                  title="Delete card"
                >
                  delete
                </button>
                </div>
              </div>
              
            ))
          )}
          <p className="text-sm text-gray-600 text-right">total: {cards.length}/4</p>
          
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="button"
              onClick={handleAddNew}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add New Card
            </button>              
          </div>

          <div className="flex justify-center space-x-4 mt-2">
            <button
              type="button"
              onClick={handleProfile}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Profile
            </button> 
          </div>
        </div>
      </div>
    </div>
  );
}