"use client"
import React, { useState, useEffect } from "react";
import { useForm } from 'react';
import { CreditCard, Home, User, Lock, Bell, Save, Plus, Trash } from 'lucide-react';

const EditProfileComponent = () => {
    

    return(

                        <div>
                            <h2 className="text-center text-xl font-semibold mb-4 text-red-400">Personal Information</h2>
                            <div className="gap-4 mb-6">
                                <div>
                                    <label className="block text-sm text-white font-bold mb-1">First Name</label>
                                    <input
                                    className="mb-4 w-full rounded p-2 bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500;" 
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    >
                                    </input>
                                    <div>
                                    <label className="block text-sm text-white font-bold mb-1">Last Name</label>
                                    <input
                                    className="mb-4 w-full rounded p-2 bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500;" 
                                    type="text"
                                    name="last_name"
                                    id="last_name"
                                    >
                                    </input>
                                    </div>
                                    <div className="mb-4">
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
                                        <label className="mb-4 flex items-center gap-x-0">
                                        <input
                                            name="promotional_offers"
                                            className="mr-2 h-[15] w-[15] mb-1 text-gray-400 rounded p-2 bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500;" 
                                            type="checkbox"
                                        >
                                        </input>
                                        <Bell className="mr-2" size={16}/>
                                        <span>Recieve promotional emails and offers</span>
                                        </label>
                                    
                                   
                                    </div>
                                    <div>
                                        <button className="flex justify-center items-center w-full h-[40] bg-red-500 rounded">
                                            <Save className="mr-2" size={16}/>
                                            <span>Save changes</span>
                                        </button>

                                    </div>
                                </div>
                            </div>

                        </div>
                

            
            

            
        
    )
}

export default EditProfileComponent;

