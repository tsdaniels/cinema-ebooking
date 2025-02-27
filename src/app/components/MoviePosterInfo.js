

export default function MoviePoster({src}){
    if(!{src}) {
        src="https://m.media-amazon.com/images/M/MV5BOWMwYjYzYmMtMWQ2Ni00NWUwLTg2MzAtYzkzMDBiZDIwOTMwXkEyXkFqcGc@._V1_.jpg";
    }
   
  return (
    <div className="shadow-lg ml-10 mt-10 relative">
        <div
        className="group relative 
        flex 
        h-[500px] w-[300px] 
        rounded-lg bg-white 
        text-slate-300"
        >
            <img className="object-cover rounded-lg" src={src}/>
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
            text-white
            font-bold
            items-center
            shadow-lg
            ">
                <a href="/checkout"><p className="ml-4 mt-2 text-center">Book Tickets</p></a>
            </div>
        </div>
    </div>

  );
};

