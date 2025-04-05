"use client"
import React, {useState} from "react";

const movieInfo = () => {
    let imgUrl = "https://m.media-amazon.com/images/M/MV5BZDI5YzJhODQtMzQyNy00YWNmLWIxMjUtNDBjNjA5YWRjMzExXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg";
    return(
        <div className="w-full h-full">
            {/**navbar */}
            <div className="">
                <h1 className="p-8 text-xl mb-4 text-white bg-red-700 font-bold">Overview</h1>
            </div>
            <div className="p-8">
            <h2 className="mb-2 text-xl font-bold">Movie title here</h2>
            <p>2025 • 1h 58m</p>
            <button className="mt-2 bg-blue-300 text-blue-700 p-3 rounded-lg font-bold ">
                PG-13
            </button>
            </div>
            <div className="pl-8 pr-8 justify-center flex flex-row">
               <img src={imgUrl} className="w-1/5 h-[400px] mr-4 rounded-lg bg-red-700"  />
               <iframe width="560" height="315" 
               src="https://www.youtube.com/embed/vcJRT6seKgs?si=irHlCa7hAC_Po_oF" 
               title="YouTube video player" frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
               referrerPolicy="strict-origin-when-cross-origin" 
               className="h-[400px] w-3/5 rounded-lg border border-gray-40"
               allowFullScreen></iframe>
            </div>
            <div className="p-8">
                <h1 className="text-xl mb-2 font-bold">Synopsis</h1>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, r
                    emaining essentially unchanged. It was popularised in the 
                    1960s with the release of Letraset sheets containing Lorem 
                    Ipsum passages, and more recently with desktop publishing software 
                    like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
            <div className="p-8">
        {/* Cast Section */}
        <div className="grid grid-cols-3 gap-4">
        {/* Title spanning full width */}
            <div className="col-span-full">
                <h1 className="mb-2 text-xl font-bold">Cast</h1>
            </div>

        {/* Cast Cards */}
            <div className="font-bold cast-card border border-gray-400 rounded-lg p-4 w-[200px] flex justify-center items-center">
                <p>Simone</p>
            </div>
            <div className="font-bold cast-card border border-gray-400 rounded-lg p-4 w-[200px] flex justify-center items-center">
                <p>Gowri</p>
            </div>
            <div className="font-bold cast-card border border-gray-400 rounded-lg p-4 w-[200px] flex justify-center items-center">
                <p>Nate</p>
            </div>
            <div className="font-bold cast-card border border-gray-400 rounded-lg p-4 w-[200px] flex justify-center items-center">
                <p>Jackson</p>
            </div>
            <div className="font-bold cast-card border border-gray-400 rounded-lg p-4 w-[200px] flex justify-center items-center">
                <p>Karyn</p>
            </div>
        </div>
        
        </div>
        <div className="p-8">
            <h1 className="font-bold">Director</h1>
            <p className="font-medium">Lorem Ipsum</p>
        </div>
        <div className="p-8">
            <h1 className="font-bold">Producer</h1>
            <p className="font-medium">Lorem Ipsum</p>
        </div>
    </div>
    )
}

export default movieInfo;