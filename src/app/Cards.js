

export default function Cards() {
    let src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
    return(
        <div className="Container relative overflow-hidden shadow-lg ml-10 mt-10 rounded-lg w-[300px] h-[500px] z-10">
            
            <div className="relative z-10 h-full">
                <div className="overflow-hidden bg-transparent rounded-tl-lg rounded-tr-lg  w-full h-[250px]">
                    <img className="rounded-tl-lg rounded-tr-lg w-full h-full onject-cover"
                        src={src}
                        alt="Movie poster"
                    />
                </div>
            
                <div className="border bg-white border-gray-300 w-full h-1/5">
                    <h2 className="mt-3 ml-4 font-bold text-xl">Title</h2>
                    <button className="ml-4 bg-gray-300 rounded-xl px-4">Genre</button>
                    <p className="mt-3 ml-4 text-gray-600">R • 1h 55m</p>
                </div>
                <div className="border border-t-0 border-gray-300 rounded-bl-lg rounded-br-lg bg-gray-100 w-full h-2/5">
                    <div className="relative z-10 buttonContainer ml-4">
                        <button className="z-10 mt-4 rounded-md px-4 py-2 border border-gray-300 bg-gray-50">11:00 AM</button>
                    </div>
                </div>
            </div>
        </div>
    )
}