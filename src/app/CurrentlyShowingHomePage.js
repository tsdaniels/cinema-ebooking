

export default function Test () {
    {/** Set Movies up here */}
    return(
        <div className="bg-gradient-to-b from-red-600 to-rose-800 text-center w-full h-screen">
            <div className="">
                <h1 className="space-y-10 text-white text-xl font-bold">Showing Now 🍿</h1>
            </div>
            <div className="flex flex-wrap gap-6">
                <div className="flex-1 h- max-w-md bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <div className="flex flex-col h-full">
                        <div className="w-full h-48 overflow-hidden">
                        <img className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        
                            src="https://m.media-amazon.com/images/M/MV5BOWMwYjYzYmMtMWQ2Ni00NWUwLTg2MzAtYzkzMDBiZDIwOTMwXkEyXkFqcGc@._V1_.jpg"
                            alt=""
                           /> 
                        </div>
                        <div className="flex-1 p-4">
                            <h2 className="text-xl font-semibold mb-2">Movie title</h2>
                            <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                Genre
                            </span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p>Movie Rating • Movie duration</p>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                                    Time
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                
            </div>
           
        </div>
    )
}