import MoviePoster from './MoviePosterInfo';

export default function ComingSoon () {
    {/** Set Movies up here */}
    return(
        <div className="bg-black w-full h-screen">
            <div className='w-full h-[100px] bg-black flex justify-center items-center'>
                <header className='text-xl font-bold text-white text-center'>
                    CineBook - Coming Soon
                </header>
            </div>
            <div className='flex items-center justify-center flex-row'>
            <div className='flex flex-row'>
                <MoviePoster src="https://ih1.redbubble.net/image.5523872254.6746/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"/>
                <MoviePoster src="https://posterspy.com/wp-content/uploads/2024/12/Queer.png"/>
                <MoviePoster src="https://www.mvtimes.com/mvt/uploads/2025/01/film-the-brutalist-2.jpg"/>
            <MoviePoster src="https://m.media-amazon.com/images/M/MV5BOWMwYjYzYmMtMWQ2Ni00NWUwLTg2MzAtYzkzMDBiZDIwOTMwXkEyXkFqcGc@._V1_.jpg"/>
            </div>
            </div>
        </div>
    );
}