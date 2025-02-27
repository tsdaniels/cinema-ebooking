'use client';

import { useRouter } from 'next/navigation';
import { FaMoneyBill1 } from "react-icons/fa6";
import { MdMovieCreation } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

export default function AdminPortal() {
    const router = useRouter();

    return(
        <div className="flex-col bg-gradient-to-b from-red-500 to-black font-bold text-center h-screen p-6 gap-6 pt-6">
            <h1 className='font-sans text-3xl text-white'>Admin Portal</h1>
            <div className="flex flex-row bg-gradient-to-b border-white border-2 from-gray-400 to-white font-bold font-sans min-h-[450px] rounded-lg m-6 ml-16 mr-16 border-black">
                <button 
                    onClick={() => router.push('/')}
                    className="flex flex-col bg-teal-200 border-2 border-black p-16 w-64 inline-block m-12 mt-20 mb-20 ml-36 text-2xl text-center rounded-lg">
                    <p>Manage Users </p>
                    <i className="ml-7 mt-5"><FaUsers size={70}/></i>
                </button>
                <button 
                    onClick={() => router.push('/')}
                    className="flex flex-col border-2 border-black bg-yellow-100 p-16 w-64 inline-block m-12 mt-20 mb-20 text-2xl text-center rounded-lg">
                    <p>Manage Movies</p>
                    <i className="ml-7 mt-5"><MdMovieCreation size={70}/></i>
                </button>
                <button 
                    onClick={() => router.push('/')}
                    className="flex flex-col border-2 border-black bg-orange-200 p-16 w-64 m-12 mt-20 mb-20 text-2xl text-center rounded-lg">
                    <p>Manage Promotions</p>
                    <i className="ml-7 mt-5"><FaMoneyBill1 size={70}/></i>
                </button>

                </div>
        </div>
                
    )
}