import connectMongoDB from '../../../../libs/mongodb';
import  Movie  from '../../../../models/movieSchema';

export async function GET(req, { params }) {
    const { id } = params;

    await connectMongoDB();

    try {
        const movie = await Movie.findById(id); 
        if(!movie) {
            return new Response(JSON.stringify({ message: 'Movie not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(movie), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;
    
    await dbConnect();
    
    try {
        const deletedMovie = await Movie.findByIdAndDelete(id);
        
        if (!deletedMovie) {
            return new Response(JSON.stringify({ message: 'Movie not found' }), { status: 404 });
        }
        
        return new Response(JSON.stringify({ message: 'Movie deleted successfully' }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' } 
        });
    } catch (error) {
        console.error("Delete error:", error);
        return new Response(JSON.stringify({ message: 'Error deleting movie' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}