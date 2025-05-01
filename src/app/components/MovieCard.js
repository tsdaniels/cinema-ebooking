import MovieCard from './MovieCard';

export default function CardsTwo({ title, trailerUrl, status}){
    const baseImageUrl = "https://image.tmdb.org/t/p/w500";
    
    return (
        <div className="group relative overflow-hidden
        rounded-xl bg-black/30 backdrop-blur-md border border-red-500/20 
        transition-all duration-300 hover:transform hover:scale-105 hover:bg-black/40
        ">
            <div className="p-4">   
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <span className="text-sm text-red-400 font-medium">Release Date</span>
            </div>
            <div className="w-full aspect-video relative">
                <iframe
                    className='h-full w-full'
                    src={trailerUrl}
                    allowFullScreen
                ></iframe>
                {status === "showing_now" && (
                    <button className='mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition'>
                        Book Ticket
                    </button>
                )}
            </div>
        </div>
    );
}