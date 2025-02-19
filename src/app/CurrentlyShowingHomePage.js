import Cards from './Cards';
import CardsTwo from './CardsTwo';
import MoviePoster from './MoviePosterComingSoon';
import MoviePosterBookTickets from "./MoviePosterBookTickets";

export default function CurrentlyShowingHomePage () {
    {/** Set Movies up here */}
    return(
        <div className="bg-red-600 w-full h-screen">
            <div className='w-full h-[100px] bg-black flex justify-center items-center'>
                <header className='text-xl font-bold text-white text-center'>
                    CineBook - Now Showing
                </header>
            </div>
            <div className='flex flex-row'>
            <MoviePosterBookTickets src="https://ih1.redbubble.net/image.5523872254.6746/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"/>
            <MoviePosterBookTickets src="https://posterspy.com/wp-content/uploads/2024/12/Queer.png"/>
            <MoviePosterBookTickets src="https://www.mvtimes.com/mvt/uploads/2025/01/film-the-brutalist-2.jpg"/>
            <MoviePosterBookTickets src="https://m.media-amazon.com/images/M/MV5BOWMwYjYzYmMtMWQ2Ni00NWUwLTg2MzAtYzkzMDBiZDIwOTMwXkEyXkFqcGc@._V1_.jpg"/>
            </div>
        </div>
    );
}