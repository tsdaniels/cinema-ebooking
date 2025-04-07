'use client';

import { useRouter } from 'next/navigation';
import { FaMoneyBill1 } from "react-icons/fa6";
import { MdMovieCreation } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

export default function AdminPortal() {
    const router = useRouter();

    return(
<<<<<<< HEAD
        <div className="flex-col bg-gradient-to-b from-red-500 to-black font-bold text-center h-screen p-6 gap-6 pt-6">
            <h1 className='font-sans text-3xl text-white'>Admin Portal</h1>
            <div className="flex flex-row bg-gradient-to-b border-white border-2 from-gray-400 to-white font-bold font-sans min-h-[450px] rounded-lg m-6 ml-16 mr-16 border-black">
                <button 
                    onClick={() => router.push('/')}
                    className="flex flex-col bg-teal-200 border-2 border-black p-16 w-64 inline-block m-12 mt-20 mb-20 ml-36 text-2xl text-center rounded-lg">
=======
        <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-red-950 to-red-900 overflow-hidden">
            <h1 className='flex justify-center font-sans text-3xl text-white mt-3 pt-3 font-bold'>Admin Portal</h1>
            <div className="flex flex-row bg-black bg-opacity-35 backdrop-blur-lg font-bold font-sans min-h-1/2 rounded-lg m-6 ml-16 mr-16 border-black">

                <button 
                    onClick={() => router.push('/manageUsers')}
                    className="flex flex-col bg-gradient-to-b from-teal-400 to-teal-200 border-2 border-black p-16 w-1/3 inline-block m-12 mt-20 mb-20 text-2xl text-center rounded-lg 
                        hover:from-teal-500 hover:to-teal-300 hover:scale-105 hover:shadow-lg transition-all duration-300">
>>>>>>> main
                    <p>Manage Users </p>
                    <i className="ml-7 mt-5"><FaUsers size={70}/></i>
                </button>
                <button 
                    onClick={() => router.push('/')}
<<<<<<< HEAD
                    className="flex flex-col border-2 border-black bg-yellow-100 p-16 w-64 inline-block m-12 mt-20 mb-20 text-2xl text-center rounded-lg">
=======
                    className="flex flex-col border-2 bg-gradient-to-b from-yellow-400 to-yellow-200 border-2 border-black p-16 w-1/3 inline-block m-12 mt-20 mb-20 text-2xl text-center rounded-lg
                        hover:from-yellow-500 hover:to-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-300">
>>>>>>> main
                    <p>Manage Movies</p>
                    <i className="ml-7 mt-5"><MdMovieCreation size={70}/></i>
                </button>
                <button 
                    onClick={() => router.push('/')}
<<<<<<< HEAD
                    className="flex flex-col border-2 border-black bg-orange-200 p-16 w-64 m-12 mt-20 mb-20 text-2xl text-center rounded-lg">
=======
                    className="flex flex-col border-2 bg-gradient-to-b from-orange-400 to-orange-200 border-black p-16 w-1/3 m-12 mt-20 mb-20 text-2xl text-center rounded-lg
                        hover:from-orange-500 hover:to-orange-300 hover:scale-105 hover:shadow-lg transition-all duration-300">
>>>>>>> main
                    <p>Manage Promotions</p>
                    <i className="ml-7 mt-5"><FaMoneyBill1 size={70}/></i>
                </button>

                </div>
        </div>
    )
}