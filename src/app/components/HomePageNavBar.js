'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import MovieCard from "./MovieCard";

export default function HomePageNavbar() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const defaultProfile = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [newPlaying, setNowPlaying] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [query, setQuery] = useState("");

  const generateKey = (movie) => {
    const str = `${movie.title}`;
    return CryptoJS.MD5(str).toString();
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/movies/");
        if (!response) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies: ", error);
      }
    };
    fetchMovies();
  }, []);

  function categorizeMovies(movies) {
    const nowPlayingMovies = [];
    const comingSoonMovies = [];

    movies.forEach((movie) => {
      if (movie.status === "showing_now") {
        nowPlayingMovies.push(movie);
      } else {
        comingSoonMovies.push(movie);
      }
    });

    setNowPlaying(nowPlayingMovies);
    setComingSoon(comingSoonMovies);
  }

  async function handleSearch(e) {
    e.preventDefault();
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    if (query.trim() === "") {
      setNowPlaying([]);
      setComingSoon([]);
      return;
    }
    if (filteredMovies.length === 0) {
      setNowPlaying([]);
      setComingSoon([]);
    } else {
      categorizeMovies(filteredMovies);
    }
  }

  const handleLogout = () => {
    // Clear any authentication tokens or user data here.
    // For example, remove token from local storage or cookies:
    localStorage.removeItem("authToken"); // example

    // Redirect to the login page after logging out
    router.push("/login"); // Redirect to login page
  };

  return (
    <nav className="flex justify-center items-center z-50 fixed top-0 bg-red-900 w-full h-[95px]">
      <div className="text-white text-4xl ml-4 font-semibold">Cinebook🍿</div>
        <div className="flex items-center gap-4 ml-auto">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 w-4/5 h-10 rounded-lg shadow border border-gray-200 text-black px-4"
              placeholder="Search Movies..."
            />
            <button
              type="submit"
              className="px-4 bg-black h-10 text-white rounded-md hover:bg-red-800 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      <div
        className="relative bg-white w-[50px] h-[50px] rounded-full cursor-pointer ml-10 mr-4"
        onClick={() => setDropdownVisible((prev) => !prev)}
      >
        <img className="object-cover rounded-full w-full h-full" alt="Profile" src={defaultProfile} />
        
        {/* Dropdown menu */}
        {isDropdownVisible && (
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 shadow-lg rounded-lg">
            <ul className="py-2">
              <li>
                <button onClick={() => router.push('/editProfile')} >
                  <span className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Edit Profile</span>
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}