'use client';

import { useRouter } from 'next/navigation';
import { FaMoneyBill1 } from "react-icons/fa6";
import { MdMovieCreation } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

export default function AdminPortal() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("authToken"); 
    
        router.push("/adminLogin"); 
    };

    return(
        <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-red-950 to-red-900 overflow-hidden">
            <button 
                onClick={handleLogout}
                className="absolute font-sans top-4 right-4 bg-red-500 text-white p-2 text-2xl rounded-lg shadow-lg hover:bg-red-600 transition-all duration-300">
                Logout
            </button>
            
            <h1 className='flex justify-center font-sans text-3xl text-white mt-3 pt-3 font-bold'>Admin Portal</h1>
            <div className="flex flex-row bg-black bg-opacity-35 backdrop-blur-lg font-bold font-sans min-h-1/2 rounded-lg m-6 ml-16 mr-16 border-black">

                <button 
                    onClick={() => router.push('/manageUsers')}
                    className="flex flex-col bg-gradient-to-b from-teal-400 to-teal-200 border-2 border-black p-16 w-1/3 inline-block m-12 mt-20 mb-20 text-2xl text-center rounded-lg 
                        hover:from-teal-500 hover:to-teal-300 hover:scale-105 hover:shadow-lg transition-all duration-300">
                    <p>Manage Users </p>
                    <i className="mx-auto mt-5"><FaUsers size={70}/></i>
                </button>
                <button 
                    onClick={() => router.push('/manageMovies')}
                    className="flex flex-col border-2 bg-gradient-to-b from-yellow-400 to-yellow-200 border-2 border-black p-16 w-1/3 inline-block m-12 mt-20 mb-20 text-2xl text-center rounded-lg
                        hover:from-yellow-500 hover:to-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-300">
                    <p>Manage Movies</p>
                    <i className="mx-auto mt-5"><MdMovieCreation size={70}/></i>
                </button>
                <button 
                    onClick={() => router.push('/managePromotions')}
                    className="flex flex-col border-2 bg-gradient-to-b from-orange-400 to-orange-200 border-black p-16 w-1/3 m-12 mt-20 mb-20 text-2xl text-center rounded-lg
                        hover:from-orange-500 hover:to-orange-300 hover:scale-105 hover:shadow-lg transition-all duration-300">
                    <p>Manage Promotions</p>
                    <i className="mx-auto mt-5"><FaMoneyBill1 size={70}/></i>
                </button>

                </div>
        </div>                
    )
}