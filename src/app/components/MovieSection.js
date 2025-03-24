export default function MovieSection({title, movies}) {
    return(
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols2 lg:grid-cols-3 gap4">
            </div>
        </div>
    )
}