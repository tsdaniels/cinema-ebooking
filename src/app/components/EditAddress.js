"use client"
import React, { useState, useEffect } from "react";
import { useForm } from 'react';
import { CreditCard, Home, User, Lock, Bell, Save, Plus, Trash } from 'lucide-react';

const EditAddress = () => {
    return(
        <div className="flex flex-col">
            <h2 className="text-center text-xl font-semibold mb-4 text-red-400">Billing Address</h2>
            <label className="text-center mb-4">You can have one billing address associated with your account</label>
            <input
            type="text"
            name="address"
            id="address"
            placeholder="default addy goes here"
            className="p-4 text-gray-400 mb-4 bg-gray-700 rounded h-[40] w-[500px]" 
            >
            </input>
            <button className="flex mb-4 items-center justify-center p-2 rounded-lg w-full bg-red-700">
                <Save className="mr-2" size={16} />
                <span>Save Changes</span>
            </button>
        </div>
    );
}

export default EditAddress;