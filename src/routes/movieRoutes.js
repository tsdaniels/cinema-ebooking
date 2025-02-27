import express from "express";
import Movie from "../models/movieSchema.js";

const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        const { title, trailerUrl, status } = req.body;
        const newMovie = new Movie({ title, trailerUrl, status });
        await newMovie.save();
        res.status(201).json({ message: "Movie added successfully", newMovie });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
