"use client"
import React, { useState, useEffect } from "react";
import { useForm } from 'react';
import { CreditCard, Home, User, Lock, Bell, Save, Plus, Trash } from 'lucide-react';

const EditPaymentMethods = () => {
    return(
        <div className="flex flex-col">
            <h2 className="mb-6 text-xl font-semibold text-red-400">Payment Methods</h2>
            <span className="mb-4 text-gray-400">You can save up to 4 payment methods</span>
            <button className="bg-gray-600 w-[150] p-2 rounded flex flex-row items-center">
                <Plus className="mr-2" size={16}/>
                <span>Add new card</span>
            </button>
        </div>
    )
}

export default EditPaymentMethods;