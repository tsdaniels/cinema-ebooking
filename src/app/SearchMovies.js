import MovieSection from "./MovieSection";

export default function SearchMovies() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-black via-red-950 to-red-900 overflow-hidden">
      {/* Twinkling stars layer */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-75 animate-twinkle"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${1.5 + Math.random() * 1}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 w-full h-full mx-auto px-4 py-8 text-white">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Cinema E-Booking System
        </h1>

        <form className="flex gap-2 justify-center">
          <input
            className="flex-1 mb-8 w-4/5 h-[30px] rounded-lg shadow border border-gray-200 text-black px-2" 
            placeholder="Search Movies..."
          />
          <button className="p-2 bg-blue-600 h-[30px] w-[30px] text-white rounded-md"></button>
        </form>

        <MovieSection title="Now Showing" />
        <MovieSection title="Coming Soon" />
      </div>
    </div>
  );
}
