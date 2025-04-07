"use client"
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function MovieInfo() {
    const params = useParams();
    const id = params.id;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMovie() {
            try {
                setLoading(true);
                const res = await fetch(`/api/movies/${id}`, {
                    cache: 'no-store'
                });

                if (!res.ok) {
                    setError("Movie not found");
                    return;
                }

                const data = await res.json();
                setMovie(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load movie");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchMovie();
        }
    }, [id]);

    if (loading) return <div className="text-white p-4">Loading...</div>;
    if (error) return <div className="text-white p-4">{error}</div>;
    if (!movie) return <div className="text-white p-4">Movie not found.</div>;

    let imgUrl = movie.posterUrl || "https://m.media-amazon.com/images/M/MV5BZDI5YzJhODQtMzQyNy00YWNmLWIxMjUtNDBjNjA5YWRjMzExXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg";
    
    return(
        <div className="w-full h-full">
            {/**navbar */}
            <div className="">
                <h1 className="p-8 text-xl mb-4 text-white bg-red-700 font-bold">Overview</h1>
            </div>
            <div className="p-8">
            <h2 className="mb-2 text-xl font-bold">{movie.title}</h2>
            <p>{movie.year} • {movie.duration || "1h 58m"}</p>
            <button className="mt-2 bg-blue-300 text-blue-700 p-3 rounded-lg font-bold ">
                {movie.rating || "PG-13"}
            </button>
            </div>
            <div className="pl-8 pr-8 justify-center flex flex-row">
               <img src={imgUrl} className="w-1/5 h-[400px] mr-4 rounded-lg bg-red-700"  />
               <iframe width="560" height="315" 
               src={movie.trailerUrl} 
               title="YouTube video player" frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
               referrerPolicy="strict-origin-when-cross-origin" 
               className="h-[400px] w-3/5 rounded-lg border border-gray-40"
               allowFullScreen></iframe>
            </div>
            <div className="p-8">
                <h1 className="text-xl mb-2 font-bold">Synopsis</h1>
                <p>{movie.synopsis || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}</p>
            </div>
            <div className="p-8">
                {/* Cast Section */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Title spanning full width */}
                    <div className="col-span-full">
                        <h1 className="mb-2 text-xl font-bold">Cast</h1>
                    </div>

                    {/* Cast Cards */}
                   <div>
                    {movie.cast.map((actor, index) => {
                        return(
                        <div key={index} className="font-bold mt-4 cast-card border border-gray-400 rounded-lg p-4 w-[200px] flex justify-center items-center">
                            <p>{actor.name}</p>
                        </div>
                        );
                    })}
                   </div>
                </div>
            </div>
            <div className="p-8">
                <h1 className="font-bold">Director</h1>
                <p className="font-medium">{movie.director || "Lorem Ipsom"}</p>
            </div>
            <div className="p-8">
                <h1 className="font-bold">Producer</h1>
                <p className="font-medium">{movie.producer || "Lorem Ipsom"}</p>
            </div>
        </div>
    );
}