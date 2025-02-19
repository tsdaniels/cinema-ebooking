import Image from "next/image";
import './page.css';

export default function HeroSectionHomePage() {
  return (
    <div className="relative h-screen w-full">
        {/** Movie trailers are going to go here */}
      <div className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out">
      <iframe className="w-full object-cover h-full"
      width=""
      height="" 
      src="https://www.youtube.com/embed/6COmYeLsz4c?si=0OsX6RuBLpOyoemb&autoplay=1&mute=1&loop=10&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&controls=0" 
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
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold">Welcome to CineBook 🍿</h1>
          <p className="text-lg mt-4">Experience movies like never before</p>
          <div className="flex-col">
            <button className=" mt-6 px-9 py-3 text-lg text-red-700 font-semibold shadow-lg border border-red-700 hover:before:bg-redborder-red-700 relative overflow-hidden transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-red-500 before:transition-all before:duration-500 hover:text-white hover:shadow-red-700 hover:before:left-0 hover:before:w-full group">
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">Login</span>
            </button>
            <button className="ml-6 mt-6 px-6 py-3 text-lg text-red-700 font-semibold shadow-lg border border-red-700 hover:before:bg-redborder-red-700 relative overflow-hidden transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-red-500 before:transition-all before:duration-500 hover:text-white hover:shadow-red-700 hover:before:left-0 hover:before:w-full group">
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">Register</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
