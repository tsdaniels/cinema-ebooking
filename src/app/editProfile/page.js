"use client"
import React, { useState, useEffect } from "react";
import { useForm } from 'react';
import { CreditCard, Home, User, Lock, Bell, Save, Plus, Trash } from 'lucide-react';
import EditProfileComponent from '../components/EditProfileComponent';
import EditAddress from "../components/EditAddress";
import EditPaymentMethods from "../components/EditPaymentMethods";

const EditUserProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100">
        <div className="container w-full max-w-3xl mx-auto p-4">
            <h1 className="text-center mt-4 text-3xl ml-4 font-bold mb-8 text-red-500">Edit Your Profile</h1>
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
            
        </div>
        <div>
        <form className="flex p-6 w-[700] rounded-lg shadow-lg bg-gray-800 justify-center">
            { activeTab === 'profile' && <EditProfileComponent/> }
            { activeTab === 'address' && <EditAddress/> }
            { activeTab === 'payment-methods' && <EditPaymentMethods/> }

            </form>
        </div>
           
            
        
       </div>

    )
    }
export default EditUserProfile;
