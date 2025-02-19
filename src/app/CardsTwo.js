import './CardsTwo.css';

export default function CardsTwo(){
    let src="https://m.media-amazon.com/images/M/MV5BOWMwYjYzYmMtMWQ2Ni00NWUwLTg2MzAtYzkzMDBiZDIwOTMwXkEyXkFqcGc@._V1_.jpg";
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
            ">test</div>
        </div>
    </div>

  );
};

