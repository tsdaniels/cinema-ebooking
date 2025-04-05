import dbConnect from '../../../../libs/mongodb';
import Moive, { Movie } from '../../../../models/movieSchema';

export async function GET(req, { params }) {
    const { id } = params;

    await dbConnect();

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