'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    billingAddress: "",
    password: "",
    paymentCards: [],
    promotions: false,
  });
  
  const [newPassword, setNewPassword] = useState("");
  const [cardInput, setCardInput] = useState("");
  const router = useRouter();

  // Fetch user data from the database when the component mounts
  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/userProfile"); 
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          billingAddress: data.billingAddress,
          paymentCards: data.paymentCards || [],
          promotions: data.promotions,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUserData();
  }, []);

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    // Restriction: Cannot store more than one address
    if (!userData.billingAddress) {
      alert("Billing address is required.");
      return;
    }

    // Restriction: Max 4 payment cards
    if (userData.paymentCards.length > 4) {
      alert("You can only store up to 4 payment cards.");
      return;
    }

    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          password: newPassword || undefined, // Update password only if changed
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      alert("Profile updated successfully!");
      router.push("/"); // Redirect to homepage
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
  }

  // Handle adding a payment card
  function handleAddCard() {
    if (userData.paymentCards.length >= 4) {
      alert("You can only store up to 4 payment cards.");
      return;
    }
    if (!cardInput.trim()) return;
    
    setUserData((prev) => ({
      ...prev,
      paymentCards: [...prev.paymentCards, cardInput],
    }));
    setCardInput("");
  }

  // Handle removing a payment card
  function handleRemoveCard(index) {
    setUserData((prev) => ({
      ...prev,
      paymentCards: prev.paymentCards.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-red-950 to-red-900 text-black">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg w-full">
        <h2 className="text-4xl font-bold mb-4 text-gray-700 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
            <label className="block text-gray-700">First Name</label>
            <input
                type="text"
                className="w-full p-2 border rounded"
                value={userData.firstName}
                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                required
            />
            </div>

            {/* Last Name */}
            <div>
            <label className="block text-gray-700">Last Name</label>
            <input
                type="text"
                className="w-full p-2 border rounded"
                value={userData.lastName}
                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                required
            />
            </div>

            {/* Email (Read-only) */}
            <div>
            <label className="block text-gray-700">Email (Cannot be changed)</label>
            <input type="email" className="w-full p-2 border rounded bg-gray-200" value={userData.email} disabled />
            </div>

            {/* Billing Address */}
            <div>
            <label className="block text-gray-700">Billing Address</label>
            <input
                type="text"
                className="w-full p-2 border rounded"
                value={userData.billingAddress}
                onChange={(e) => setUserData({ ...userData, billingAddress: e.target.value })}
                required
            />
            </div>

            {/* Password */}
            <div>
            <label className="block text-gray-700">New Password (Leave blank to keep current)</label>
            <input
                type="password"
                className="w-full p-2 border rounded"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            </div>

            {/* Payment Cards */}
            <div>
            <label className="block text-gray-700">Payment Cards (Max 4)</label>
            {userData.paymentCards.map((card, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded my-1">
                <span>{card}</span>
                <button
                    type="button"
                    onClick={() => handleRemoveCard(index)}
                    className="text-red-500 hover:text-red-700"
                >
                    Remove
                </button>
                </div>
            ))}
            {userData.paymentCards.length < 4 && (
                <div className="flex mt-2">
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter card number"
                    value={cardInput}
                    onChange={(e) => setCardInput(e.target.value)}
                />
                <button
                    type="button"
                    onClick={handleAddCard}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Add
                </button>
                </div>
            )}
            </div>

            {/* Promotions Checkbox */}
            <div className="flex items-center">
            <input
                type="checkbox"
                className="mr-2"
                checked={userData.promotions}
                onChange={() => setUserData({ ...userData, promotions: !userData.promotions })}
            />
            <label className="text-gray-700">Subscribe to promotions</label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600">
            Save Changes
            </button>
        </form>
        </div>
    </div>
  );
}