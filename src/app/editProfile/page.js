"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from 'react';
import { CreditCard, Home, User, Lock, Bell, Save, Plus, Trash } from 'lucide-react';
import EditAddress from '../components/EditAddress';
import EditPaymentMethods from '../components/EditPaymentMethods';
import EditProfileComponent from '../components/EditProfileComponent';

export default function editProfile() {

const [activeTab, setActiveTab] = useState('profile');
const [message, setMessage] = useState({ type: '', text: '' });
const [isAddingCard, setIsAddingCard] = useState(false);
const [newCard, setNewCard] = useState({ cardNumber: '', expiryDate: '', cardHolder: '', cvv: '' });

  
return (
  <div className="min-h-screen bg-gray-900 text-gray-100">
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-red-500">Edit Your Profile</h1>
      
      {/* Notification message */}
      {message.text && (
        <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-800' : 'bg-red-800'}`}>
          {message.text}
        </div>
      )}
      
      {/* Navigation tabs */}
      <div className="flex mb-6 border-b border-gray-800">
        <button 
          className={`py-2 px-4 mr-2 ${activeTab === 'profile' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User className="inline mr-2" size={16} />
          Profile
        </button>
        <button 
          className={`py-2 px-4 mr-2 ${activeTab === 'address' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('address')}
        >
          <Home className="inline mr-2" size={16} />
          Address
        </button>
        <button 
          className={`py-2 px-4 mr-2 ${activeTab === 'payment' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('payment')}
        >
          <CreditCard className="inline mr-2" size={16} />
          Payment Methods
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'password' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('password')}
        >
          <Lock className="inline mr-2" size={16} />
          Password
        </button>
      </div>
      </div>
      <form className='bg-gray-800 p-6 rounded-lg shadow-lg'>
        {activeTab === 'profile' && <EditProfileComponent/> }
        {activeTab === 'address' && <EditAddress/> }
        {activeTab === 'payment' && <EditPaymentMethods/> }

      </form>
      </div>
      );
 }
 
