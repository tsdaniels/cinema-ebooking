import { NextResponse } from 'next/server';
import connectMongoDB from '../../../../libs/mongodb';
import { Showtime } from '../../../../models/showtimeSchema';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Connect to the database
    await connectMongoDB();
    const showtime = await Showtime.findById(id);
    if (!showtime) {
      return NextResponse.json({ error: "Showtime not found" }, { status: 404 });
    }
    return NextResponse.json(showtime, { status: 200 });
  } catch (err) {
    console.error("Error fetching showtime:", err);
    return NextResponse.json({ error: "Failed to fetch showtime" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Connect to the database
    await connectMongoDB();
    const result = await Showtime.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Showtime not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Showtime deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting showtime:", err);
    return NextResponse.json({ error: "Failed to delete showtime" }, { status: 500 });
  }
}
