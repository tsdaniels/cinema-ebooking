"use client"
import React, { useState, useEffect } from "react";
import { useForm } from 'react';
import { CreditCard, Home, User, Lock, Bell, Save, Plus, Trash } from 'lucide-react';

const EditUserProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return(
        <div className="flex justfy-center min-h-screen bg-gray-900 text-gray-100">
            <div className="container w-full max-w-3xl mx-auto p-4">
                <h1 className="text-3xl ml-4 font-bold mb-8 text-red-500">Edit Your Profile</h1>
                <div className="flex justify-center mb-6 border-b border-gray-800">
                    <button className={`py-2 px-4 mr-2 ${activeTab === 'profile' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('profile')}>
                        <User className="inline mr-2" size={16} />
                        Profile
                    </button>
                    <button className={`py-2 px-4 mr-2 ${activeTab === 'address' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('address')}>
                        <Home className="inline mr-2" size={16} />
                        Address
                    </button>
                    <button className={`py-2 px-4 mr-2 ${activeTab === 'payment-methods' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('payment-methods')}>
                        <CreditCard className="inline mr-2" size={16} />
                        Payment Methods
                    </button>
                    <button className={`py-2 px-4 mr-2 ${activeTab === 'passwords' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('passwords')}>
                        <Lock className="inline mr-2" size={16} />
                        Passwords
                    </button>
                </div>
                <form className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded-lg shadow-lg">
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-red-400">Personal Information</h2>
                            <div className="gap-4 mb-6">
                                <div>
                                    <label className="block text-sm text-white font-bold mb-1">First Name</label>
                                    <input
                                    className="mb-4 w-full rounded p-2 bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500;" 
                                    type="text"
                                    >
                                    </input>
                                    <div>
                                    <label className="block text-sm text-white font-bold mb-1">Last Name</label>
                                    <input
                                    className="mb-4 w-full rounded p-2 bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500;" 
                                    type="text"
                                    >
                                    </input>
                                    </div>
                                    <div>
                                    <label className="block text-sm text-white font-bold mb-1">Email Address (Cannot be changed) </label>
                                    <input
                                    className="mb-1 w-full text-gray-400 rounded p-2 bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500;" 
                                    type="email"
                                    disabled
                                    value="example@email.com"
                                    >
                                    
                                    </input>
                                    <p className="text-xs text-gray-400">Contact support to change email</p>
                                    </div>
                                    <div>
                                    <label className="block text-sm text-white font-bold mb-1">Email Address (Cannot be changed) </label>
                                    <input
                                    className="mb-1 w-full text-gray-400 rounded p-2 bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500;" 
                                    type="checkbox"
                                   
                                    >
                                    
                                    </input>
                                   
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                </form>
            </div>

            
        </div>
    )
}

export default EditUserProfile;

