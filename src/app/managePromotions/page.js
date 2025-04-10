'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaTrash, FaMoneyBill, FaPen, FaTimes } from "react-icons/fa";

export default function ManagePromotions() {
    const router = useRouter();
    const [promotions, setPromotions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPromotion, setNewPromotion] = useState({ code: '', expDate: '', percentage: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPromotions() {
            try {
                const res = await fetch('/api/fetchPromotions');
                const data = await res.json();
                console.log("Promotions data:", data)
                if (data.success) {
                    setPromotions(data.promotions || []);
                } else {
                    console.error("Failed to fetch promotion codes");
                }
            } catch (error) {
                console.error("Error fetching promotions: ", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPromotions();
    }, []);

    const handleChange = (e) => {
        setNewPromotion({ ...newPromotion, [e.target.name]: e.target.value });
    };

    const handleAddPromotion = async () => {
        try {
            const res = await fetch('/api/addPromotion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPromotion),
            });

            const data = await res.json();
            if (data.success) {
                setPromotions([...promotions, data.promotion]);
                setShowModal(false);
                setNewPromotion({ code: '', expDate: '',});
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Error adding promotion:", error);
        }
    };

    const handleDeletePromotion = async (id) => {
        try {
            const res = await fetch(`/api/deletePromotion`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if(data.success) {
                setPromotions(promotions.filter(promotion => promotion._id !== id));
            } else {
                console.error("Error deleting promotion:", data.message);
            }
        } catch (error) {
            console.error("Error deleting promotion:", error);
        }
    };
    
    if (loading) {
        return (
            <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-red-950 to-red-900 overflow-hidden">
                <h1 className="flex justify-center font-sans text-3xl text-white mt-3 pt-3 font-bold">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-red-950 to-red-900 overflow-hidden">
            <h1 className="flex justify-center font-sans text-3xl text-white mt-3 pt-3 font-bold">Manage Promotions</h1>
            
            <div className="flex flex-col bg-black bg-opacity-35 backdrop-blur-lg font-bold font-sans min-h-1/2 rounded-lg m-6 ml-16 mr-16 border-black p-6">
                <div className="flex justify-end mb-4">
                    <button 
                        className="flex items-center bg-red-700 border-black px-6 py-2 text-lg rounded-lg"
                        onClick={() => setShowModal(true)}
                    >
                        <FaMoneyBill className="mr-2" /> Add Promotion
                    </button>
                </div>
                
                <table className="w-full text-white text-lg border-collapse border border-gray-600">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="border border-gray-600 p-3">Promo Code</th>
                            <th className="border border-gray-600 p-3">ExpDate</th>
                            <th className="border border-gray-600 p-3">Percentage</th>
                            <th className="border border-gray-600 p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.length >= 0 ? (
                            promotions.map(promotion => (
                                <tr key={promotion._id} className="text-center bg-gray-700 odd:bg-gray-800">
                                    <td className="border border-gray-600 p-3">
                                        {promotion.code}
                                    </td>
                                    <td className="border border-gray-600 p-3">{new Date(promotion.expDate).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric',})}</td>
                                    <td className="border border-gray-600 p-3">{promotion.percentage}%</td>
                                    <td className="border border-gray-600 p-3 flex justify-center space-x-4">
                                        <button className="text-yellow-500 hover:text-red-400 transition p-2 rounded-lg">
                                            <FaPen size={20} />
                                        </button>
                                        <button onClick={() => handleDeletePromotion(promotion._id)} className="text-red-500 hover:text-red-400 transition p-2 rounded-lg">
                                            <FaTrash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-4 text-gray-400">No promotions found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Add New Promotion</h2>
                                <button onClick={() => setShowModal(false)} className="text-red-500">
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            <input type="text" name="code" value={newPromotion.code} onChange={handleChange} placeholder="Promotion Code" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded"/>
                            <input type="date" name="expDate" value={newPromotion.expDate} onChange={handleChange} placeholder="Expiration Date" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded"/>
                            <input type="number" name="percentage" value={newPromotion.percentage} onChange={handleChange} placeholder="Percentage" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded"/>
                            <button onClick={handleAddPromotion} className="w-full bg-red-700 p-2 rounded-lg font-bold">
                                Add Promotion
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-4">
                    <button 
                        onClick={() => router.push('/adminPortal')}
                        className="flex items-center bg-red-700 border-black px-6 py-2 text-lg rounded-lg mr-2">
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}