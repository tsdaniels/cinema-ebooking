"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/resetPassword/${token}`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword }),
        });        
        
        const data = await res.json();
        setMessage(data.message || data.error);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
            <h2 className="text-lg font-bold">Reset Password</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="mt-2 w-full bg-green-500 text-white p-2 rounded">
                    Reset Password
                </button>
            </form>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
}