'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaUserEdit, FaUserMinus, FaUserPlus, FaTimes } from "react-icons/fa";

export default function ManageUsers() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', role: 'User', status: 'active' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch('/api/getUsers');
                const data = await res.json();
                if (data.success) {
                    setUsers(data.users);
                } else {
                    console.error("Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users: ", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = async () => {
        try {
            console.log(newUser);
            const res = await fetch('/api/addUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            const data = await res.json();
            if (data.success) {
                setUsers([...users, data.user]);
                setShowModal(false);
                setNewUser({ firstName: '', lastName: '', email: '', role: 'User', status: 'active' });
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const res = await fetch(`/api/deleteUser`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if(data.success) {
                setUsers(users.filter(user => user._id !== id));
            } else {
                console.error("Error deleting user:", data.message);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
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
            <h1 className="flex justify-center font-sans text-3xl text-white mt-3 pt-3 font-bold">Manage Users</h1>
            
            <div className="flex flex-col bg-black bg-opacity-35 backdrop-blur-lg font-bold font-sans min-h-1/2 rounded-lg m-6 ml-16 mr-16 border-black p-6">
                <div className="flex justify-end mb-4">
                    <button 
                        className="flex items-center bg-red-700 border-black px-6 py-2 text-lg rounded-lg"
                        onClick={() => setShowModal(true)}
                    >
                        <FaUserPlus className="mr-2" /> Add User
                    </button>
                </div>
                
                <table className="w-full text-white text-lg border-collapse border border-gray-600">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="border border-gray-600 p-3">Name</th>
                            <th className="border border-gray-600 p-3">Email</th>
                            <th className="border border-gray-600 p-3">Role</th>
                            <th className="border border-gray-600 p-3">Status</th>
                            <th className="border border-gray-600 p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user._id} className="text-center bg-gray-700 odd:bg-gray-800">
                                    <td className="border border-gray-600 p-3">
                                        {user.firstName || "N/A"} {user.lastName || ""}
                                    </td>
                                    <td className="border border-gray-600 p-3">{user.email}</td>
                                    <td className="border border-gray-600 p-3">{user.role || "User"}</td>
                                    <td className="border border-gray-600 p-3">
                                        <button className='text-green-500'>
                                            {user.status === "active" ? "Suspend" : "Activate"}
                                        </button>
                                    </td>
                                    <td className='border border-gray-600 p-3 flex justify-center space-x-4'>
                                        <button className="text-yellow-400 hover:text-yellow-300 transition">
                                            <FaUserEdit size={20} />
                                        </button>
                                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400 transition">
                                            <FaUserMinus size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-4 text-gray-400">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Add New User</h2>
                                <button onClick={() => setShowModal(false)} className="text-red-500">
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            
                            <input type="text" name="firstName" value={newUser.firstName} onChange={handleChange} placeholder="First Name" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded"/>
                            <input type="text" name="lastName" value={newUser.lastName} onChange={handleChange} placeholder="Last Name" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded"/>
                            <input type="email" name="email" value={newUser.email} onChange={handleChange} placeholder="Email" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded"/>
                            <input type="email" name="password" value={newUser.password} onChange={handleChange} placeholder="Password" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded"/>
                            <select name="role" value={newUser.role} onChange={handleChange} className="w-full p-2 mb-4 bg-gray-800 border border-gray-600 rounded">
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>

                            <button onClick={handleAddUser} className="w-full bg-red-700 p-2 rounded-lg font-bold">
                                Add User
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
