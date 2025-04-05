import Image from "next/image";
import HomePageNavbar from "./HomePageNavBar";

export default function LoggedinHome() {
  return (
    <div className="relative h-screen w-full">
          
      <HomePageNavbar />
        {/** Movie trailers are going to go here */}
      <div className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out">
      <iframe className="w-full object-cover h-full"
      width=""  
      height="" 
      src="https://www.youtube.com/embed/6COmYeLsz4c?si=0OsX6RuBLpOyoemb&autoplay=1&mute=1&loop=20&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&controls=0" 
      title="YouTube video player" 
      frameBorder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      referrerPolicy="strict-origin-when-cross-origin" 
      allowFullScreen>
      </iframe>
      </div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="absolute flex items-center inset-y-10 left-10 text-white">
        <div className="max-w">
          <h1 className="text-4xl font-bold">Welcome back to CineBook🍿</h1>
          <p className="text-lg mt-4">Experience movies like never before</p>
        </div>
      </div>
    </div>
  );
}
