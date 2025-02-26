import MovieCard from './MovieCard';

export default function CardsTwo({ id, title, posterPath, releaseDate, rating }){
    const baseImageUrl = "https://image.tmdb.org/t/p/w500";
    const posterUrl = posterPath 
        ? `${baseImageUrl}${posterPath}`
        : "https://via.placeholder.com/300x500?text=No+Poster";
  return (
    <div className="ml-10 mt-10 relative">
        <div
        className="group-hover:opacity-75 transition duration-100 absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 opacity-75 blur"
        ></div>
        <div
        className="group relative 
        flex 
        h-[500px] w-[300px] 
        rounded-lg bg-white 
        text-slate-300"
        >
          <div className='rounded-tl-lg rounded-tr-lg w-full absolute top-0 h-[50px] bg-red-600'>
          <h1>{title}</h1>
          </div>
            <img className="object-cover rounded-lg" src={posterUrl}/>
            <div className="absolute bottom-0 
            bg-red-600 
            w-[300px] h-[50px]
            opacity-0
            translate-y-full
            group-hover:translate-y-0
            group-hover:opacity-100 
            transition-all duration-500 ease-in-out
            rounded-bl-lg rounded-br-lg
            border-t border-red-700
            ">test</div>
            
        </div>
    </div>

  );
};

