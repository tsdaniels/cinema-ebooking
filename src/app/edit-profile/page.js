'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function EditProfile() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '',
    profilePicture: '/default-avatar.png', // Default profile image
  });

  const [imagePreview, setImagePreview] = useState(profile.profilePicture);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="bg-[#121212] p-8 rounded-lg shadow-lg w-full max-w-md border border-red-600 relative">
        <h2 className="text-2xl font-semibold text-center mb-6 text-white glow-red">
          Edit Profile
        </h2>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 border border-red-500 rounded-md overflow-hidden shadow-red">
            <Image
              src={imagePreview}
              alt="Profile"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <label className="mt-3 cursor-pointer text-red-400 hover:text-red-300 glow-red">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* User Info Fields */}
        <div className="mb-4">
          <label className="block text-white text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-3 text-lg border border-red-500 rounded-md bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-500 shadow-input"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full p-3 text-lg border border-red-500 rounded-md bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-500 shadow-input"
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm mb-1">New Password</label>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            className="w-full p-3 text-lg border border-red-500 rounded-md bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-500 shadow-input"
            placeholder="Enter new password"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md border border-red-500 shadow-button">
            Save Changes
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md border border-gray-600">
            Cancel
          </button>
        </div>
      </div>

      {/* Custom Glow Effects */}
      <style jsx>{`
        .glow-red {
          text-shadow: 0 0 8px rgba(255, 50, 50, 0.8);
        }
        .shadow-red {
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
        }
        .shadow-input {
          box-shadow: 0 0 8px rgba(255, 0, 0, 0.3);
        }
        .shadow-button {
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.6);
        }
      `}</style>
    </div>
  );
}
