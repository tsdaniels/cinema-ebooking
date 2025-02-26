import MovieCard from './MovieCard';

export default function CardsTwo({ id, title, posterPath, releaseDate, rating }){
    const baseImageUrl = "https://image.tmdb.org/t/p/w500";
    const posterUrl = posterPath 
        ? `${baseImageUrl}${posterPath}`
        : "https://via.placeholder.com/300x500?text=No+Poster";

    return (
        <div className="group relative overflow-hidden
        rounded-xl bg-black/30 backdrop-blur-md border border-red-500/20 
        transition-all duration-300 hover:transform hover:scale-105 hover:bg-black/40
        ">
            <div className="p-4">   
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <span className="text-sm text-red-400 font-medium">Release Date</span>
            </div>
            <div className="aspect-video relative">
                <img 
                    src={posterUrl}
                    alt={title}
                    className="absolute w-full h-full object-cover opacity-80 
                    group-hover:opacity-100 transition-opacity duration-300"
                />

            </div>
        </div>
    );
}